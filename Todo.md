## Claud is giving invalid json formats for input of tool usage, do fix it by specifying in the prompt

```json
[
{
type: 'tool_use',
id: 'toolu_01NXJihVm2SAXtZsQLHUdEWj',
name: 'write_files',
input: {
files: '[{"path": "app/blue-square.tsx", "content": "export function BlueSquare() {\\n return (\\n <div className=\\"flex items-center justify-center min-h-screen bg-gray-100\\">\\n <div className=\\"w-32 h-32 bg-blue-500 rounded-lg shadow-lg\\"></div>\\n </div>\\n );\\n}\\n"}]\n' +
'</invoke>'
},
caller: { type: 'direct' }
}
]
```

- [x] Update the logic for context storage, to store the updated contest and not replace the old context (45 mins)

- [ ] Add logic to allow 2 prompts and add word limit in prompts (1 hr)

- [ ] Check how we can send heart beat and keep the container alive

- [ ] On re-initializing the container update it with the updates (1 hr)

- [ ] Shift the files storeage to R2 stroage from DB (1.5 hrs)

- [ ] Make Projects list section (allow only 3 projects per person)

### UX Imporvements

- When the prompt is put once and the project is loading, disable the form input and when API call is made, check the redis cache status

- Show sandbox expired message by storing the expiration time stamp in DB

- Prompt queue error handelling
