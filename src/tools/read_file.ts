import { isPathInsideProjectRoot, PROJECT_ROOT } from "../utils.js"
import fs from "fs/promises"
import type { ToolResult, Tool } from "./types.js"


export const readFileTool: Tool = {
  schema: {
    type: "function",
    function: {
      name: "read_file",
      description: "Reads the full text content of a file at the given relative path within the project. Use this when you need to see a file's contents before editing or analyzing it. Returns the raw file content as a string, or an error message if the file doesn't exist or can't be read.",
      parameters: {
        type: "object",
        properties: {
          path: {
            type: "string",
            description: "The file path relative to the project root, e.g. 'src/index.ts' or 'package.json'. Do not include a leading slash or an absolute path."
          }
        },
        required: ["path"]
      }
    }
  },
  execute: async (args: any): Promise<ToolResult> => {
    if (!isPathInsideProjectRoot(args.path)) {
        return {
            success: false,
            content: "Access denied: File path is outside the project root."
        }
    }
    try {
        const fileContent = await fs.readFile(args.path, "utf-8")
        return {
            success: true,
            content: fileContent
        }
    } catch (error: unknown) {
        const code = error instanceof Error && "code" in error ? (error as { code?: string }).code : undefined

        if (code === "ENOENT") {
            return {
                success: false,
                content: "File not found"
            }
        } else if (code === "EACCES") {
            return {
                success: false,
                content: "Permission denied"
            }
        } else if (code === "EISDIR") {
            return {
                success: false,
                content: "Path is a directory, not a file"
            }
        }

        return {
            success: false,
            content: error instanceof Error ? error.message : "Unknown error"
        }
    }
}
};