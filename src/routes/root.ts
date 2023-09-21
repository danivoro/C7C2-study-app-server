import express, { Router } from "express";
import axios from "axios";

export default function createRootRouter(): Router {
    const router = express.Router();

    // Perform the self-request
    const selfRequest = async () => {
        try {
            const response = await axios.get(
                "https://c7c2-study-app.onrender.com/"
            );
            if (response.status === 200) {
                console.log("Self-request successful");
            } else {
                console.error(
                    "Self-request failed with status code",
                    response.status
                );
            }
        } catch (error) {
            console.error("Self-request failed with error", error);
        }
    };

    // Perform a request to the Thumbnail API
    const requestToImageApi = async () => {
        try {
            const response = await axios.get(
                "https://get-link-thumbnail.onrender.com/"
            );
            if (response.status === 200) {
                console.log("Request to preview-api successful");
            } else {
                console.error(
                    "Request to image api failed with status code",
                    response.status
                );
            }
        } catch (error) {
            console.error("Request to image api failed with error", error);
        }
    };

    // Perform a request to the Fallback API
    const requestToFallbackApi = async () => {
        try {
            const response = await axios.get(
                "https://fallback-image-api.onrender.com//health-check"
            );
            if (response.status === 200) {
                console.log("Request to fallback successful");
            } else {
                console.error(
                    "Request to fallback api failed with status code",
                    response.status
                );
            }
        } catch (error) {
            console.error("Request to fallback api failed with error", error);
        }
    };

    const selfRequestInterval = setInterval(selfRequest, 600000);
    selfRequestInterval;

    const requestToImageApiInterval = setInterval(requestToImageApi, 600000);
    requestToImageApiInterval;

    const requestFallbackInterval = setInterval(requestToFallbackApi, 600000);
    requestFallbackInterval;

    router.get("/", async (_req, res) => {
        res.json({ msg: "Hello! There's nothing interesting for GET /" });
    });

    router.get("/health-check", async (_req, res) => {
        res.json({ msg: "system ok" });
    });

    return router;
}
