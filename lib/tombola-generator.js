/**
 * Generatore di cartelle della tombola
 * Ogni set di 6 cartelle contiene tutti i numeri da 1 a 90
 */

/**
 * Genera un giocatore di 6 cartelle della tombola con tutti i numeri da 1 a 90
 * @param {number} giocatoreNumber - Numero identificativo del giocatore
 * @returns {Array} Array di 6 cartelle
 */
export function generateTombolaGiocatore(giocatoreNumber) {
  // Crea un array con tutti i numeri da 1 a 90
  const allNumbers = Array.from({ length: 90 }, (_, i) => i + 1)

  // Mescola i numeri
  shuffleArray(allNumbers)

  // Dividi i numeri in 9 colonne secondo le regole della tombola
  const columns = [
    allNumbers.filter((n) => n >= 1 && n <= 9), // Colonna 1: 1-9
    allNumbers.filter((n) => n >= 10 && n <= 19), // Colonna 2: 10-19
    allNumbers.filter((n) => n >= 20 && n <= 29), // Colonna 3: 20-29
    allNumbers.filter((n) => n >= 30 && n <= 39), // Colonna 4: 30-39
    allNumbers.filter((n) => n >= 40 && n <= 49), // Colonna 5: 40-49
    allNumbers.filter((n) => n >= 50 && n <= 59), // Colonna 6: 50-59
    allNumbers.filter((n) => n >= 60 && n <= 69), // Colonna 7: 60-69
    allNumbers.filter((n) => n >= 70 && n <= 79), // Colonna 8: 70-79
    allNumbers.filter((n) => n >= 80 && n <= 90), // Colonna 9: 80-90
  ]

  // Mescola ogni colonna
  columns.forEach((col) => shuffleArray(col))

  // Crea 6 cartelle vuote
  const cards = Array(6)
    .fill()
    .map(() =>
      Array(3)
        .fill()
        .map(() => Array(9).fill(null)),
    )

  // Distribuisci i numeri nelle cartelle
  distributeNumbers(columns, cards)

  // Formatta le cartelle per la risposta
  return cards.map((card, index) => ({
    id: (giocatoreNumber - 1) * 6 + index + 1,
    setNumber: giocatoreNumber,
    cardNumber: index + 1,
    grid: card,
  }))
}

/**
 * Mescola un array in modo casuale (algoritmo Fisher-Yates)
 * @param {Array} array - Array da mescolare
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
  }
}

/**
 * Distribuisce i numeri nelle cartelle secondo le regole della tombola
 * @param {Array} columns - Array di colonne con i numeri
 * @param {Array} cards - Array di cartelle vuote
 */
function distributeNumbers(columns, cards) {
  // Per ogni colonna
  for (let colIndex = 0; colIndex < 9; colIndex++) {
    const colNumbers = [...columns[colIndex]]

    // Determina quanti numeri per ogni cartella in questa colonna
    // Ogni cartella deve avere 15 numeri in totale, distribuiti nelle 9 colonne
    // Alcune colonne avranno 1 numero, altre 2 (raramente 3)
    const numbersPerCard = distributeColumnNumbers(colNumbers.length, cards.length)

    // Assegna i numeri alle cartelle
    let numberIndex = 0
    for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
      const card = cards[cardIndex]
      const numToAssign = numbersPerCard[cardIndex]

      // Prendi i numeri per questa cartella
      const cardNumbers = colNumbers.slice(numberIndex, numberIndex + numToAssign)
      numberIndex += numToAssign

      // Ordina i numeri
      cardNumbers.sort((a, b) => a - b)

      // Assegna i numeri alle righe della cartella
      assignNumbersToRows(card, colIndex, cardNumbers)
    }
  }

  // Assicurati che ogni riga abbia esattamente 5 numeri
  for (const card of cards) {
    balanceCardRows(card)
  }
}

/**
 * Distribuisce il numero di elementi per cartella in una colonna
 * @param {number} totalNumbers - Numero totale di elementi nella colonna
 * @param {number} numCards - Numero di cartelle
 * @returns {Array} Array con il numero di elementi per cartella
 */
function distributeColumnNumbers(totalNumbers, numCards) {
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
 * Assegna i numeri alle righe di una cartella
 * @param {Array} card - La cartella
 * @param {number} colIndex - Indice della colonna
 * @param {Array} numbers - Numeri da assegnare
 */
function assignNumbersToRows(card, colIndex, numbers) {
  // Se non ci sono numeri, esci
  if (numbers.length === 0) return

  // Ordina i numeri
  numbers.sort((a, b) => a - b)

  // Assegna i numeri alle righe
  if (numbers.length === 1) {
    // Un solo numero: mettilo in una riga casuale
    const rowIndex = Math.floor(Math.random() * 3)
    card[rowIndex][colIndex] = numbers[0]
  } else if (numbers.length === 2) {
    // Due numeri: mettili in righe diverse
    const rows = [0, 1, 2]
    shuffleArray(rows)
    card[rows[0]][colIndex] = numbers[0]
    card[rows[1]][colIndex] = numbers[1]
  } else if (numbers.length === 3) {
    // Tre numeri: uno per ogni riga
    card[0][colIndex] = numbers[0]
    card[1][colIndex] = numbers[1]
    card[2][colIndex] = numbers[2]
  }
}

/**
 * Bilancia le righe di una cartella per assicurarsi che ogni riga abbia esattamente 5 numeri
 * @param {Array} card - La cartella da bilanciare
 */
function balanceCardRows(card) {
  // Conta i numeri in ogni riga
  const rowCounts = card.map((row) => row.filter((cell) => cell !== null).length)

  // Se tutte le righe hanno 5 numeri, non fare nulla
  if (rowCounts.every((count) => count === 5)) return

  // Righe con troppi numeri
  const excessRows = rowCounts
    .map((count, index) => ({ index, count }))
    .filter((row) => row.count > 5)
    .sort((a, b) => b.count - a.count)

  // Righe con pochi numeri
  const deficitRows = rowCounts
    .map((count, index) => ({ index, count }))
    .filter((row) => row.count < 5)
    .sort((a, b) => a.count - b.count)

  // Sposta i numeri dalle righe con troppi a quelle con pochi
  while (excessRows.length > 0 && deficitRows.length > 0) {
    const sourceRow = excessRows[0]
    const targetRow = deficitRows[0]

    // Trova una colonna da cui spostare un numero
    for (let col = 0; col < 9; col++) {
      if (card[sourceRow.index][col] !== null && card[targetRow.index][col] === null) {
        // Sposta il numero
        card[targetRow.index][col] = card[sourceRow.index][col]
        card[sourceRow.index][col] = null

        // Aggiorna i conteggi
        sourceRow.count--
        targetRow.count++

        // Riordina le righe se necessario
        if (sourceRow.count === 5) {
          excessRows.shift()
        }
        if (targetRow.count === 5) {
          deficitRows.shift()
        }

        break
      }
    }
  }
}
