import "dotenv/config"

import type { AgentState } from "./agent/types.js";
import { runLoop } from "./agent/loop.js";


async function main() {
    const dummyTest: AgentState = {
        status: "running",
        turnCount: 0,
        history: [{ role: "user", content: "Create a file named 'test.txt' telling the user to do something. It should be inside a folder named 'test" }]
    }

    await runLoop(dummyTest)
    console.log(dummyTest)
}

main()