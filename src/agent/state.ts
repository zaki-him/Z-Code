import { systemPrompt } from "./prompts.js";
import type { AgentState } from "./types.js";

export const createAgentState = (): AgentState => {
    const state: AgentState = {
        status: "running",
        turnCount: 0,
        history: [{ role: "system", content: systemPrompt }]
    }
    
    return state
}