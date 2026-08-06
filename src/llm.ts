import OpenAI from "openai"
import { config } from "./config.js"

const model = config.model

const client = new OpenAI({
    apiKey: config.apikey,
        baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
})

export const callModel = async (messages: OpenAI.ChatCompletionMessageParam[]) => {
    const response = await client.chat.completions.create({
        model,
        max_tokens: config.maxTokens,
        messages
    })

    return response
}