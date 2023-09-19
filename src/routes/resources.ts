import express, { Router } from "express";
import { Client } from "pg";
import { Webhook, MessageBuilder } from "discord-webhook-node";
import { Server } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export default function createResourcesRouter(
    client: Client,
    io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
): Router {
    const router = express.Router();

    const hook = new Webhook(
        "https://discord.com/api/webhooks/1151074752396529684/HLquClzlQm5eu9H3c0YDjVgg4bD0WzP0dwI8n2JguKuT8h3iadG_TkI6fCxkEar873Vy"
    );

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM resources");
            res.status(200).json(result.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.post("/", async (req, res) => {
        try {
            const {
                resource_name,
                url,
                description,
                content_type,
                stage,
                user_id,
                recommendation_type,
                reason,
                author_name,
            } = req.body;

            const checkDuplicateQuery =
                "SELECT * FROM resources WHERE url = $1";
            const checkDuplicateValues = [url];
            const duplicateCheckResult = await client.query(
                checkDuplicateQuery,
                checkDuplicateValues
            );

            if (duplicateCheckResult.rows.length > 0) {
                return res.status(400).json({
                    error: "Resource with the same URL already exists",
                });
            }
            const text =
                "INSERT INTO resources(name, url, description, content_type, stage, user_id, recommendation_type, reason, author) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *";
            const values = [
                resource_name,
                url,
                description,
                content_type,
                stage,
                user_id,
                recommendation_type,
                reason,
                author_name,
            ];

            const response = await client.query(text, values);
            io.emit("resource-add", response.rows[0]);
            res.status(200).json(response.rows);

            const embed = new MessageBuilder()
                .setTitle("New Resource Added: " + resource_name)
                .setColor(0x00ffff)
                .setAuthor(author_name)
                .setDescription(`${description} ${url}`);

            hook.send(embed);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.get("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const text = "SELECT * FROM resources WHERE resource_id = $1";
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

            const deleteTagsQuery = "DELETE FROM tags WHERE resource_id = $1";
            const deleteTagsValues = [id];

            const deleteFavouritesQuery =
                "DELETE FROM favourites WHERE resource_id = $1";
            const deleteFavouritesValues = [id];

            const deleteResourcesQuery =
                "DELETE FROM resources WHERE resource_id = $1";
            const deleteResourcesValues = [id];

            await client.query(deleteTagsQuery, deleteTagsValues);
            await client.query(deleteFavouritesQuery, deleteFavouritesValues);
            const response = await client.query(
                deleteResourcesQuery,
                deleteResourcesValues
            );

            io.emit("resource-delete", response.rows[0]);

            res.status(200).json({
                message: "Resource and related data deleted successfully",
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    router.put("/:id", async (req, res) => {
        try {
            const { id } = req.params;
            const { action } = req.body;

            if (action === "like") {
                const text =
                    "UPDATE resources SET likes = likes + 1 WHERE resource_id = $1";
                const values = [id];
                const result = await client.query(text, values);
                res.status(200).json(result.rows);
            } else if (action === "dislike") {
                const text =
                    "UPDATE resources SET dislikes = dislikes + 1 WHERE resource_id = $1";
                const values = [id];
                const result = await client.query(text, values);
                res.status(200).json(result.rows);
            } else {
                res.status(400).json({
                    error: "Invalid action in request body",
                });
            }
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
