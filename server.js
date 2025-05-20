import express from "express"
import path from "path"
import { fileURLToPath } from "url"
import chart from "chart.js"

// Ottieni il percorso corrente
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Importa il modulo di configurazione
import { PORT } from "./modules/config.js"

// Crea l'applicazione Express
const app = express()

// Configura i file statici
app.use(express.static(path.join(__dirname, "public")))

// Rotta principale
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"))
})

// API per generare le cartelle
app.get("/api/generate/:numGiocatori", async (req, res) => {
  try {
    // Importa dinamicamente il modulo cardGenerator
    const { generateTombolaGiocatori } = await import("./modules/cardGenerator.js")

    const numGiocatori = Number.parseInt(req.params.numGiocatori)

    // Validazione
    if (isNaN(numGiocatori) || numGiocatori < 1 || numGiocatori > 600) {
      return res.status(400).json({
        error: "Numero di giocatori non valido. Deve essere tra 1 e 600.",
      })
    }

    // Genera le cartelle
    const giocatori = generateTombolaGiocatori(numGiocatori)

    // Invia la risposta
    res.json({ success: true, giocatori })
  } catch (error) {
    console.error("Errore nella generazione delle cartelle:", error)
    res.status(500).json({
      error: "Si è verificato un errore durante la generazione delle cartelle.",
    })
  }
})

// Avvia il server
app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`)
})
