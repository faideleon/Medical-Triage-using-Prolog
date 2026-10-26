% PATIENT RECORDS
% Saves each finished intake to a plain text file that the C triage
% program reads. The format is explained in docs/INTAKE_FILE_FORMAT.md.
%
% Each patient is one block:
%   BEGIN
%   KEY=value
%   ...
%   END
%
% The file is only ever appended to, never rewritten.

:- use_module(library(lists)).
:- use_module(library(readutil)).

% intake_file(-Path)
% Uses the TRIAGE_FILE environment variable if set, otherwise
% <project>/data/intake_records.txt.
intake_file(Path) :-
	getenv('TRIAGE_FILE', Path),
	Path \== '',
	!.
intake_file(Path) :-
	private_dir(PrivateDir),
	directory_file_path(PrivateDir, '../data/intake_records.txt', Relative),
	absolute_file_name(Relative, Path).

% private_dir(-Dir): the folder these .pl files are in, saved at load time.
:- dynamic private_dir/1.
:- prolog_load_context(directory, Dir),
   retractall(private_dir(_)), assertz(private_dir(Dir)).


% save_record(+Fields, -Id)
% Fields is a list of Key-Value pairs (without ID, DATE, TIME).
% Adds the ID, date and time, then appends the block to the file.
% A mutex makes sure two patients saved at once do not mix their lines.
save_record(Fields, Id) :-
	with_mutex(intake_file,
		save_record_locked(Fields, Id)).

save_record_locked(Fields, Id) :-
		intake_file(Path),
	file_directory_name(Path, Dir),
	make_directory_path(Dir),
	get_time(Now),
	format_time(atom(Date),
		'%Y-%m-%d', Now),
	format_time(atom(Time), '%H:%M:%S', Now),
		next_id(Path, Now, Id),
		setup_call_cleanup(open(Path,
				append,
				Out,
				[encoding(utf8)]),
			write_block(Out, ['ID' - Id, 'DATE' - Date, 'TIME' - Time|Fields]),
			close(Out)).

write_block(Out, Fields) :-
	format(Out, "BEGIN~n", []),
	forall(member(Key - Value, Fields),
		(value_text(Value, Text),
			format(Out, "~w=~w~n", [Key, Text]))),
	format(Out, "END~n", []).

% value_text(+Value, -Text)
% Lists become comma-separated. Line breaks are removed so one value
% always stays on one line.
value_text(Value, Text) :-
	is_list(Value),
	!,
	atomic_list_concat(Value, ',', Text).
value_text(Value, Text) :-
	format(atom(Raw),
		"~w",
		[Value]),
	split_string(Raw, "\r\n", "", Parts),
	atomic_list_concat(Parts, ' ', Text).


% next_id(+Path, +Now, -Id)
% Patient IDs look like P20261026-001: date plus a counter for that day.
next_id(Path, Now, Id) :-
	format_time(atom(Day),
		'%Y%m%d', Now),
	% Double quotes on purpose: an editor formatter changed 'ID=P' to 'ID = P'.
	string_concat("ID=P", Day, Prefix),
	count_lines_starting(Path, Prefix, Count),
	Next is Count + 1,
	format(atom(Id),
		"P~w-~|~`0t~d~3+",
		[Day, Next]).

count_lines_starting(Path, Prefix, Count) :-
	(exists_file(Path) ->
	read_file_to_string(Path,
			Text,
			[encoding(utf8)]),
		split_string(Text, "\n", "\r", Lines),
		aggregate_all(count,
			(member(Line, Lines),
				string_concat(Prefix, _, Line)),
			Count);
	Count = 0).
