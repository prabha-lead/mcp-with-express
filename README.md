# Wrapping MCP server with Express

## Overview

**MCP (Model Context Protocol)** is a framework that enables custom tools to be integrated into AI-powered development environments like **Cursor AI**. Tools exposed via MCP can fetch external data, automate tasks, or interact with services on behalf of the developer.

This project demonstrates how to wrap an MCP server with an **Express.js API**. Specifically, it uses:

- An **MCP server** exposing two tools:
  - `getServerName`: returns the server name from environment
  - `getWeatherByCity`: returns weather info for a given city
- An **Express REST API** that fetches weather data using `https://wttr.in` (a free weather service)
- A `concurrently`-based setup to run both servers simultaneously
- A `mcp.json` file for Cursor IDE integration

---

## Requirements

- **Node.js:** Version 20 or higher
- **Cursor IDE:** With Agent Mode enabled

---

## Features

- ✅ **MCP + Express Integration**  
  MCP tools interact with a local Express server, enabling clean separation of tool logic and HTTP services.

- 🌦️ **Weather by City Tool**  
  The `getWeatherByCity` tool fetches weather data from `wttr.in` through an Express route.

- 🧠 **Environment-Driven Server Name Tool**  
  The `getServerName` tool returns the current server name via an environment variable.

- 📦 **Zod Validation**  
  Input validation is handled with [Zod](https://github.com/colinhacks/zod).

- 🔄 **StdioServerTransport**  
  Cursor IDE communicates with the MCP server using standard I/O.

---

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd mcp-server-node
```

### 2. Install Dependencies

```bash
npm install
```

---

## Running the Server

Use the `start` script to launch both MCP and Express servers together:

```bash
npm start
```

This runs:

- `mcp-server.js`: MCP tool definitions
- `express-api.js`: Express REST endpoint for weather

---

## Cursor IDE Integration

To connect this project to Cursor:

### 1. Create a `mcp.json` file

Place this in the root of your project:

```json
{
  "mcpServers": {
    "mcp-with-express": {
      "command": "/absolute/path/to/node",
      "args": ["/absolute/path/to/mcp-server.js"],
      "env": {
        "SERVER_NAME": "mcp-with-express"
      }
    }
  }
}
```

### Getting Absolute Paths

To correctly set up the `mcp.json` file, you need the absolute paths for the Node.js executable and the `mcp-server.js` file. Here's how you can find these paths on different operating systems:

#### On macOS:

1. **Node.js Path:**

   - Open Terminal.
   - Run the command: `which node`
   - This will output the absolute path to the Node.js executable.

2. **mcp-server.js Path:**
   - In Terminal, navigate to your project directory using `cd /path/to/your/project`.
   - Run the command: `pwd`
   - Append `/mcp-server.js` to the output to get the full path.

#### On Windows:

1. **Node.js Path:**

   - Open Command Prompt.
   - Run the command: `where node`
   - This will output the absolute path to the Node.js executable.

2. **mcp-server.js Path:**
   - Open Command Prompt and navigate to your project directory using `cd \path\to\your\project`.
   - Run the command: `cd` (or `echo %cd%` for the full path)
   - Append `\mcp-server.js` to the output to get the full path.

- Replace the paths with output from `which node` and the full path to `mcp-server.js`.
- The `SERVER_NAME` env var is used by the `getServerName` tool.

### 2. Open Cursor and enable **Agent Mode**

Once enabled, Cursor will auto-discover the MCP tools based on your `mcp.json`.

---

## Example Prompts (Cursor Agent Mode)

You can now use prompts like:

- `What's the weather in Tokyo?`
- `Tell me the server name.`

Cursor will automatically invoke:

- `getWeatherByCity`
- `getServerName`

---

## Code Structure

### `mcp-server.js`

Defines tools and connects to Cursor via `StdioServerTransport`.

- **Tool:** `getWeatherByCity`

  - Input: `{ city: string }`
  - Fetches weather from Express server at `localhost:4000/api/weather`

- **Tool:** `getServerName`

  - Output: Value from `process.env.SERVER_NAME`

### `express-api.js`

- **Route:** `/api/weather?city=CityName`

  - Uses `https://wttr.in` (no API key needed)
  - Returns `{ city, temperature, description }`

---

## Technologies Used

- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)
- [Express](https://expressjs.com/)
- [Zod](https://zod.dev/)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [wttr.in](https://github.com/chubin/wttr.in)

---

## Optional: Global Cursor Configuration

You can also move the `mcp.json` file to your global Cursor directory:

```bash
~/.cursor/mcp.json
```

This allows the MCP integration to work across all Cursor projects.

---

## References

- [Model Context Protocol Introduction](https://modelcontextprotocol.io/introduction)
- [MCP TypeScript SDK GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [wttr.in weather API](https://github.com/chubin/wttr.in)
