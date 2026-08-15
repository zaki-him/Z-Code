import "dotenv/config"

import type { AgentState } from "./agent/types.js";
import { runLoop } from "./agent/loop.js";


async function main() {
    const dummyTest: AgentState = {
        status: "running",
        turnCount: 0,
        history: [{ role: "user", content: "changed my mind i want test.txt file to have a hello" }]
    }

    await runLoop(dummyTest)
    console.log(dummyTest)
}

main()