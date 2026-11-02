#ifndef HOSPITAL_H
#define HOSPITAL_H

/* The triage rules, shared by the terminal program (triage.c) and the
   web server (server.c). */

#include <stddef.h>

#define MAX_PATIENTS 100
#define HOSPITAL_CAPACITY 5
#define MAX_SYMPTOMS 10
#define MAX_VISIBLE 5
#define NUM_VISIBLE_CONDITIONS 7
#define INTAKE_FILE "data/intake_records.txt"
#define WHY_LEN 120

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
    int age;
    int high_risk;
    char symptoms[MAX_SYMPTOMS][30];
    int symptom_count;
    int visible[MAX_VISIBLE];
    int visible_count;
    int priority;
    PatientStatus status;
    int arrival_no;
    int bed;            /* 1..HOSPITAL_CAPACITY while admitted, else 0 */
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

extern VisibleCondition VISIBLE_CONDITIONS[NUM_VISIBLE_CONDITIONS];
extern const char *EMERGENCY_CONDITIONS[];
extern int NUM_EMERGENCY;

void hospital_init(Hospital *h);
void hospital_free(Hospital *h);

int equals_ignore_case(const char *a, const char *b);
int is_emergency(const char *condition);

/* Priority 1 to 5. If why is not NULL, it gets the reason that decided it. */
int compute_priority(const Patient *p, char *why, size_t why_len);

void insert_to_queue(Hospital *h, int rec_index);
int id_exists(Hospital *h, const char *id);

/* Read one KEY=value line from the Prolog file into the patient. */
void read_field(Patient *p, const char *key, char *val);

/* Split the text of an intake file into patients (BEGIN ... END blocks,
   or one patient for the older format). Changes text. Returns how many. */
int parse_intake(char *text, Patient *out, int max);

/* Give the patient an ID, arrival number and priority, store it and put it
   in the queue. Returns the record index, or one of these errors: */
#define ADD_FULL -1
#define ADD_DUPLICATE -2
int add_patient(Hospital *h, Patient *p);

/* Move the head of the queue to a free bed. Returns the record index,
   or one of these errors: */
#define ADMIT_NOBODY -1
#define ADMIT_NO_BEDS -2
int admit_next(Hospital *h);

/* Returns 1 if the patient was admitted and is now discharged, else 0. */
int discharge(Hospital *h, int index);

int count_status(Hospital *h, PatientStatus status);

/* Read a whole file into memory (ends with '\0'). size may be NULL.
   Returns NULL if it cannot be opened. The caller frees it. */
char *read_file(const char *path, long *size);

#endif
