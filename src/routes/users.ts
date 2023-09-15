import express, { Router } from "express";
import { Client } from "pg";

export default function createUsersRouter(client: Client): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM users");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const text = "SELECT name FROM users WHERE user_id = $1";
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
            const deleteResourcesQuery =
                "DELETE FROM resources WHERE user_id = $1";
            const deleteResourcesValues = [id];
            await client.query(deleteResourcesQuery, deleteResourcesValues);

            const deleteUserQuery = "DELETE FROM users WHERE user_id = $1";
            const deleteUserValues = [id];
            const result = await client.query(
                deleteUserQuery,
                deleteUserValues
            );
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const { user_name, is_faculty } = req.body;
            const text =
                "INSERT INTO users(name, is_faculty) VALUES($1, $2) RETURNING *";
            const values = [user_name, is_faculty];
            const response = await client.query(text, values);
            res.status(200).json(response.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
