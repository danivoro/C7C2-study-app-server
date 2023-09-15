import express, { Router } from "express";
import { Client } from "pg";
import axios from "axios";

export default function createRootRouter(client: Client): Router {
    const router = express.Router();

    // Create a function to perform the self-request
    const selfRequest = async () => {
        try {
            const response = await axios.get("http://localhost:4000/");
            if (response.status === 200) {
                console.log("Self-request successful");
            } else {
                console.error(
                    "Self-request failed with status code",
                    response.status
                );
            }
        } catch (error) {
            console.error("Self-request failed with error", error);
        }
    };

    const selfRequestInterval = setInterval(selfRequest, 600000);
    selfRequestInterval;

    router.get("/", async (_req, res) => {
        res.json({ msg: "Hello! There's nothing interesting for GET /" });
    });

    router.get("/health-check", async (_req, res) => {
        await client.query("select now()");
        res.status(200).send("system ok");
    });

    return router;
}
