import type { ChatCompletionMessageParam } from "openai/resources";

export type AgentState = {
    status: "done" | "running" | "error";
    turnCount: number;
    history: ChatCompletionMessageParam[]
}