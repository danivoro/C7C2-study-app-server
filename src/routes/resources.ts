import express, { Router } from "express";
import { Client } from "pg";
import { Webhook, MessageBuilder } from "discord-webhook-node";

export default function createResourcesRouter(client: Client): Router {
    const router = express.Router();

    const hook = new Webhook(
        "https://discord.com/api/webhooks/1151156877011451944/Bsd58OG6UGFlIiSLSiIrh4DKiEHZu8txjdQssHWjLhtfNlCvo2u5Jllu66V1ybXhVU9Z"
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
            const text =
                "INSERT INTO resources(name, url, description, content_type, stage, user_id, recommendation_type, reason, author) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9,)";
            const values = [
                resource_name,
                url,
                description,
                content_type,
                stage,
                recommendation_type,
                user_id,
                reason,
                author_name,
            ];
            const response = await client.query(text, values);
            res.status(200).json(response.rows);

            const embed = new MessageBuilder()
                .setTitle("New Resource Added!")
                .setColor(0x00ffff)
                .setAuthor(author_name)
                .setDescription(JSON.stringify(response.rows));

            hook.send(embed);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
