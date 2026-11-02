/* WEB SERVER FOR THE C TRIAGE BOARD
   The web page (c/web/) only draws the board. Every rule (priority,
   queue, beds, reading the Prolog file) runs here, in hospital.c.

   Build and start it from the project root folder:
     Windows:  gcc c/server.c c/hospital.c -o triage-server -lws2_32
     Linux:    gcc c/server.c c/hospital.c -o triage-server
     ./triage-server          (or: ./triage-server 8081)
   then open http://localhost:8001/ (Ctrl+C stops it)

   The page uses these APIs. They answer with JSON.
     GET  /api/state        the whole board
     GET  /api/intake-file  the text of data/intake_records.txt
     POST /api/preview      intake text -> the patients in it, not added yet
     POST /api/import       intake text -> adds the patients
     POST /api/priority     NAME=, SYMPTOMS=, VISIBLE= -> priority and reason
     POST /api/add          NAME=, SYMPTOMS=, VISIBLE= -> adds the patient
     POST /api/admit        admits the next patient
     POST /api/discharge    ID= -> discharges that patient
     POST /api/search       NAME= -> patients whose name contains it
     POST /api/clear        empties the board
   POST bodies are KEY=value lines, the same style as the intake file. */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>
#include <stdarg.h>
#include <time.h>

#ifdef _WIN32
#include <winsock2.h>
typedef SOCKET socket_t;
#define close_socket closesocket
#else
#include <sys/socket.h>
#include <sys/select.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
typedef int socket_t;
#define INVALID_SOCKET -1
#define close_socket close
#endif

#ifndef MSG_NOSIGNAL
#define MSG_NOSIGNAL 0
#endif

#include "hospital.h"

#define DEFAULT_PORT 8001
#define MAX_REQUEST (1024 * 1024)
#define MAX_CLIENTS 32       /* open connections at the same time */
#define IDLE_SECONDS 30      /* close a connection that sends nothing */

static Hospital hospital;
static int showing_samples = 0;
static const char *web_dir = "c/web";


/* ---------- Growing text buffer for the replies ---------- */

typedef struct {
    char *data;
    size_t len;
    size_t cap;
} Buf;

static void buf_add(Buf *b, const char *fmt, ...) {
    va_list args;
    va_start(args, fmt);
    int need = vsnprintf(NULL, 0, fmt, args);
    va_end(args);

    if (b->len + need + 1 > b->cap) {
        b->cap = (b->len + need + 1) * 2;
        b->data = (char *)realloc(b->data, b->cap);
        if (b->data == NULL) {
            fprintf(stderr, "Out of memory.\n");
            exit(1);
        }
    }
    va_start(args, fmt);
    vsnprintf(b->data + b->len, need + 1, fmt, args);
    va_end(args);
    b->len += need;
}

/* Add a text as a JSON string, with quotes and escapes */
static void buf_json_string(Buf *b, const char *s) {
    buf_add(b, "\"");
    for (; *s != '\0'; s++) {
        unsigned char c = (unsigned char)*s;
        if (c == '"' || c == '\\') buf_add(b, "\\%c", c);
        else if (c < 0x20) buf_add(b, "\\u%04x", c);
        else buf_add(b, "%c", c);
    }
    buf_add(b, "\"");
}


/* ---------- Patients and the board as JSON ---------- */

static const char *status_name(PatientStatus status) {
    if (status == STATUS_ADMITTED) return "admitted";
    if (status == STATUS_DISCHARGED) return "discharged";
    return "waiting";
}

static void json_patient(Buf *b, const Patient *p, int index) {
    char why[WHY_LEN];
    int priority = compute_priority(p, why, sizeof(why));

    buf_add(b, "{\"index\":%d,\"id\":", index);
    buf_json_string(b, p->id);
    buf_add(b, ",\"name\":");
    buf_json_string(b, p->name);
    buf_add(b, ",\"category\":");
    buf_json_string(b, p->category);
    buf_add(b, ",\"likely\":");
    buf_json_string(b, p->likely_condition);
    buf_add(b, ",\"age\":%d,\"highRisk\":%s,\"symptoms\":[", p->age, p->high_risk ? "true" : "false");
    for (int i = 0; i < p->symptom_count; i++) {
        if (i > 0) buf_add(b, ",");
        buf_json_string(b, p->symptoms[i]);
    }
    buf_add(b, "],\"visible\":[");
    for (int i = 0; i < p->visible_count; i++) {
        buf_add(b, i > 0 ? ",%d" : "%d", p->visible[i]);
    }
    buf_add(b, "],\"priority\":%d,\"why\":", priority);
    buf_json_string(b, why);
    buf_add(b, ",\"status\":\"%s\",\"bed\":%d}", status_name(p->status), p->bed);
}

static void json_state(Buf *b) {
    buf_add(b, "{\"capacity\":%d,\"maxPatients\":%d,\"maxSymptoms\":%d,\"maxVisible\":%d,\"sample\":%s,",
            HOSPITAL_CAPACITY, MAX_PATIENTS, MAX_SYMPTOMS, MAX_VISIBLE, showing_samples ? "true" : "false");

    buf_add(b, "\"visibleConditions\":[");
    for (int i = 0; i < NUM_VISIBLE_CONDITIONS; i++) {
        buf_add(b, i > 0 ? ",{\"name\":" : "{\"name\":");
        buf_json_string(b, VISIBLE_CONDITIONS[i].name);
        buf_add(b, ",\"priority\":%d}", VISIBLE_CONDITIONS[i].priority);
    }

    buf_add(b, "],\"emergency\":[");
    for (int i = 0; i < NUM_EMERGENCY; i++) {
        if (i > 0) buf_add(b, ",");
        buf_json_string(b, EMERGENCY_CONDITIONS[i]);
    }

    buf_add(b, "],\"records\":[");
    for (int i = 0; i < hospital.record_count; i++) {
        if (i > 0) buf_add(b, ",");
        json_patient(b, &hospital.records[i], i);
    }

    // the waiting queue, in order, as record indexes
    buf_add(b, "],\"queue\":[");
    for (QueueNode *node = hospital.queue.head; node != NULL; node = node->next) {
        buf_add(b, node == hospital.queue.head ? "%d" : ",%d", node->record_index);
    }
    buf_add(b, "]}");
}

/* Reply for the actions that change the board: ok, message and the new board */
static void json_action(Buf *b, int ok, const char *message) {
    buf_add(b, "{\"ok\":%s,\"message\":", ok ? "true" : "false");
    buf_json_string(b, message);
    buf_add(b, ",\"state\":");
    json_state(b);
    buf_add(b, "}");
}


/* ---------- Reading the request bodies ---------- */

/* Read KEY=value lines from the manual entry form into a patient.
   VISIBLE is a list of visible condition numbers (0 to 6); the other
   keys are read like the intake file. */
static void read_form(char *body, Patient *p) {
    char *line = body;
    while (line != NULL) {
        char *next = strchr(line, '\n');
        if (next != NULL) {
            *next = '\0';
            next++;
        }
        line[strcspn(line, "\r")] = 0;

        char *equals = strchr(line, '=');
        if (equals != NULL) {
            *equals = '\0';
            char *val = equals + 1;
            if (equals_ignore_case(line, "VISIBLE")) {
                while (*val != '\0' && p->visible_count < MAX_VISIBLE) {
                    char *end;
                    long choice = strtol(val, &end, 10);
                    if (end == val) break;
                    int seen = 0;
                    for (int i = 0; i < p->visible_count; i++) {
                        if (p->visible[i] == choice) seen = 1;
                    }
                    if (!seen && choice >= 0 && choice < NUM_VISIBLE_CONDITIONS) {
                        p->visible[p->visible_count++] = (int)choice;
                    }
                    val = (*end == ',') ? end + 1 : end;
                }
            } else {
                read_field(p, line, val);
            }
        }
        line = next;
    }
}

static int find_record(const char *id) {
    for (int i = 0; i < hospital.record_count; i++) {
        if (equals_ignore_case(hospital.records[i].id, id)) {
            return i;
        }
    }
    return -1;
}

/* An imported patient needs a name and an ID that is not on the board yet */
static int importable(const Patient *p) {
    return p->name[0] != '\0' && !(p->id[0] != '\0' && id_exists(&hospital, p->id));
}


/* ---------- The APIs ---------- */

static void api_intake_file(Buf *out) {
    char *text = read_file(INTAKE_FILE, NULL);
    if (text == NULL) {
        // started from inside the c/ folder: data/ is one level up
        text = read_file("../" INTAKE_FILE, NULL);
    }
    if (text == NULL) {
        buf_add(out, "{\"ok\":false,\"message\":\"No intake file yet. Save a patient on the Prolog intake page first.\",\"text\":\"\"}");
        return;
    }
    buf_add(out, "{\"ok\":true,\"message\":\"\",\"text\":");
    buf_json_string(out, text);
    buf_add(out, "}");
    free(text);
}

static void api_preview(char *body, Buf *out) {
    static Patient found[MAX_PATIENTS];
    int count = parse_intake(body, found, MAX_PATIENTS);

    buf_add(out, "{\"patients\":[");
    for (int i = 0; i < count; i++) {
        if (i > 0) buf_add(out, ",");
        // the same JSON as a record, plus why it could not be imported
        json_patient(out, &found[i], -1);
        out->len--;  // remove the closing }
        buf_add(out, ",\"duplicate\":%s,\"hasName\":%s}",
                (found[i].id[0] != '\0' && id_exists(&hospital, found[i].id)) ? "true" : "false",
                found[i].name[0] != '\0' ? "true" : "false");
    }
    buf_add(out, "],\"nextId\":\"P%03d\"}", hospital.next_arrival_no);
}

static void api_import(char *body, Buf *out) {
    static Patient found[MAX_PATIENTS];
    int count = parse_intake(body, found, MAX_PATIENTS);
    char message[200];

    if (count == 0) {
        json_action(out, 0, "No patient data was found in the file.");
        return;
    }

    int added = 0, last = -1, full = 0;
    for (int i = 0; i < count; i++) {
        if (!importable(&found[i])) continue;
        int index = add_patient(&hospital, &found[i]);
        if (index == ADD_FULL) {
            full = 1;
            break;
        }
        if (index >= 0) {
            added++;
            last = index;
        }
    }

    if (added == 0) {
        json_action(out, 0, full ? "Records array is full."
                                 : "Every patient in the file is already in the records or has no NAME.");
    } else if (added == 1) {
        Patient *p = &hospital.records[last];
        snprintf(message, sizeof(message), "Imported %s (%s) with Priority %d.", p->name, p->id, p->priority);
        json_action(out, 1, message);
    } else {
        snprintf(message, sizeof(message), "Imported %d patients. %d skipped.", added, count - added);
        json_action(out, 1, message);
    }
}

static void api_priority(char *body, Buf *out) {
    Patient p;
    memset(&p, 0, sizeof(Patient));
    read_form(body, &p);

    char why[WHY_LEN];
    int priority = compute_priority(&p, why, sizeof(why));
    buf_add(out, "{\"priority\":%d,\"why\":", priority);
    buf_json_string(out, why);
    buf_add(out, "}");
}

static void api_add(char *body, Buf *out) {
    Patient p;
    memset(&p, 0, sizeof(Patient));
    read_form(body, &p);
    p.id[0] = '\0';  // manual patients always get a new P### number

    if (p.name[0] == '\0') {
        json_action(out, 0, "Enter the patient name.");
        return;
    }
    int index = add_patient(&hospital, &p);
    if (index < 0) {
        json_action(out, 0, "Records array is full.");
        return;
    }
    char message[200];
    Patient *added = &hospital.records[index];
    snprintf(message, sizeof(message), "Added %s (%s) with Priority %d.", added->name, added->id, added->priority);
    json_action(out, 1, message);
}

static void api_admit(Buf *out) {
    int index = admit_next(&hospital);
    if (index == ADMIT_NOBODY) {
        json_action(out, 0, "Nobody is waiting.");
    } else if (index == ADMIT_NO_BEDS) {
        json_action(out, 0, "No free beds! Hospital is full.");
    } else {
        char message[200];
        Patient *p = &hospital.records[index];
        snprintf(message, sizeof(message), "Admitted %s (%s) to bed %d.", p->name, p->id, p->bed);
        json_action(out, 1, message);
    }
}

static void api_discharge(char *body, Buf *out) {
    Patient form;
    memset(&form, 0, sizeof(Patient));
    read_form(body, &form);  // only the ID line is used

    int index = find_record(form.id);
    if (!discharge(&hospital, index)) {
        json_action(out, 0, "Invalid selection.");
        return;
    }
    char message[100];
    snprintf(message, sizeof(message), "Patient %s discharged.", hospital.records[index].id);
    json_action(out, 1, message);
}

/* Same match as search_patient() in triage.c: part of the name, any case */
static void api_search(char *body, Buf *out) {
    Patient form;
    memset(&form, 0, sizeof(Patient));
    read_form(body, &form);  // only the NAME line is used

    char query[50];
    snprintf(query, sizeof(query), "%s", form.name);
    for (int j = 0; query[j]; j++) query[j] = tolower((unsigned char)query[j]);

    buf_add(out, "{\"results\":[");
    int count = 0;
    for (int i = 0; i < hospital.record_count && query[0] != '\0'; i++) {
        char name_lower[50];
        snprintf(name_lower, sizeof(name_lower), "%s", hospital.records[i].name);
        for (int j = 0; name_lower[j]; j++) name_lower[j] = tolower((unsigned char)name_lower[j]);

        if (strstr(name_lower, query) != NULL) {
            if (count > 0) buf_add(out, ",");
            json_patient(out, &hospital.records[i], i);
            count++;
        }
    }
    buf_add(out, "]}");
}

static void api_clear(Buf *out) {
    hospital_free(&hospital);
    showing_samples = 0;
    json_action(out, 1, "The board is empty. Import the intake file or add a patient.");
}


/* ---------- Example patients, so the board can be tried out ---------- */

static void add_sample(const char *id, const char *name, const char *category, const char *likely,
                       const char *symptoms, int visible) {
    Patient p;
    memset(&p, 0, sizeof(Patient));
    snprintf(p.id, sizeof(p.id), "%s", id);
    snprintf(p.name, sizeof(p.name), "%s", name);
    snprintf(p.category, sizeof(p.category), "%s", category);
    snprintf(p.likely_condition, sizeof(p.likely_condition), "%s", likely);

    char list[200];
    snprintf(list, sizeof(list), "%s", symptoms);
    read_field(&p, "SYMPTOMS", list);
    if (visible >= 0) {
        p.visible[0] = visible;
        p.visible_count = 1;
    }
    add_patient(&hospital, &p);
}

static void load_samples(void) {
    add_sample("", "Maria Santos", "", "", "leg_pain,swelling", 3);
    add_sample("", "Jun Reyes", "", "", "fever,cough", -1);
    add_sample("", "Lito Navarro", "", "", "", 0);
    add_sample("", "Ana Dizon", "", "", "", 6);
    add_sample("PL-014", "Rafael Cruz", "infectious", "meningitis", "fever,stiff_neck,headache", -1);
    add_sample("", "Ines Bautista", "", "", "ankle_pain", 5);
    add_sample("", "Paolo Garcia", "", "", "pain", 2);

    admit_next(&hospital);
    admit_next(&hospital);
    admit_next(&hospital);
    for (int i = 0; i < hospital.record_count; i++) {
        if (hospital.records[i].status == STATUS_ADMITTED) {
            discharge(&hospital, i);
            break;
        }
    }
    showing_samples = 1;
}


/* ---------- HTTP ---------- */

static void send_all(socket_t client, const char *data, size_t len) {
    while (len > 0) {
        int sent = send(client, data, (int)len, MSG_NOSIGNAL);
        if (sent <= 0) return;
        data += sent;
        len -= sent;
    }
}

static void send_reply(socket_t client, int code, const char *type, const char *body, size_t len) {
    char head[256];
    const char *text = code == 200 ? "OK" : code == 404 ? "Not Found" : "Bad Request";
    int head_len = snprintf(head, sizeof(head),
        "HTTP/1.1 %d %s\r\nContent-Type: %s\r\nContent-Length: %lu\r\n"
        "Cache-Control: no-store\r\nConnection: close\r\n\r\n",
        code, text, type, (unsigned long)len);
    send_all(client, head, head_len);
    send_all(client, body, len);
}

static const char *content_type(const char *path) {
    const char *dot = strrchr(path, '.');
    if (dot == NULL) return "application/octet-stream";
    if (equals_ignore_case(dot, ".html")) return "text/html; charset=utf-8";
    if (equals_ignore_case(dot, ".css")) return "text/css; charset=utf-8";
    if (equals_ignore_case(dot, ".js")) return "text/javascript; charset=utf-8";
    if (equals_ignore_case(dot, ".svg")) return "image/svg+xml";
    if (equals_ignore_case(dot, ".png")) return "image/png";
    return "application/octet-stream";
}

/* Send a file from c/web/. "/" means index.html. */
static void serve_file(socket_t client, const char *url) {
    const char *not_found = "Not found";
    if (strstr(url, "..") != NULL || strchr(url, '\\') != NULL) {
        send_reply(client, 404, "text/plain", not_found, strlen(not_found));
        return;
    }

    char path[512];
    snprintf(path, sizeof(path), "%s%s", web_dir, strcmp(url, "/") == 0 ? "/index.html" : url);
    long size;
    char *data = read_file(path, &size);
    if (data == NULL) {
        send_reply(client, 404, "text/plain", not_found, strlen(not_found));
        return;
    }
    send_reply(client, 200, content_type(path), data, size);
    free(data);
}

/* Find "Content-Length: N" in the request headers (any case) */
static long content_length(const char *head, const char *head_end) {
    const char *key = "content-length:";
    for (const char *line = head; line < head_end; line++) {
        if (line != head && line[-1] != '\n') continue;
        int i = 0;
        while (key[i] != '\0' && tolower((unsigned char)line[i]) == key[i]) i++;
        if (key[i] == '\0') {
            return atol(line + i);
        }
    }
    return 0;
}

static void handle_client(socket_t client) {
    static char req[MAX_REQUEST + 1];
    long len = 0, need = -1;
    char *body = NULL;

    // read the headers, then the body (Content-Length bytes)
    while (len < MAX_REQUEST) {
        int got = recv(client, req + len, (int)(MAX_REQUEST - len), 0);
        if (got <= 0) break;
        len += got;
        req[len] = '\0';

        if (body == NULL) {
            char *head_end = strstr(req, "\r\n\r\n");
            if (head_end != NULL) {
                body = head_end + 4;
                need = (body - req) + content_length(req, head_end);
                if (need > MAX_REQUEST) need = MAX_REQUEST;
            }
        }
        if (body != NULL && len >= need) break;
    }
    if (body == NULL) {
        return; // not a full request
    }
    req[need] = '\0';

    char method[8], url[256];
    if (sscanf(req, "%7s %255s", method, url) != 2) {
        send_reply(client, 400, "text/plain", "Bad request", 11);
        return;
    }
    char *query = strchr(url, '?');
    if (query != NULL) *query = '\0';

    int is_get = strcmp(method, "GET") == 0;
    int is_post = strcmp(method, "POST") == 0;
    Buf out = {NULL, 0, 0};

    if (is_get && strcmp(url, "/api/state") == 0) json_state(&out);
    else if (is_get && strcmp(url, "/api/intake-file") == 0) api_intake_file(&out);
    else if (is_post && strcmp(url, "/api/preview") == 0) api_preview(body, &out);
    else if (is_post && strcmp(url, "/api/import") == 0) api_import(body, &out);
    else if (is_post && strcmp(url, "/api/priority") == 0) api_priority(body, &out);
    else if (is_post && strcmp(url, "/api/add") == 0) api_add(body, &out);
    else if (is_post && strcmp(url, "/api/admit") == 0) api_admit(&out);
    else if (is_post && strcmp(url, "/api/discharge") == 0) api_discharge(body, &out);
    else if (is_post && strcmp(url, "/api/search") == 0) api_search(body, &out);
    else if (is_post && strcmp(url, "/api/clear") == 0) api_clear(&out);
    else if (is_get) {
        serve_file(client, url);
        return;
    } else {
        send_reply(client, 404, "text/plain", "Not found", 9);
        return;
    }

    send_reply(client, 200, "application/json", out.data, out.len);
    free(out.data);
}

static void close_client(socket_t client) {
#ifdef _WIN32
    shutdown(client, SD_SEND);
#else
    shutdown(client, SHUT_WR);
#endif
    close_socket(client);
}

int main(int argc, char *argv[]) {
    int port = argc > 1 ? atoi(argv[1]) : DEFAULT_PORT;
    if (port <= 0) port = DEFAULT_PORT;

    // started from inside the c/ folder: the page is in web/
    FILE *check = fopen("c/web/index.html", "r");
    if (check != NULL) {
        fclose(check);
    } else {
        web_dir = "web";
    }

#ifdef _WIN32
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0) {
        printf("Could not start Windows networking.\n");
        return 1;
    }
#endif

    socket_t server = socket(AF_INET, SOCK_STREAM, 0);
    if (server == INVALID_SOCKET) {
        printf("Could not create the server socket.\n");
        return 1;
    }
    int yes = 1;
    setsockopt(server, SOL_SOCKET, SO_REUSEADDR, (const char *)&yes, sizeof(yes));

    // only this computer can open the board
    struct sockaddr_in addr;
    memset(&addr, 0, sizeof(addr));
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = htonl(INADDR_LOOPBACK);
    addr.sin_port = htons((unsigned short)port);

    if (bind(server, (struct sockaddr *)&addr, sizeof(addr)) != 0 || listen(server, 16) != 0) {
        printf("Port %d is already in use. Try: triage-server 8081\n", port);
        close_socket(server);
        return 1;
    }

    hospital_init(&hospital);
    load_samples();
    printf("C triage server running at http://localhost:%d/ (Ctrl+C stops it)\n", port);
    fflush(stdout);

    // Browsers open spare connections and send nothing on them until later.
    // select() waits on all open connections and we only answer the ones
    // that sent a request. Requests are still answered one at a time, so two
    // clicks can never change the board together.
    socket_t clients[MAX_CLIENTS];
    time_t opened[MAX_CLIENTS];
    int client_count = 0;

    while (1) {
        fd_set ready;
        FD_ZERO(&ready);
        FD_SET(server, &ready);
        socket_t highest = server;
        for (int i = 0; i < client_count; i++) {
            FD_SET(clients[i], &ready);
            if (clients[i] > highest) highest = clients[i];
        }
        struct timeval wait = {5, 0};
        int count = select((int)highest + 1, &ready, NULL, NULL, &wait);
        time_t now = time(NULL);

        // close connections that are answered, or quiet for too long
        for (int i = client_count - 1; i >= 0; i--) {
            int has_request = count > 0 && FD_ISSET(clients[i], &ready);
            if (!has_request && now - opened[i] < IDLE_SECONDS) continue;
            if (has_request) handle_client(clients[i]);
            close_client(clients[i]);
            clients[i] = clients[--client_count];
            opened[i] = opened[client_count];
        }

        if (count > 0 && FD_ISSET(server, &ready)) {
            socket_t client = accept(server, NULL, NULL);
            if (client == INVALID_SOCKET) continue;
            if (client_count == MAX_CLIENTS) {
                close_client(clients[0]);  // too many: drop the oldest
                clients[0] = clients[--client_count];
                opened[0] = opened[client_count];
            }
            // a request that stops halfway is given up after 2 seconds
#ifdef _WIN32
            DWORD timeout = 2000;
#else
            struct timeval timeout = {2, 0};
#endif
            setsockopt(client, SOL_SOCKET, SO_RCVTIMEO, (const char *)&timeout, sizeof(timeout));
            clients[client_count] = client;
            opened[client_count] = now;
            client_count++;
        }
    }
}
