import { resolveProjectPath } from "../utils.js";
import type { Tool, ToolResult } from "./types.js";
import fs from "fs/promises";
import { countOcurrences } from "./utils.js";

export const editFileTool: Tool = {
    schema: {
        type: "function",
        function: {
            name: "edit_file",
            description: "Edit the content of a file at the given relative path within the project. This tool allows you to make small changes to an existing file without overwriting the entire content. If the file doesn't exist, it will return an error. Use this to modify specific parts of a file while preserving the rest of its content.",
            parameters: {
                type: "object",
                properties: {
                    path: {
                        type: "string",
                        description: "The file path relative to the project root, e.g. 'src/index.ts' or 'package.json'. Do not include a leading slash or an absolute path."
                    },
                    old_string: {
                        type: "string",
                        description: "The string to be replaced in the file."
                    },
                    new_string: {
                        type: "string",
                        description: "The new string to replace the old string with."
                    }
                },
                required: ["path", "old_string", "new_string"]
            }
        }
    },
    usageNotes: {
        whenToUse: "Use to make small, targeted changes to a specific part of an existing file while preserving the rest of its content.",
        commonMistakes: "Passing an empty old_string, passing the same value for old_string and new_string, or passing an old_string that appears multiple times in the file — all three are rejected.",
        recoveryHints: "If the string is not found, re-read the file to confirm the exact content, spacing, and indentation before retrying."
    },
    execute: async (args: any): Promise<ToolResult> => {
        const resolvedPath = resolveProjectPath(args.path);
        if (!resolvedPath) {
            return {
                success: false,
                content: "Access denied: File path is outside the project root."
            }
        }

        if (args.old_string === "") {
            return { success: false, content: "old_string cannot be empty." };
        }

        if(args.old_string === args.new_string) {
            return { success: false, content: "old_string and new_string cannot be the same." };
        }
        

        let fileContent: string;
        try {
            fileContent = await fs.readFile(resolvedPath, "utf8");
        } catch (error) {
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

        const occurences = countOcurrences(fileContent, args.old_string)

        if (occurences === 0) {
            return {
                success: false,
                content: `The string "${args.old_string}" was not found in the file. No changes were made.`
            }
        }

        if (occurences > 1) {
            return {
                success: false,
                content: `The string "${args.old_string}" was found ${occurences} times in the file. Please ensure that the string to be replaced is unique to avoid unintended changes. No changes were made.`
            }
        }

        const newContent = fileContent.replace(args.old_string, args.new_string)

        try {
            await fs.writeFile(resolvedPath, newContent, "utf8");
        } catch (error) {
            return {
                success: false,
                content: "Failed to write to file"
            }
        }

        return {
            success: true,
            content: `Successfully edited ${args.path}`
        }
    }
}