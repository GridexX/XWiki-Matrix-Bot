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
exports.summarize = void 0;
function summarize(content) {
    return __awaiter(this, void 0, void 0, function* () {
        const API_URL = "https://api.openai.com/v1/completions";
        const API_KEY = "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";
        const data = {
            model: "text-davinci-003",
            prompt: content +
                "Main goal: Summurize all the information above in natural language",
            max_tokens: 1024,
        };
        // Dynamically import node-fetch
        const nodeFetch = yield Promise.resolve().then(() => require("node-fetch"));
        const fetch = nodeFetch.default;
        const response = yield fetch(API_URL, {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${API_KEY}`,
            },
        });
        const responseData = (yield response.json());
        const summary = responseData.choices[0].text.trim();
        return summary;
    });
}
exports.summarize = summarize;
//# sourceMappingURL=summurizer.js.map