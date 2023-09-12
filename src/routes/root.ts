import express, { Router } from "express";
import { Client } from "pg";

export default function createRootRouter(client: Client): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        res.json({ msg: "Hello! There's nothing interesting for GET /" });
    });

    router.get("/health-check", async (_req, res) => {
        await client.query("select now()");
        res.status(200).send("system ok");
    });

    return router;
}