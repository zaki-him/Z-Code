import "dotenv/config"
import * as readline from "node:readline"
import { createAgentState } from "./agent/state.js";
import { runLoop } from "./agent/loop.js";


async function main() {
    const state = createAgentState()
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: "> "
    })

    rl.prompt()

    rl.on("line", async (line: string) => {
        const input = line.trim()

        state.history.push({ role: "user", content: input })

        await runLoop(state)
        console.log(state)
        
        rl.prompt()
    })

    rl.on("close", () => {
        process.exit(0)
    })
}

main()