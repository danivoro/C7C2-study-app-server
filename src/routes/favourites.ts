import express, { Router } from "express";
import { Client } from "pg";

export default function createFavouritesRouter(client: Client): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM favourites");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const text =
                "SELECT resources.* FROM favourites JOIN resources ON favourites.resource_id = resources.resource_id WHERE favourites.user_id = $1;";
            const values = [id];
            const result = await client.query(text, values);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
