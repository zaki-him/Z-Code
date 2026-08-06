import "dotenv/config"

import { callModel } from "./llm.js";
import OpenAI from "openai";



async function main() {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "user", "content": "hello, what model you are" }
    ] 

    const response = await callModel(messages)
    console.log(JSON.stringify(response, null, 2));
}

main()