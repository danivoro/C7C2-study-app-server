import express, { Router } from "express";
import { Client } from "pg";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function createCommentsRouter(
    client: Client,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap>
): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query(
                "SELECT * FROM comments JOIN users on users.user_id = comments.user_id"
            );
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const { resource_id, user_id, text } = req.body;
            const insertQuery =
                "INSERT INTO comments (resource_id, user_id, text) VALUES ($1, $2, $3) RETURNING * ";
            const insertValues = [resource_id, user_id, text];
            const response = await client.query(insertQuery, insertValues);

            io.emit("comment", response.rows[0]);

            res.status(200).json(response.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.delete("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const deleteCommentsQuery =
                "DELETE FROM comments WHERE comment_id = $1";
            const deleteCommentsValues = [id];
            const result = await client.query(
                deleteCommentsQuery,
                deleteCommentsValues
            );

            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
