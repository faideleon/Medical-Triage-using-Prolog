**Private is Backend and Public Folder is the frontend**

## Run

From the project root, start the SWI-Prolog server:

```powershell
swipl -q -s private/server.pl -g "start_server(8000), thread_get_message(_)" -t halt
```

Open <http://localhost:8000/>. The frontend sends the chosen category and
answers as JSON to `/api/triage`; Prolog returns the matching conditions.
