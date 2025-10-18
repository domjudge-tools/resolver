# Demo

<img src="public/demo.png" width="100%" height="auto"/>

<hr>

React + TypeScript + Vite + bun

### TODO

- [x] Hotfix the sorting rank //If two teams have the same score, they are sorted by the time of their last accepted submission.
- [x] Add themes
- [x] Fix the Cors error 
- [ ] Add preview
- [ ] Add static version
- [ ] Responsive design(if we deploy in backend service and share with others)
- [x] Handle the judging types
- [x] dynamic the reanking number
- [x] fix the animation
- [x] Add example of .env file
- [x] Write little docuemnt for how this work and how to config that!
- [ ] Handle the keyboard next controling(example n) 
- [ ] Add document for functions in scorboard component 
- [ ] Refactor the scoreboard component
- [ ] Add img preview for each team to show in popup

# Lets use it!

### Install the package with bun :

`
bun install
`
<br>
`bun start
`

### env file : 
copy The .env.example to .env:
> [!NOTE]
> You CAN SEE THE EXAMPLE IN FILE.
| Variable              | Description                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| **VITE_API_BASE_URL** | The base URL of your proxied DOMjudge API.                               |
| **VITE_API_USERNAME** | Username for authenticating with the DOMjudge API (usually an admin or judge account).                   |
| **VITE_API_PASSWORD** | Password for the API user.                                                                               |
| **VITE_API_CID**      | Contest ID to pull data from. Must match the contest ID in DOMjudge.                                     |
| **VITE_API_PENALTY**  | Penalty time (in minutes) applied per wrong submission.                                                  |

