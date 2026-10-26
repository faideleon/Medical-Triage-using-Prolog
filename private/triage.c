#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define MAX_PATIENTS 100
#define HOSPITAL_CAPACITY 5
#define MAX_SYMPTOMS 10
#define MAX_VISIBLE 5
#define NUM_VISIBLE_CONDITIONS 7

#define PRIORITY_CRITICAL 1
#define PRIORITY_EMERGENT 2
#define PRIORITY_URGENT 3
#define PRIORITY_LESS_URGENT 4
#define PRIORITY_NON_URGENT 5

typedef enum {
    STATUS_WAITING,
    STATUS_ADMITTED,
    STATUS_DISCHARGED
} PatientStatus;

typedef struct {
    char name[30];
    int priority;
} VisibleCondition;

typedef struct {
    char id[10];
    char name[50];
    char category[30];
    char likely_condition[50];
    char symptoms[MAX_SYMPTOMS][30];
    int symptom_count;
    int visible[MAX_VISIBLE];
    int visible_count;
    int priority;
    PatientStatus status;
    int arrival_no;
} Patient;

/* Linked List Node for Waiting Queue */
typedef struct QueueNode {
    int record_index;
    struct QueueNode *next;
} QueueNode;

typedef struct {
    QueueNode *head;
    int length;
} WaitingQueue;

typedef struct {
    Patient records[MAX_PATIENTS];
    int record_count;
    int next_arrival_no;
    WaitingQueue queue;
} Hospital;

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
char *EMERGENCY_CONDITIONS[] = {
    "stroke", "sepsis", "meningitis", "meningococcemia",
    "ischemic_heart_disease", "diphtheria", "rabies", "tetanus"
};
int NUM_EMERGENCY = 8;

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

/* Calculate priority score (1 to 5) */
int compute_priority(Patient *p) {
    int best = PRIORITY_NON_URGENT;

    if (p->symptom_count > 0) {
        best = PRIORITY_LESS_URGENT;
    }

    if (is_emergency(p->likely_condition)) {
        best = PRIORITY_CRITICAL;
    }

    for (int i = 0; i < p->visible_count; i++) {
        int level = VISIBLE_CONDITIONS[p->visible[i]].priority;
        if (level < best) {
            best = level;
        }
    }
    return best;
}

/* Insert patient into linked list queue sorted by priority */
void insert_to_queue(Hospital *h, int rec_index) {
    QueueNode *new_node = (QueueNode *)malloc(sizeof(QueueNode));
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

/* Display linked list queue */
void print_queue(Hospital *h) {
    QueueNode *curr = h->queue.head;
    int pos = 1;

    if (curr == NULL) {
        printf("\nThe waiting queue is empty.\n");
        return;
    }

    printf("\n--- Waiting Queue (%d) ---\n", h->queue.length);
    printf("%-4s %-6s %-20s %-15s %s\n", "No.", "ID", "Name", "Priority", "Condition");

    while (curr != NULL) {
        Patient *p = &h->records[curr->record_index];
        printf("%-4d %-6s %-20s Priority %-2d %s\n",
               pos, p->id, p->name, p->priority,
               p->likely_condition[0] != '\0' ? p->likely_condition : "-");
        curr = curr->next;
        pos++;
    }
}

/* Add a patient manually */
void add_patient_manual(Hospital *h) {
    if (h->record_count >= MAX_PATIENTS) {
        printf("Records array is full.\n");
        return;
    }

    Patient p;
    memset(&p, 0, sizeof(Patient));

    printf("\nEnter patient name: ");
    fgets(p.name, sizeof(p.name), stdin);
    p.name[strcspn(p.name, "\n")] = 0; // remove newline

    if (strlen(p.name) == 0) return;

    printf("Enter symptoms (press Enter on empty line when done):\n");
    while (p.symptom_count < MAX_SYMPTOMS) {
        char temp[30];
        printf("Symptom %d: ", p.symptom_count + 1);
        fgets(temp, sizeof(temp), stdin);
        temp[strcspn(temp, "\n")] = 0;

        if (strlen(temp) == 0) break;

        // format to lowercase and replace spaces with underscore
        for (int i = 0; temp[i]; i++) {
            if (temp[i] == ' ') temp[i] = '_';
            else temp[i] = tolower((unsigned char)temp[i]);
        }
        strcpy(p.symptoms[p.symptom_count], temp);
        p.symptom_count++;
    }

    printf("\nVisible Conditions:\n");
    for (int i = 0; i < NUM_VISIBLE_CONDITIONS; i++) {
        printf("  %d. %s\n", i + 1, VISIBLE_CONDITIONS[i].name);
    }

    while (p.visible_count < MAX_VISIBLE) {
        int choice;
        printf("Select visible condition (0 to finish): ");
        scanf("%d", &choice);
        getchar(); // clear newline

        if (choice == 0) break;
        if (choice >= 1 && choice <= NUM_VISIBLE_CONDITIONS) {
            p.visible[p.visible_count] = choice - 1;
            p.visible_count++;
        }
    }

    sprintf(p.id, "P%03d", h->next_arrival_no);
    p.arrival_no = h->next_arrival_no++;
    p.status = STATUS_WAITING;
    p.priority = compute_priority(&p);

    int index = h->record_count;
    h->records[index] = p;
    h->record_count++;

    insert_to_queue(h, index);
    printf("\nAdded %s (%s) with Priority %d.\n", p.name, p.id, p.priority);
}

/* Import patient from Prolog export file */
void import_prolog_file(Hospital *h) {
    char path[100];
    printf("\nEnter path of Prolog file: ");
    fgets(path, sizeof(path), stdin);
    path[strcspn(path, "\n")] = 0;

    FILE *file = fopen(path, "r");
    if (file == NULL) {
        printf("Could not open file!\n");
        return;
    }

    Patient p;
    memset(&p, 0, sizeof(Patient));

    char line[100];
    while (fgets(line, sizeof(line), file)) {
        line[strcspn(line, "\n")] = 0;
        char *equals = strchr(line, '=');
        if (equals != NULL) {
            *equals = '\0';
            char *key = line;
            char *val = equals + 1;

            if (equals_ignore_case(key, "ID")) {
                strcpy(p.id, val);
            } else if (equals_ignore_case(key, "CATEGORY")) {
                strcpy(p.category, val);
            } else if (equals_ignore_case(key, "LIKELY")) {
                strcpy(p.likely_condition, val);
            } else if (equals_ignore_case(key, "SYMPTOMS")) {
                char *token = strtok(val, ",");
                while (token != NULL && p.symptom_count < MAX_SYMPTOMS) {
                    strcpy(p.symptoms[p.symptom_count], token);
                    p.symptom_count++;
                    token = strtok(NULL, ",");
                }
            }
        }
    }
    fclose(file);

    printf("Enter patient name for imported record: ");
    fgets(p.name, sizeof(p.name), stdin);
    p.name[strcspn(p.name, "\n")] = 0;

    if (p.id[0] == '\0') {
        sprintf(p.id, "P%03d", h->next_arrival_no);
    }
    p.arrival_no = h->next_arrival_no++;
    p.status = STATUS_WAITING;
    p.priority = compute_priority(&p);

    int index = h->record_count;
    h->records[index] = p;
    h->record_count++;

    insert_to_queue(h, index);
    printf("\nImported %s (%s) with Priority %d.\n", p.name, p.id, p.priority);
}

/* Admit patient from queue head */
void admit_next_patient(Hospital *h) {
    if (h->queue.head == NULL) {
        printf("\nNobody is waiting.\n");
        return;
    }

    int admitted_count = 0;
    for (int i = 0; i < h->record_count; i++) {
        if (h->records[i].status == STATUS_ADMITTED) {
            admitted_count++;
        }
    }

    if (admitted_count >= HOSPITAL_CAPACITY) {
        printf("\nNo free beds! Hospital is full.\n");
        return;
    }

    QueueNode *node_to_remove = h->queue.head;
    int index = node_to_remove->record_index;

    h->records[index].status = STATUS_ADMITTED;
    h->queue.head = h->queue.head->next;
    free(node_to_remove);
    h->queue.length--;

    printf("\nAdmitted %s (%s).\n", h->records[index].name, h->records[index].id);
}

/* Discharge patient */
void discharge_patient(Hospital *h) {
    int shown = 0;
    printf("\n--- Admitted Patients ---\n");
    for (int i = 0; i < h->record_count; i++) {
        if (h->records[i].status == STATUS_ADMITTED) {
            printf("%d. %s - %s\n", i + 1, h->records[i].id, h->records[i].name);
            shown++;
        }
    }

    if (shown == 0) {
        printf("No admitted patients to discharge.\n");
        return;
    }

    int choice;
    printf("Number to discharge (0 to cancel): ");
    scanf("%d", &choice);
    getchar();

    if (choice > 0 && choice <= h->record_count) {
        int idx = choice - 1;
        if (h->records[idx].status == STATUS_ADMITTED) {
            h->records[idx].status = STATUS_DISCHARGED;
            printf("Patient %s discharged.\n", h->records[idx].id);
        } else {
            printf("Invalid selection.\n");
        }
    }
}

/* Search patient by name */
void search_patient(Hospital *h) {
    char query[50];
    printf("\nEnter name to search: ");
    fgets(query, sizeof(query), stdin);
    query[strcspn(query, "\n")] = 0;

    int count = 0;
    for (int i = 0; i < h->record_count; i++) {
        char name_lower[50];
        char query_lower[50];
        strcpy(name_lower, h->records[i].name);
        strcpy(query_lower, query);

        for (int j = 0; name_lower[j]; j++) name_lower[j] = tolower((unsigned char)name_lower[j]);
        for (int j = 0; query_lower[j]; j++) query_lower[j] = tolower((unsigned char)query_lower[j]);

        if (strstr(name_lower, query_lower) != NULL) {
            Patient *p = &h->records[i];
            printf("\nID       : %s\n", p->id);
            printf("Name     : %s\n", p->name);
            printf("Priority : %d\n", p->priority);
            count++;
        }
    }
    if (count == 0) {
        printf("No patient found.\n");
    }
}

/* Show occupancy status */
void show_occupancy(Hospital *h) {
    int admitted = 0;
    int discharged = 0;

    for (int i = 0; i < h->record_count; i++) {
        if (h->records[i].status == STATUS_ADMITTED) admitted++;
        if (h->records[i].status == STATUS_DISCHARGED) discharged++;
    }

    printf("\n=== Hospital Occupancy ===\n");
    printf("Beds in use : %d / %d\n", admitted, HOSPITAL_CAPACITY);
    printf("Waiting     : %d\n", h->queue.length);
    printf("Discharged  : %d\n", discharged);
}

int main(void) {
    static Hospital hospital;
    hospital.record_count = 0;
    hospital.next_arrival_no = 1;
    hospital.queue.head = NULL;
    hospital.queue.length = 0;

    int choice = -1;

    printf("=== Hospital Triage System ===\n");

    while (choice != 0) {
        printf("\n--- Menu ---\n");
        printf("1. Add patient (manual)\n");
        printf("2. Import patient (Prolog file)\n");
        printf("3. Show waiting queue\n");
        printf("4. Admit next patient\n");
        printf("5. Discharge patient\n");
        printf("6. Search patient by name\n");
        printf("7. Show occupancy\n");
        printf("0. Exit\n");
        printf("Choice: ");
        scanf("%d", &choice);
        getchar(); // consume newline

        switch (choice) {
            case 1: add_patient_manual(&hospital); break;
            case 2: import_prolog_file(&hospital); break;
            case 3: print_queue(&hospital); break;
            case 4: admit_next_patient(&hospital); break;
            case 5: discharge_patient(&hospital); break;
            case 6: search_patient(&hospital); break;
            case 7: show_occupancy(&hospital); break;
            case 0: printf("Exiting...\n"); break;
            default: printf("Invalid choice.\n"); break;
        }
    }

    // Free memory before exit
    QueueNode *curr = hospital.queue.head;
    while (curr != NULL) {
        QueueNode *temp = curr;
        curr = curr->next;
        free(temp);
    }

    return 0;
}