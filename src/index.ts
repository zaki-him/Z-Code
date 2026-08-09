import "dotenv/config"

import { callModel } from "./llm.js";
import OpenAI from "openai";


async function main() {
    const messages: OpenAI.ChatCompletionMessageParam[] = [
        { role: "user", "content": "hello, what model you are" }
    ] 

    try {
        const response = await callModel(messages)
        console.log(JSON.stringify(response, null, 2));
    } catch (err) {
        if (err instanceof Error) 
            console.error("Error calling the model: ", err.message)
    }
}

main()