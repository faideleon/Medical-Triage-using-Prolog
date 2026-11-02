#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "hospital.h"

/* Visible conditions array */
VisibleCondition VISIBLE_CONDITIONS[NUM_VISIBLE_CONDITIONS] = {
    {"Heavy bleeding", PRIORITY_CRITICAL},
    {"Unconscious", PRIORITY_CRITICAL},
    {"Severe burn", PRIORITY_EMERGENT},
    {"Broken leg", PRIORITY_URGENT},
    {"Deep cut", PRIORITY_URGENT},
    {"Sprained joint", PRIORITY_LESS_URGENT},
    {"Minor scrape", PRIORITY_NON_URGENT}
};

/* Emergency list from Prolog */
const char *EMERGENCY_CONDITIONS[] = {
    "stroke", "sepsis", "meningitis", "meningococcemia",
    "ischemic_heart_disease", "diphtheria", "rabies", "tetanus"
};
int NUM_EMERGENCY = 8;

void hospital_init(Hospital *h) {
    h->record_count = 0;
    h->next_arrival_no = 1;
    h->queue.head = NULL;
    h->queue.length = 0;
}

/* Free the queue memory and empty the records */
void hospital_free(Hospital *h) {
    QueueNode *curr = h->queue.head;
    while (curr != NULL) {
        QueueNode *temp = curr;
        curr = curr->next;
        free(temp);
    }
    hospital_init(h);
}

/* Helper to compare strings without case sensitivity */
int equals_ignore_case(const char *a, const char *b) {
    while (*a != '\0' && *b != '\0') {
        if (tolower((unsigned char)*a) != tolower((unsigned char)*b)) {
            return 0;
        }
        a++;
        b++;
    }
    return *a == *b;
}

/* Check if condition is in emergency list */
int is_emergency(const char *condition) {
    for (int i = 0; i < NUM_EMERGENCY; i++) {
        if (equals_ignore_case(condition, EMERGENCY_CONDITIONS[i])) {
            return 1;
        }
    }
    return 0;
}

/* Calculate priority score (1 to 5) and the reason that decided it */
int compute_priority(const Patient *p, char *why, size_t why_len) {
    int best = PRIORITY_NON_URGENT;
    char reason[WHY_LEN] = "No symptoms or visible conditions recorded.";

    if (p->symptom_count > 0) {
        best = PRIORITY_LESS_URGENT;
        snprintf(reason, sizeof(reason), "Symptoms reported.");
    }

    /* Prolog flags high-risk signs (HIGH_RISK=YES): never below Emergent */
    if (p->high_risk && PRIORITY_EMERGENT < best) {
        best = PRIORITY_EMERGENT;
        snprintf(reason, sizeof(reason), "Prolog flagged a high-risk sign.");
    }

    if (is_emergency(p->likely_condition)) {
        best = PRIORITY_CRITICAL;
        snprintf(reason, sizeof(reason), "Likely condition %s is on the emergency list.", p->likely_condition);
    }

    for (int i = 0; i < p->visible_count; i++) {
        int level = VISIBLE_CONDITIONS[p->visible[i]].priority;
        if (level < best) {
            best = level;
            snprintf(reason, sizeof(reason), "%s is visible.", VISIBLE_CONDITIONS[p->visible[i]].name);
        }
    }

    if (why != NULL) {
        snprintf(why, why_len, "%s", reason);
    }
    return best;
}

/* Insert patient into linked list queue sorted by priority */
void insert_to_queue(Hospital *h, int rec_index) {
    QueueNode *new_node = (QueueNode *)malloc(sizeof(QueueNode));
    if (new_node == NULL) {
        fprintf(stderr, "Out of memory.\n");
        exit(1);
    }
    new_node->record_index = rec_index;
    new_node->next = NULL;

    Patient *new_p = &h->records[rec_index];

    // If queue is empty or new patient has higher priority than head
    if (h->queue.head == NULL) {
        h->queue.head = new_node;
    } else {
        Patient *head_p = &h->records[h->queue.head->record_index];

        if (new_p->priority < head_p->priority ||
           (new_p->priority == head_p->priority && new_p->arrival_no < head_p->arrival_no)) {
            new_node->next = h->queue.head;
            h->queue.head = new_node;
        } else {
            QueueNode *curr = h->queue.head;
            while (curr->next != NULL) {
                Patient *next_p = &h->records[curr->next->record_index];
                if (new_p->priority < next_p->priority ||
                   (new_p->priority == next_p->priority && new_p->arrival_no < next_p->arrival_no)) {
                    break;
                }
                curr = curr->next;
            }
            new_node->next = curr->next;
            curr->next = new_node;
        }
    }
    h->queue.length++;
}

/* Check if a patient ID is already in the records */
int id_exists(Hospital *h, const char *id) {
    for (int i = 0; i < h->record_count; i++) {
        if (equals_ignore_case(h->records[i].id, id)) {
            return 1;
        }
    }
    return 0;
}

/* Read one KEY=value line from the Prolog file into the patient.
   The keys are explained in docs/INTAKE_FILE_FORMAT.md. */
void read_field(Patient *p, const char *key, char *val) {
    if (equals_ignore_case(key, "ID")) {
        // Prolog numbers patients 1, 2, 3...; show them as PL-001
        if (val[0] != '\0' && strspn(val, "0123456789") == strlen(val)) {
            snprintf(p->id, sizeof(p->id), "PL-%03d", atoi(val));
        } else {
            snprintf(p->id, sizeof(p->id), "%s", val);
        }
    } else if (equals_ignore_case(key, "NAME")) {
        snprintf(p->name, sizeof(p->name), "%s", val);
    } else if (equals_ignore_case(key, "AGE")) {
        p->age = atoi(val);
    } else if (equals_ignore_case(key, "CATEGORY")) {
        snprintf(p->category, sizeof(p->category), "%s", val);
    } else if (equals_ignore_case(key, "CONDITION") || equals_ignore_case(key, "LIKELY")) {
        // "none" means Prolog found no matching condition
        if (!equals_ignore_case(val, "none")) {
            snprintf(p->likely_condition, sizeof(p->likely_condition), "%s", val);
        }
    } else if (equals_ignore_case(key, "HIGH_RISK")) {
        p->high_risk = equals_ignore_case(val, "YES");
    } else if (equals_ignore_case(key, "SYMPTOMS")) {
        char *token = strtok(val, ",");
        while (token != NULL && p->symptom_count < MAX_SYMPTOMS) {
            snprintf(p->symptoms[p->symptom_count], sizeof(p->symptoms[0]), "%s", token);
            p->symptom_count++;
            token = strtok(NULL, ",");
        }
    }
}

/* Split the text of the file Prolog writes into patients.
   Each patient is a block from BEGIN to END. A file without BEGIN/END
   lines is read as one patient (the older format). */
int parse_intake(char *text, Patient *out, int max) {
    Patient p;
    memset(&p, 0, sizeof(Patient));

    int count = 0, in_block = 0, saw_block = 0, has_data = 0;
    char *line = text;

    while (line != NULL) {
        // cut the text at the end of this line (not strtok: read_field uses it)
        char *next = strchr(line, '\n');
        if (next != NULL) {
            *next = '\0';
            next++;
        }
        line[strcspn(line, "\r")] = 0;

        if (equals_ignore_case(line, "BEGIN")) {
            memset(&p, 0, sizeof(Patient));
            in_block = 1;
            saw_block = 1;
        } else if (equals_ignore_case(line, "END")) {
            if (in_block && count < max) {
                out[count++] = p;
            }
            in_block = 0;
        } else {
            char *equals = strchr(line, '=');
            // skip lines that are not KEY=value, or are outside a block
            if (equals != NULL && !(saw_block && !in_block)) {
                *equals = '\0';
                read_field(&p, line, equals + 1);
                has_data = 1;
            }
        }
        line = next;
    }

    // Older format: one patient, no BEGIN/END lines
    if (!saw_block && has_data && count < max) {
        out[count++] = p;
    }
    return count;
}

/* Store a new patient and put them in the waiting queue */
int add_patient(Hospital *h, Patient *p) {
    if (p->id[0] != '\0' && id_exists(h, p->id)) {
        return ADD_DUPLICATE; // already imported earlier
    }
    if (h->record_count >= MAX_PATIENTS) {
        return ADD_FULL;
    }

    if (p->id[0] == '\0') {
        snprintf(p->id, sizeof(p->id), "P%03d", h->next_arrival_no);
    }
    p->arrival_no = h->next_arrival_no++;
    p->status = STATUS_WAITING;
    p->bed = 0;
    p->priority = compute_priority(p, NULL, 0);

    int index = h->record_count;
    h->records[index] = *p;
    h->record_count++;

    insert_to_queue(h, index);
    return index;
}

/* Admit patient from queue head into the first free bed */
int admit_next(Hospital *h) {
    if (h->queue.head == NULL) {
        return ADMIT_NOBODY;
    }
    if (count_status(h, STATUS_ADMITTED) >= HOSPITAL_CAPACITY) {
        return ADMIT_NO_BEDS;
    }

    QueueNode *node_to_remove = h->queue.head;
    int index = node_to_remove->record_index;
    h->queue.head = h->queue.head->next;
    free(node_to_remove);
    h->queue.length--;

    for (int bed = 1; bed <= HOSPITAL_CAPACITY; bed++) {
        int used = 0;
        for (int i = 0; i < h->record_count; i++) {
            if (h->records[i].status == STATUS_ADMITTED && h->records[i].bed == bed) {
                used = 1;
            }
        }
        if (!used) {
            h->records[index].bed = bed;
            break;
        }
    }
    h->records[index].status = STATUS_ADMITTED;
    return index;
}

/* Discharge an admitted patient and free their bed */
int discharge(Hospital *h, int index) {
    if (index < 0 || index >= h->record_count || h->records[index].status != STATUS_ADMITTED) {
        return 0;
    }
    h->records[index].status = STATUS_DISCHARGED;
    h->records[index].bed = 0;
    return 1;
}

int count_status(Hospital *h, PatientStatus status) {
    int count = 0;
    for (int i = 0; i < h->record_count; i++) {
        if (h->records[i].status == status) {
            count++;
        }
    }
    return count;
}

char *read_file(const char *path, long *size) {
    FILE *file = fopen(path, "rb");
    if (file == NULL) {
        return NULL;
    }
    fseek(file, 0, SEEK_END);
    long length = ftell(file);
    fseek(file, 0, SEEK_SET);

    char *text = (char *)malloc(length + 1);
    if (text == NULL) {
        fclose(file);
        return NULL;
    }
    size_t got = fread(text, 1, length, file);
    text[got] = '\0';
    fclose(file);
    if (size != NULL) {
        *size = (long)got;
    }
    return text;
}
