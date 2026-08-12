import { readFileTool } from "./read_file.js";
import type { Tool, ToolSchema } from "./types.js";

const tools: Record<string, Tool> = {
    read_file: readFileTool
}

export const getToolByName = (name: string): Tool | undefined => {
    return tools[name]
}

export const getAllToolSchemas = (): ToolSchema[] => {
    return Object.values(tools).map(tool => tool.schema)
}