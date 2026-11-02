#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#include "hospital.h"

/* Terminal menu for the triage. The rules (priority, queue, beds, reading
   the Prolog file) are in hospital.c, shared with the web server. */

/* Read a whole number from the user. Letters count as -1 instead of
   breaking the menu. */
int read_number(void) {
    char line[32];
    if (fgets(line, sizeof(line), stdin) == NULL) {
        return 0; // input closed: act like "0"
    }
    char *end;
    long value = strtol(line, &end, 10);
    if (end == line) {
        return -1;
    }
    return (int)value;
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
        printf("Select visible condition (0 to finish): ");
        int choice = read_number();

        if (choice == 0) break;
        if (choice >= 1 && choice <= NUM_VISIBLE_CONDITIONS) {
            p.visible[p.visible_count] = choice - 1;
            p.visible_count++;
        }
    }

    int index = add_patient(h, &p);
    if (index >= 0) {
        Patient *added = &h->records[index];
        printf("\nAdded %s (%s) with Priority %d.\n", added->name, added->id, added->priority);
    }
}

/* Import patients from the file Prolog writes. Patients whose ID is
   already in the records are skipped, so the same file can be imported
   again to pick up new arrivals. */
void import_prolog_file(Hospital *h) {
    char path[200];
    printf("\nEnter path of Prolog file (press Enter for %s): ", INTAKE_FILE);
    fgets(path, sizeof(path), stdin);
    path[strcspn(path, "\r\n")] = 0;
    if (path[0] == '\0') {
        strcpy(path, INTAKE_FILE);
    }

    char *text = read_file(path, NULL);
    if (text == NULL && strcmp(path, INTAKE_FILE) == 0) {
        // run from inside the c/ folder: data/ is one level up
        text = read_file("../" INTAKE_FILE, NULL);
    }
    if (text == NULL) {
        printf("Could not open file!\n");
        return;
    }

    static Patient found[MAX_PATIENTS];
    int count = parse_intake(text, found, MAX_PATIENTS);
    free(text);

    int imported = 0, skipped = 0;
    printf("\n");
    for (int i = 0; i < count; i++) {
        Patient *p = &found[i];
        if (p->id[0] != '\0' && id_exists(h, p->id)) {
            skipped++;
            continue;
        }
        if (h->record_count >= MAX_PATIENTS) {
            printf("Records array is full.\n");
            break;
        }
        if (p->name[0] == '\0') {
            printf("Enter patient name for imported record: ");
            fgets(p->name, sizeof(p->name), stdin);
            p->name[strcspn(p->name, "\n")] = 0;
        }

        int index = add_patient(h, p);
        if (index >= 0) {
            Patient *added = &h->records[index];
            printf("Imported %s (%s) with Priority %d.\n", added->name, added->id, added->priority);
            imported++;
        }
    }

    printf("\n%d patient(s) imported, %d skipped (already in the records).\n", imported, skipped);
}

/* Admit patient from queue head */
void admit_next_patient(Hospital *h) {
    int index = admit_next(h);
    if (index == ADMIT_NOBODY) {
        printf("\nNobody is waiting.\n");
    } else if (index == ADMIT_NO_BEDS) {
        printf("\nNo free beds! Hospital is full.\n");
    } else {
        printf("\nAdmitted %s (%s) to bed %d.\n",
               h->records[index].name, h->records[index].id, h->records[index].bed);
    }
}

/* Discharge patient */
void discharge_patient(Hospital *h) {
    int shown = 0;
    printf("\n--- Admitted Patients ---\n");
    for (int i = 0; i < h->record_count; i++) {
        if (h->records[i].status == STATUS_ADMITTED) {
            printf("%d. %s - %s (bed %d)\n", i + 1, h->records[i].id, h->records[i].name, h->records[i].bed);
            shown++;
        }
    }

    if (shown == 0) {
        printf("No admitted patients to discharge.\n");
        return;
    }

    printf("Number to discharge (0 to cancel): ");
    int choice = read_number();
    if (choice == 0) return;

    if (discharge(h, choice - 1)) {
        printf("Patient %s discharged.\n", h->records[choice - 1].id);
    } else {
        printf("Invalid selection.\n");
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
    printf("\n=== Hospital Occupancy ===\n");
    printf("Beds in use : %d / %d\n", count_status(h, STATUS_ADMITTED), HOSPITAL_CAPACITY);
    printf("Waiting     : %d\n", h->queue.length);
    printf("Discharged  : %d\n", count_status(h, STATUS_DISCHARGED));
}

int main(void) {
    static Hospital hospital;
    hospital_init(&hospital);

    int choice = -1;

    printf("=== Hospital Triage System ===\n");

    while (choice != 0) {
        printf("\n--- Menu ---\n");
        printf("1. Add patient (manual)\n");
        printf("2. Import patients (Prolog file)\n");
        printf("3. Show waiting queue\n");
        printf("4. Admit next patient\n");
        printf("5. Discharge patient\n");
        printf("6. Search patient by name\n");
        printf("7. Show occupancy\n");
        printf("0. Exit\n");
        printf("Choice: ");
        choice = read_number();

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
    hospital_free(&hospital);

    return 0;
}
