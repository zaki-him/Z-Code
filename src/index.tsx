import "dotenv/config"
import React, { useState } from "react"
import { render, Box, Text, Static } from "ink"
import TextInput from "ink-text-input"
import { createAgentState } from "./agent/state.js"
import { runLoop } from "./agent/loop.js"
import type { AgentEvent } from "./agent/types.js"

type DisplayMessage = {
  role: "user" | "assistant"
  content: string
}

type LiveStatus =
  | { kind: "done" }
  | { kind: "thinking" }
  | { kind: "tool_running"; toolName: string }
  | { kind: "tool_done"; toolName: string; success: boolean }

const App = () => {
  const [state] = useState(() => createAgentState())
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState("")
  const [status, setStatus] = useState<LiveStatus>({ kind: "done" })

  const handleEvent = (event: AgentEvent) => {
    switch (event.type) {
      case "thinking":
        setStatus({ kind: "thinking" })
        break
      case "tool_call_start":
        setStatus({ kind: "tool_running", toolName: event.toolName })
        break
      case "tool_call_end":
        setStatus({ kind: "tool_done", toolName: event.toolName, success: event.result.success })
        break
      // assistant_message / error are handled after runLoop resolves, using final state
    }
  }

  const handleSubmit = async (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return

    if (trimmed === "/exit") {
      process.exit(0)
    }

    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: trimmed }])
    state.history.push({ role: "user", content: trimmed })

    await runLoop(state, handleEvent)
    setStatus({ kind: "done" })

    const last = state.history[state.history.length - 1]
    if (state.status === "done" && last?.content) {
      setMessages((prev) => [...prev, { role: "assistant", content: last.content as string }])
    } else if (state.status === "error") {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️  Something went wrong that turn." }])
    }
  }

  const renderStatus = () => {
    switch (status.kind) {
      case "thinking":
        return <Text color="yellow">Thinking...</Text>
      case "tool_running":
        return <Text color="magenta">→ Running {status.toolName}...</Text>
      case "tool_done":
        return (
          <Text color={status.success ? "green" : "red"}>
            {status.success ? "✓" : "✗"} {status.toolName}
          </Text>
        )
      default:
        return null
    }
  }

  return (
    <Box flexDirection="column">
      <Static items={messages}>
        {(msg, i) => (
          <Box key={i} marginBottom={1}>
            <Text color={msg.role === "user" ? "cyan" : "green"} bold>
              {msg.role === "user" ? "You: " : "ZCode: "}
            </Text>
            <Text>{msg.content}</Text>
          </Box>
        )}
      </Static>

      {renderStatus()}

      <Box>
        <Text color="cyan">{"> "}</Text>
        <TextInput value={input} onChange={setInput} onSubmit={handleSubmit} />
      </Box>
    </Box>
  )
}

render(<App />)