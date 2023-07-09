import {
    AutojoinRoomsMixin,
    LogLevel,
    LogService,
    MatrixClient,
    PantalaimonClient,
    RichConsoleLogger,
    SimpleFsStorageProvider,
} from "matrix-bot-sdk";
import * as path from "path";
import CommandHandler from "./commands/handler";
import config from "./config";

// First things first: let's make the logs a bit prettier.
LogService.setLogger(new RichConsoleLogger());

// For now let's also make sure to log everything (for debugging)
LogService.setLevel(LogLevel.DEBUG);

// Print something so we know the bot is working
LogService.info("index", "Bot starting...");

// This is the startup closure where we give ourselves an async context
async function main() {
    // Prepare the storage system for the bot

    const storage = new SimpleFsStorageProvider(
        path.join(config.matrixBot.dataPath, "bot.json")
    );

    // Create the client
    let client: MatrixClient;
    if (config.matrixBot.use) {
        // create a client with matrixBot if matrixBot.use set to true.
        const matrixBot = new PantalaimonClient(
            config.matrixBot.homeserverUrl,
            storage
        );
        client = await matrixBot.createClientWithCredentials(
            config.matrixBot.username,
            config.matrixBot.password
        );
    } else {
        // else use Matrix client.
        client = new MatrixClient(
            config.matrixBot.homeserverUrl,
            config.matrixBot.accessToken,
            storage
        );
    }

    // Setup the autojoin mixin (if enabled)
    if (config.matrixBot.autoJoin) {
        AutojoinRoomsMixin.setupOnClient(client);
    }

    // Prepare the command handler
    const commands = new CommandHandler(client);

    await commands.start();
    LogService.info("index", "Starting sync...");
    await client.start(); // This blocks until the bot is killed
}

main();
