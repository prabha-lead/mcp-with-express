import express from "express"
import fetch from "node-fetch"

const app = express()
const port = 4000

app.get("/api/weather", async (req, res) => {
  const city = req.query.city

  if (!city || typeof city !== "string") {
    return res.status(400).json({ error: "City is required" })
  }

  try {
    const response = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`)
    const data = await response.json()

    const current = data.current_condition?.[0]
    if (!current) {
      return res.status(404).json({ error: "Weather data not found" })
    }

    res.json({
      city,
      temperature: current.temp_C,
      description: current.weatherDesc?.[0]?.value,
    })
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch weather data" })
  }
})

app.listen(port, () => {
  console.log(`Express weather API running at http://localhost:${port}`)
})
