import express, { Router } from "express";
import { Client } from "pg";

export default function createResourcesRouter(client: Client): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM resources");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
