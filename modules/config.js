// Configurazioni dell'applicazione

// Porta del server
export const PORT = process.env.PORT || 3000

// Limite massimo di cartelle
export const MAX_CARTELLE = 600

// Numero di cartelle per giocatore
export const CARTELLE_PER_GIOCATORE = 6

// Configurazioni per il loader
export const LOADER_CONFIG = {
  phases: ["Inizializzazione", "Creazione struttura", "Distribuzione numeri", "Finalizzazione"],
  messages: [
    "Inizializzazione della generazione delle cartelle...",
    "Creazione struttura delle cartelle in corso...",
    "Distribuzione dei numeri nelle cartelle...",
    "Finalizzazione e preparazione per la visualizzazione...",
  ],
}
