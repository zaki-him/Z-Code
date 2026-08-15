import { getAllTools } from "../tools/registry.js"
import type { Tool, ToolUsageNotes } from "../tools/types.js"


const formatToolUsageNotes = (tool: Tool) => {
    const toolName = tool.schema.function.name
    const usageNotes = tool.usageNotes
    const lines = [`When to use: ${usageNotes.whenToUse}`]
    if (usageNotes.commonMistakes) lines.push(`Common mistakes: ${usageNotes.commonMistakes}`)
    if (usageNotes.recoveryHints) lines.push(`Recovery hints: ${usageNotes.recoveryHints}`)
    if (usageNotes.extraGuidance) lines.push(`Extra guidance: ${usageNotes.extraGuidance}`)
    return { name: toolName, lines: lines.join("\n") }
}

const buildSystemPrompt = () => {
    const tools = getAllTools()
    let systemPrompt = "You are ZCode, an AI Coding Assistant\n\n**Available tools:** \n\n"

    for(const usageNotes of tools) {
        const { name , lines: formatedUsageNotes} = formatToolUsageNotes(usageNotes)
        systemPrompt += `**${name}:** \n\n`
        systemPrompt += `${formatedUsageNotes}\n\n`
    }

    return systemPrompt
}


export const systemPrompt = buildSystemPrompt()

console.log(systemPrompt)