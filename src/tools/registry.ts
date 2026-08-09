import { readFileTool } from "./read_file.js";
import type { Tool } from "./types.js";

const tools: Record<string, Tool> = {
    readFile: readFileTool
}