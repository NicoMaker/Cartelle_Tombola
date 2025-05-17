import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import { generateTombolaSet } from "./lib/tombola-generator.js"

// Configurazione di Express con ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Middleware per servire file statici
app.use(express.static("public"))
app.use(express.json())

// API per generare set di cartelle
app.post("/api/generate", (req, res) => {
  const { numSets = 1 } = req.body

  try {
    const sets = []
    for (let i = 0; i < numSets; i++) {
      sets.push(generateTombolaSet(i + 1))
    }

    res.json({ success: true, sets })
  } catch (error) {
    console.error("Errore nella generazione:", error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Route principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Avvio del server
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`)
  console.log(`Apri http://localhost:${PORT} nel tuo browser`)
})
