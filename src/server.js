import express from "express";
import cors from "cors";

import { handler } from "./index-all.js";

const app = express();
const port = 8090; // change to use any local port desired

app.use(express.json());

app.use(cors());
app.use("/start", express.text({ type: "application/json" }));
app.use("/move", express.text({ type: "application/json" }));
app.use("/end", express.text({ type: "application/json" }));
app.options('*', cors());

const getEvent = (req, method, path) => {
    const event = {
        requestContext: {
            http: {
                method
            }
        },
        rawPath: path,
        body: JSON.stringify(req.body)
    }

    return event;
}

app.get("/", async (req, resp) => {
    const event = getEvent(req, "GET", "");
    const result = await handler(event);
    resp.status(200);
    resp.json(result);
});

app.post("/start", async (req, resp) => {
    const event = getEvent(req, "POST", "/start");
    const result = await handler(event);
    resp.status(result.statusCode || 200);
    resp.json(result.body);
});

app.post("/move", async (req, resp) => {
    const event = getEvent(req, "POST", "/move");
    const result = await handler(event);
    resp.status(result.statusCode || 200);
    resp.json(result);
});

app.post("/end", async (req, resp) => {
    const event = getEvent(req, "POST", "/end");
    const result = await handler(event);
    resp.status(result.statusCode || 200);
    resp.json(result);
});

// Start the server
app.listen(port, () => {
    console.log(`Express server is running at http://localhost:${port}`);
});