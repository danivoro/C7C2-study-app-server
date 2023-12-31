import express, { Router } from "express";

export default function createRootRouter(): Router {
    const router = express.Router();

    router.get("/", async (_req, res) => {
        res.json({ msg: "Hello! There's nothing interesting for GET /" });
    });

    router.get("/health-check", async (_req, res) => {
        res.json({ msg: "system ok" });
    });

    return router;
}
