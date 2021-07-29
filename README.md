# janus-client

Javascript web client for a WebRTC [Janus](https://github.com/meetecho/janus-gateway) server.  
The js file comes from the official Janus repository while the typing one, `index.d.ts` is tailored for the videoroom plugin.

## Install

`yarn add @nabla/janus-client`

## Usage

```javascript
import Janus, { JSEP, PluginHanlde } from "@nabla/janus-client";

let session: Janus;
let localHandle: PluginHandle;
const opaqueId = "<OPAQUE_ID>";

Janus.init({
  debug: true,
  callback: () => {
    session = new Janus({
      server: serverUrl, // TODO get media server url dynamically from back-end
      withCredentials: true,
      success: () => {
        session.attach({
          plugin: "janus.plugin.videoroom",
          opaqueId,
          success: (pluginHandle) => {
            localHandle = pluginHandle;

            pluginHandle.send({
              message: {
                request: "join",
                room: 1234, // Your room id
                ptype: "publisher",
                display: "<USER_NAME>",
              },
            });
          },
          error: (err) => {
            // ...
          },
          iceState: (state) => {
            // ...
          },
          mediaState: (medium, on) => {
            // ...
          },
          webrtcState: (on) => {
            // ...
          },
          slowLink: () => {
            // ...
          },
          onmessage: (msg, jsep) => {
            const event = msg.videoroom;
            if (event === "joined") {
              // We can publish our own feed;
              // ...

              if (msg.publishers) {
                for (const p of msg.publishers) {
                  // Add remote feed
                  // ...
                }
              }
            } else if (event === "event") {
              if (msg.publishers) {
                // There are new participants joining the room
                for (const p of msg.publishers) {
                  // Add remote feed
                  // ...
                }
              } else if (msg.leaving) {
                // A participant is leaving the room...
                // ...
              } else if (msg.unpublished) {
                // A participant unpublished
                // ...
              }
            } else if (event === "destroyed") {
              // The room is closed...
            }

            if (jsep) {
              localHandle.handleRemoteJsep({ jsep });
            }
          },
          onlocalstream: (stream) => {
            // local video can be attached
          },
          // ...
        });
      },
      error: (err) => {
        // An error occured
      },
    });
  },
});
```
