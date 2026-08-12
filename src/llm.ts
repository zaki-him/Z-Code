import OpenAI from "openai"
import { config } from "./config.js"
import type { ToolSchema } from "./tools/types.js"

const model = config.model

const client = new OpenAI({
    apiKey: config.apikey,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export const callModel = async (messages: OpenAI.ChatCompletionMessageParam[], tools: ToolSchema[]) => {
    const response = await client.chat.completions.create({
        model,
        max_tokens: config.maxTokens,
        messages,
        tools,
        tool_choice: "auto"
    })

    return response
}