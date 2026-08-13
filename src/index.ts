import "dotenv/config"

import type { AgentState } from "./agent/types.js";
import { runLoop } from "./agent/loop.js";


async function main() {
    const dummyTest: AgentState = {
        status: "running",
        turnCount: 0,
        history: [{ role: "user", content: "Use the edit_file tool to change 'hello world' to 'hello user' in tmp/example.ts" }]
    }

    await runLoop(dummyTest)
    console.log(dummyTest)
}

main()