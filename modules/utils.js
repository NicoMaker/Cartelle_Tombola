/**
 * Mescola un array in modo casuale (algoritmo Fisher-Yates)
 * @param {Array} array - Array da mescolare
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Distribuisce il numero di elementi per cartella in una colonna
 * @param {number} totalNumbers - Numero totale di elementi nella colonna
 * @param {number} numCards - Numero di cartelle
 * @returns {Array} Array con il numero di elementi per cartella
 */
export function distributeColumnNumbers(totalNumbers, numCards) {
  // Inizializza con la distribuzione base
  const distribution = Array(numCards).fill(Math.floor(totalNumbers / numCards))

  // Distribuisci i numeri rimanenti
  const remaining = totalNumbers - Math.floor(totalNumbers / numCards) * numCards
  for (let i = 0; i < remaining; i++) {
    distribution[i]++
  }

  // Mescola la distribuzione per evitare che le prime cartelle abbiano sempre più numeri
  shuffleArray(distribution)

  return distribution
}

/**
 * Crea un ID univoco per una cartella
 * @param {number} giocatoreNumber - Numero del giocatore
 * @param {number} cardIndex - Indice della cartella
 * @returns {number} ID della cartella
 */
export function generateCardId(giocatoreNumber, cardIndex) {
  return (giocatoreNumber - 1) * 6 + cardIndex + 1
}
