import "dotenv/config"

import type { AgentState } from "./agent/types.js";
import { runLoop } from "./agent/loop.js";


async function main() {
    const dummyTest: AgentState = {
        status: "running",
        turnCount: 0,
        history: [{ role: "user", content: "Read package.json file and tell me what dependencies it has?" }]
    }

    await runLoop(dummyTest)
    console.log(dummyTest)
}

main()