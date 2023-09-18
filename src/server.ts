import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { Client } from "pg";
import createResourcesRouter from "./routes/resources";
import createRootRouter from "./routes/root";
import createUsersRouter from "./routes/users";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import createFavouritesRouter from "./routes/favourites";
import createTagsRouter from "./routes/tags";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(morgan("common"));
app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.use("/", createRootRouter(client));
app.use("/users", createUsersRouter(client));
app.use("/resources", createResourcesRouter(client));
app.use("/favourites", createFavouritesRouter(client));
app.use("/tags", createTagsRouter(client));

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await client.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
