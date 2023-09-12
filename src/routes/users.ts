import { Router } from "express";
import { Client } from "pg";

export default function createRootRouter(client: Client) {
    const router = Router();

    router.get("/users", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM users");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
        }
    });
    return router;
}
