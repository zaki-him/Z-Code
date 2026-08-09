import path from "node:path"

export const PROJECT_ROOT = process.cwd()

export const isPathInsideProjectRoot = (filePath: string): boolean => {
    const absPath = path.resolve(PROJECT_ROOT, filePath)

    return absPath.startsWith(PROJECT_ROOT + path.sep)
}