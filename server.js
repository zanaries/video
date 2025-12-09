import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 10000 });

let broadcaster = null;
let viewer = null;

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.role === "broadcaster") {
      broadcaster = ws;
      return;
    }

    if (data.role === "viewer") {
      viewer = ws;
      return;
    }

    if (ws === broadcaster && viewer) viewer.send(message);
    if (ws === viewer && broadcaster) broadcaster.send(message);
  });

  ws.on("close", () => {
    if (ws === broadcaster) broadcaster = null;
    if (ws === viewer) viewer = null;
  });
});

console.log("Signaling server avviato su porta " + (process.env.PORT || 10000));
