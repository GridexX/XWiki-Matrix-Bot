"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_bot_sdk_1 = require("matrix-bot-sdk");
const path = require("path");
const config_1 = require("./config");
const handler_1 = require("./commands/handler");
// First things first: let's make the logs a bit prettier.
matrix_bot_sdk_1.LogService.setLogger(new matrix_bot_sdk_1.RichConsoleLogger());
// For now let's also make sure to log everything (for debugging)
matrix_bot_sdk_1.LogService.setLevel(matrix_bot_sdk_1.LogLevel.DEBUG);
// Print something so we know the bot is working
matrix_bot_sdk_1.LogService.info("index", "Bot starting...");
// This is the startup closure where we give ourselves an async context
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // Prepare the storage system for the bot
        const storage = new matrix_bot_sdk_1.SimpleFsStorageProvider(path.join(config_1.default.dataPath, "bot.json"));
        // Create the client
        let client;
        if (config_1.default.pantalaimon.use) { // create a client with Pantalaimon if pantalaimon.use set to true.
            const pantalaimon = new matrix_bot_sdk_1.PantalaimonClient(config_1.default.homeserverUrl, storage);
            client = yield pantalaimon.createClientWithCredentials(config_1.default.pantalaimon.username, config_1.default.pantalaimon.password);
        }
        else { // else use Matrix client.
            client = new matrix_bot_sdk_1.MatrixClient(config_1.default.homeserverUrl, config_1.default.accessToken, storage);
        }
        // Setup the autojoin mixin (if enabled)
        if (config_1.default.autoJoin) {
            matrix_bot_sdk_1.AutojoinRoomsMixin.setupOnClient(client);
        }
        // Prepare the command handler
        const commands = new handler_1.default(client);
        yield commands.start();
        matrix_bot_sdk_1.LogService.info("index", "Starting sync...");
        yield client.start(); // This blocks until the bot is killed
    });
})();
//# sourceMappingURL=index.js.map