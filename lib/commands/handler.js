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
exports.COMMAND_PREFIX = void 0;
const matrix_bot_sdk_1 = require("matrix-bot-sdk");
const hello_1 = require("./hello");
const ping_1 = require("./ping");
const echo_1 = require("./echo");
const info_1 = require("./info");
const sum_1 = require("./sum");
const search_1 = require("./search");
const ask_1 = require("./ask");
const htmlEscape = require("escape-html");
// The prefix required to trigger the bot. The bot will also respond
// to being pinged directly.
exports.COMMAND_PREFIX = "!aibot";
// This is where all of our commands will be handled
class CommandHandler {
    constructor(client) {
        this.client = client;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            // Populate the variables above (async)
            yield this.prepareProfile();
            // Set up the event handler
            this.client.on("room.message", this.onMessage.bind(this));
        });
    }
    prepareProfile() {
        return __awaiter(this, void 0, void 0, function* () {
            this.userId = yield this.client.getUserId();
            this.localpart = new matrix_bot_sdk_1.UserID(this.userId).localpart;
            try {
                const profile = yield this.client.getUserProfile(this.userId);
                if (profile && profile["displayname"])
                    this.displayName = profile["displayname"];
            }
            catch (e) {
                // Non-fatal error - we'll just log it and move on.
                matrix_bot_sdk_1.LogService.warn("CommandHandler", e);
            }
        });
    }
    onMessage(roomId, ev) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = new matrix_bot_sdk_1.MessageEvent(ev);
            if (event.isRedacted)
                return; // Ignore redacted events that come through
            if (event.sender === this.userId)
                return; // Ignore ourselves
            if (event.messageType !== "m.text")
                return; // Ignore non-text messages
            // Ensure that the event is a command before going on. We allow people to ping
            // the bot as well as using our COMMAND_PREFIX.
            const prefixes = [
                exports.COMMAND_PREFIX,
                `${this.localpart}:`,
                `${this.displayName}:`,
                `${this.userId}:`,
            ];
            const prefixUsed = prefixes.find((p) => event.textBody.startsWith(p));
            if (!prefixUsed)
                return; // Not a command (as far as we're concerned)
            // Check to see what the arguments were to the command
            const args = event.textBody
                .substring(prefixUsed.length)
                .trim()
                .split(" ");
            // Try and figure out what command the user ran, defaulting to help
            try {
                switch (args[0]) {
                    case "hello": {
                        return (0, hello_1.runHelloCommand)(roomId, event, args, this.client);
                    }
                    case "ping": {
                        return (0, ping_1.runPingCommand)(roomId, event, args, this.client);
                    }
                    case "echo": {
                        return (0, echo_1.runEchoCommand)(roomId, event, args, this.client);
                    }
                    case "info": {
                        return (0, info_1.runInfoCommand)(roomId, event, args, this.client);
                    }
                    case "sum": {
                        return (0, sum_1.runSumCommand)(roomId, event, args, this.client);
                    }
                    case "search": {
                        return (0, search_1.runSearchCommand)(roomId, event, ev, args, this.client);
                    }
                    case "ask": {
                        return (0, ask_1.runAskCommand)(roomId, event, args, this.client);
                    }
                    default: {
                        const help = "" +
                            "!bot hello [user]     - Say hello to a user.\n" +
                            "!bot help             - This menu\n";
                        const text = `Help menu:\n${help}`;
                        const html = `<b>Help menu:</b><br /><pre><code>${htmlEscape(help)}</code></pre>`;
                        const reply = matrix_bot_sdk_1.RichReply.createFor(roomId, ev, text, html); // Note that we're using the raw event, not the parsed one!
                        reply["msgtype"] = "m.notice"; // Bots should always use notices
                        return this.client.sendMessage(roomId, reply);
                    }
                }
            }
            catch (e) {
                // Log the error
                matrix_bot_sdk_1.LogService.error("CommandHandler", e);
                // Tell the user there was a problem
                const message = "There was an error processing your command";
                const reply = matrix_bot_sdk_1.RichReply.createFor(roomId, ev, message, message); // We don't need to escape the HTML because we know it is safe
                reply["msgtype"] = "m.notice";
                return this.client.sendMessage(roomId, reply);
            }
        });
    }
}
exports.default = CommandHandler;
//# sourceMappingURL=handler.js.map