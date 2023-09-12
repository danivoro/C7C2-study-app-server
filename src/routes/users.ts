import express, { Router } from "express";
import { Client } from "pg";
import { EmbedBuilder, WebhookClient } from "discord.js";

export default function createUsersRouter(client: Client): Router {
    const router = express.Router();

    const webhookClient = new WebhookClient({
        url: "https://discord.com/api/webhooks/1151156877011451944/Bsd58OG6UGFlIiSLSiIrh4DKiEHZu8txjdQssHWjLhtfNlCvo2u5Jllu66V1ybXhVU9Z",
    });

    router.get("/", async (_req, res) => {
        try {
            const result = await client.query("SELECT * FROM users");
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

            const embed = new EmbedBuilder()
                .setTitle("New User Added!")
                .setColor(0x00ffff);

            webhookClient.send({
                content: JSON.stringify(response.rows),
                username: user_name,
                avatarURL: "https://i.imgur.com/AfFp7pu.png",
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    return router;
}
