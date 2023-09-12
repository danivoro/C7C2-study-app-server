import express, { Router } from "express";
import { Client } from "pg";

export default function createUsersRouter(client: Client): Router {
    const router = express.Router();

    const { EmbedBuilder, webhookClient } = require("discord.js");

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
                content: response.rows,
                username: user_name,
                avatarURL: "https://i.imgur.com/AfFp7pu.png",
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
        }
    });

    return router;
}
