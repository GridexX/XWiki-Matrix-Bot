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
exports.runHelloCommand = void 0;
const matrix_bot_sdk_1 = require("matrix-bot-sdk");
const htmlEscape = require("escape-html");
function runHelloCommand(roomId, event, args, client) {
    return __awaiter(this, void 0, void 0, function* () {
        // The first argument is always going to be us, so get the second argument instead.
        let sayHelloTo = args[1];
        if (!sayHelloTo)
            sayHelloTo = event.sender;
        let text = `Hello ${sayHelloTo}!`;
        let html = `Hello ${htmlEscape(sayHelloTo)}!`;
        if (sayHelloTo.startsWith("@")) {
            // Awesome! The user supplied an ID so we can create a proper mention instead
            const mention = yield matrix_bot_sdk_1.MentionPill.forUser(sayHelloTo, roomId, client);
            text = `Hello ${mention.text}!`;
            html = `Hello ${mention.html}!`;
        }
        // Now send that message as a notice
        return client.sendMessage(roomId, {
            body: text,
            msgtype: "m.notice",
            format: "org.matrix.custom.html",
            formatted_body: html,
        });
    });
}
exports.runHelloCommand = runHelloCommand;
//# sourceMappingURL=hello.js.map