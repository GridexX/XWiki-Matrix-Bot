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
exports.runPingCommand = void 0;
function runPingCommand(roomId, event, args, client) {
    return __awaiter(this, void 0, void 0, function* () {
        let text = `Pong!`;
        // Now send that message as a notice
        return client.sendMessage(roomId, {
            body: text,
            msgtype: "m.notice",
            format: "org.matrix.custom.html",
            formatted_body: text,
        });
    });
}
exports.runPingCommand = runPingCommand;
//# sourceMappingURL=ping.js.map