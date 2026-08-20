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

        if(input === "/exit") {
            process.exit(0)
        }

        state.history.push({ role: "user", content: input })

        await runLoop(state)
        
        if(state.status === "done") {
            const lastMessage = state.history[state.history.length - 1]?.content
            console.log(lastMessage)
        }
        
        
        rl.prompt()
    })

    rl.on("close", () => {
        process.exit(0)
    })
}

main()