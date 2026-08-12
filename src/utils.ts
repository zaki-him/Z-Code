import path from "node:path"

export const PROJECT_ROOT = process.cwd()
export const MAX_TURN_COUNT = 10

export const resolveProjectPath = (filePath: string): string | null => {
    const absPath = path.resolve(PROJECT_ROOT, filePath)
    if (!absPath.startsWith(PROJECT_ROOT + path.sep)) return null
    return absPath
}