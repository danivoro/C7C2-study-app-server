import express, { Router } from "express";
import { Client } from "pg";

export default function createTagsRouter(client: Client): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM tags");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const text = "SELECT * FROM tags WHERE resource_id = $1;";
            const values = [id];
            const result = await client.query(text, values);
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleteResourcesQuery = "DELETE FROM tags WHERE tag_id = $1";
            const deleteResourcesValues = [id];
            const result = await client.query(
                deleteResourcesQuery,
                deleteResourcesValues
            );

            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const { resource_id, name } = req.body;
            const text = "INSERT INTO tags (resource_id, name) VALUES($1, $2)";
            const values = [resource_id, name];
            const response = await client.query(text, values);
            res.status(200).json(response.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
