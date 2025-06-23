import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import fetch from "node-fetch"

const server = new McpServer({
  name: "mcp-with-express",
  version: "1.0.0",
})

// Call getServerName tool
server.tool("getServerName", "Get the server name", {}, async () => ({
  content: [{ type: "text", text: process.env.SERVER_NAME || "No server name set" }],
}))

// Call Express API at localhost:4000
server.tool(
  "getWeatherByCity",
  "Get weather by city name",
  { city: z.string() },
  async ({ city }) => {
    try {
      const response = await fetch(`http://localhost:4000/api/weather?city=${encodeURIComponent(city)}`)
      const data = await response.json()

      if (!response.ok) {
        return { content: [{ type: "text", text: `Error: ${data.error}` }] }
      }

      return {
        content: [
          {
            type: "text",
            text: `Weather in ${data.city}: ${data.description}, ${data.temperature}°C`,
          },
        ],
      }
    } catch (err) {
      return { content: [{ type: "text", text: "Failed to fetch from local Express API" }] }
    }
  }
)

const transport = new StdioServerTransport()
await server.connect(transport)
