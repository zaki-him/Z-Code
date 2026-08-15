import { dirname } from "path";
import { resolveProjectPath } from "../utils.js";
import type { Tool, ToolResult } from "./types.js";
import fs from "fs/promises"

export const writeFileTool: Tool = {
    schema:{
        type: "function",
        function:{
            name: "write_file",
            description: "Write the given content to a file at the specific relative path within the project. If the file exists, it will be overwritten, and if it doesn't exist, it will be created. Parent directories will be created automatically if they don't exist. Use this to create a new file or fully replace an existing file's contents. Do not use this to make a small change to part of a file — it will overwrite the entire file.",
            parameters: {
                type: "object",
                properties: {
                    path: {
                        type: "string",
                        description: "The file path relative to the project root, e.g. 'src/index.ts' or 'package.json'. Do not include a leading slash or an absolute path."
                    },
                    "content": {
                        type: "string",
                        description: "The content to write to the file. This will completely replace any existing content in the file."
                    }
                },
                required: ["path", "content"]
            }
        }
    },
    usageNotes: {
        whenToUse: "Use to create a new file or completely replace an existing file's contents.",
        commonMistakes: "Using write_file for small targeted changes. It overwrites the entire file — use edit_file instead.",
        extraGuidance: "Parent directories are created automatically if they don't exist. Any existing content in the file is fully overwritten."
    },
    execute: async (args: any): Promise<ToolResult> => {
        const resolvedPath = resolveProjectPath(args.path);
        if (!resolvedPath){
            return {
                success: false,
                content: "Access denied: File path is outside the project root."
            }
        }

        let fileExists;
        try {
            await fs.mkdir(dirname(resolvedPath), { recursive: true });
            try {
                await fs.access(resolvedPath)
                fileExists = true
            } catch {
                fileExists = false
            }
            await fs.writeFile(resolvedPath, args.content);
            return {
                success: true,
                content: fileExists ? "File overwritten successfully." : "File written successfully."
            };
        } catch (error) {
            const code = error instanceof Error && "code" in error ? (error as { code?: string }).code : undefined

            if (code === "EACCES") {
                return {
                    success: false,
                    content: "Permission denied"
                }
            }

            return {
                success: false,
                content: error instanceof Error ? error.message : "Unknown error"
            }
        }
    }
}