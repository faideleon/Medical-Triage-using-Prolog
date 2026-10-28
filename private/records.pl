% PATIENT RECORDS (Prolog writes, C reads)
% Saves each patient to a plain text file that the C triage program reads.
% The format is explained in docs/INTAKE_FILE_FORMAT.md.
%
% Each patient is one block:
%   BEGIN
%   KEY=value
%   ...
%   END
%
% New patients are always added at the end of the file (append).
% Old patients are never changed or deleted.


% intake_file(File)
% Where the records are saved. Run Prolog from the project root folder.
intake_file('data/intake_records.txt').


% save_record(Fields, Id)
% Fields is a list of Key-Value pairs, for example ['NAME'-"Juan", 'AGE'-45].
% Adds the patient number (ID) and arrival time, then writes the block.
save_record(Fields, Id) :-
	intake_file(File),
	make_directory_path('data'),
	next_id(File, Id),
	get_time(Now),
	format_time(atom(Arrived), '%Y-%m-%d %H:%M:%S', Now),
	open(File, append, Out),
	writeln(Out, 'BEGIN'),
	write_field(Out, 'ID', Id),
	write_field(Out, 'ARRIVED', Arrived),
	forall(member(Key-Value, Fields), write_field(Out, Key, Value)),
	writeln(Out, 'END'),
	close(Out).


% write_field(Out, Key, Value)
% Writes one KEY=value line. A list is written with commas: a,b,c
write_field(Out, Key, Value) :-
	is_list(Value),
	!,
	atomic_list_concat(Value, ',', Text),
	format(Out, "~w=~w~n", [Key, Text]).
write_field(Out, Key, Value) :-
	format(Out, "~w=~w~n", [Key, Value]).


% next_id(File, Id)
% The patient number is the number of patients already in the file, plus 1.
% Every patient block starts with a BEGIN line, so we count those.
next_id(File, Id) :-
	exists_file(File),
	!,
	read_file_to_string(File, Text, []),
	split_string(Text, "\n", "\r ", Lines),
	aggregate_all(count, member("BEGIN", Lines), Count),
	Id is Count + 1.
next_id(_, 1).
