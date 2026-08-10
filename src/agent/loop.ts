import { callModel } from "../llm.js";
import { getToolByName } from "../tools/registry.js";
import type { ToolResult } from "../tools/types.js";
import { MAX_TURN_COUNT } from "../utils.js";
import type { AgentState } from "./types.js";

export const excuteToolCall = async (toolName: string, args: any): Promise<ToolResult> => {
    const tool = getToolByName(toolName)

    if(!tool){
        return {
            success: false,
            content: `Tool with the name "${toolName}" not found`
        }
    }

    try {
        return await tool.execute(args)
    } catch (error) {
        return {
            success: false,
            content: `tool '${toolName}' threw an unexpected error: ${error instanceof Error ? error.message : "unknown"}`
        }
    }
}

export const runLoop = async (state: AgentState) => {
    while (state.status === "running") {
        if (state.turnCount >= MAX_TURN_COUNT) {
            state.status = "error"
            break
        }

        
        const response = await callModel(state.history)
        state.turnCount++

        const message = response.choices[0]?.message

        if(message?.tool_calls && message.tool_calls.length > 0) {
            state.history.push(message)

            for (const toolCall of message.tool_calls) {
                if (toolCall.type !== "function") continue

                let args: any

                try {
                    args = JSON.parse(toolCall.function.arguments)
                }catch {
                    const toolResult: ToolResult = {
                        success: false,
                        content: `Error: could not parse arguments for '${toolCall.function.name}'. Arguments must be valid JSON.`
                    }
                    state.history.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(toolResult)
                    })
                    continue
                }

                const toolResult = await excuteToolCall(toolCall.function.name, args)

                state.history.push({
                    role: "tool",
                    tool_call_id: toolCall.id,
                    content: JSON.stringify(toolResult)
                })
            }
        } else if (message?.content && message.content.trim().length > 0) {
            state.history.push(message)
            state.status = "done"
        } else {
            console.warn("Empty response with no tool call — model may be stuck.")
            state.status = "error"
    }
    }
}
