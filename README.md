# Demo

<img src="public/demo.png" width="100%" height="auto"/>

<hr>

## Features & TODO
### Completed
- React + TypeScript + Vite + bun
- **Correct ranking logic**  
  If two teams have equal scores → resolver compares the *time of the last accepted submission*.
- **CORS handling with Node proxy**
- **Dynamic ranking numbers** (ties handled properly)
- **Smooth animations and transition fixes**
- **`.env.example` included**
- **Documentation for configuration**
- **Keyboard controls** (Enter to resolve, Escape to cancel)

### TODO
- [ ] Theme system (Light/Dark/Custom)
- [ ] Add preview
- [ ] Add static version
- [ ] Responsive design(if we deploy in backend service and share with others)
- [ ] Add document for functions in scorboard component 
- [ ] Refactor the scoreboard component
- [ ] Add img preview for each team to show in popup

## Lets use it!
### Install the package with bun :

```bash
bun install && bun start
```

### If you want run with pnpm or npm :
```bash
pnpm install
node cors-proxy.js &
pnpm run dev
```
```bash
npm install
node cors-proxy.js &
npm run dev
```


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

### CORS Proxy (Recommended)

Browsers block API requests to different origins because of CORS restrictions.
To bypass this safely during development, run the built-in Node CORS proxy:

`node cors-proxy.js`


Your final API URL becomes:
```
http://localhost:8080/https://www.domjudge.org/demoweb/api/v4/
http://<proxy-host>/<actual-remote-api-url>
```

Should use this inside VITE_API_BASE_URL.

### Running Without Proxy (NOT Recommended) 

For chrome :
```bash
mkdir chromeCashe
cd chromeCashe
google-chrome-stable --user-data-dir="./" --disable-web-security
```

For the firefox : About:config and the security.fileuri.strict_origin_policy. Sometimes also the network.http.refere.XOriginPolicy. Im not sure:))
