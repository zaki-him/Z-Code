import type { ChatCompletionMessageParam } from "openai/resources";
import type { ToolResult } from "../tools/types.js";

export type AgentState = {
    status: "done" | "running" | "error";
    turnCount: number;
    history: ChatCompletionMessageParam[]
}

export type AgentEvent =
  | { type: "thinking" }
  | { type: "tool_call_start"; toolName: string; args: any }
  | { type: "tool_call_end"; toolName: string; result: ToolResult }
  | { type: "assistant_message"; content: string }
  | { type: "error"; reason: string }