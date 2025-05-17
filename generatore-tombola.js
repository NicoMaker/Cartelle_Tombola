// Generatore di cartelle della tombola italiana
// Ogni cartella ha 3 righe e 9 colonne, con 5 numeri per riga (15 numeri totali)

/**
 * Genera una cartella della tombola con 15 numeri disposti secondo le regole tradizionali
 * @returns {Array<Array<number|null>>} Una matrice 3x9 che rappresenta la cartella
 */
function generaCartella() {
  // Inizializza la cartella vuota (3 righe x 9 colonne)
  const cartella = Array(3).fill().map(() => Array(9).fill(null));
  
  // Genera numeri per ogni colonna rispettando i range
  const colonne = [];
  
  // Colonna 1: numeri da 1 a 9
  colonne.push(generaNumeriColonna(1, 9));
  
  // Colonne 2-8: numeri da x0 a x9 (es. 10-19, 20-29, ecc.)
  for (let i = 1; i <= 7; i++) {
    colonne.push(generaNumeriColonna(i * 10, i * 10 + 9));
  }
  
  // Colonna 9: numeri da 80 a 90
  colonne.push(generaNumeriColonna(80, 90));
  
  // Distribuisci i numeri nelle righe (5 numeri per riga)
  distribuisciNumeri(cartella, colonne);
  
  return cartella;
}

/**
 * Genera numeri casuali per una colonna
 * @param {number} min - Valore minimo
 * @param {number} max - Valore massimo
 * @returns {Array<number>} Array di numeri casuali (da 0 a 3 numeri)
 */
function generaNumeriColonna(min, max) {
  const numeri = [];
  // Ogni colonna può avere da 0 a 3 numeri
  const quantita = Math.floor(Math.random() * 4); // 0, 1, 2 o 3 numeri
  
  // Genera numeri unici per questa colonna
  const possibili = Array.from({length: max - min + 1}, (_, i) => min + i);
  for (let i = 0; i < quantita; i++) {
    const indice = Math.floor(Math.random() * possibili.length);
    numeri.push(possibili.splice(indice, 1)[0]);
  }
  
  return numeri.sort((a, b) => a - b);
}

/**
 * Distribuisce i numeri nelle righe della cartella
 * @param {Array<Array<number|null>>} cartella - La cartella da riempire
 * @param {Array<Array<number>>} colonne - I numeri generati per ogni colonna
 */
function distribuisciNumeri(cartella, colonne) {
  // Conta quanti numeri abbiamo in totale
  const totaleNumeri = colonne.flat().length;
  
  // Se abbiamo meno di 15 numeri, ne aggiungiamo altri
  if (totaleNumeri < 15) {
    const mancanti = 15 - totaleNumeri;
    aggiungiNumeriMancanti(colonne, mancanti);
  }
  // Se abbiamo più di 15 numeri, ne rimuoviamo alcuni
  else if (totaleNumeri > 15) {
    const eccesso = totaleNumeri - 15;
    rimuoviNumeriInEccesso(colonne, eccesso);
  }
  
  // Assegna 5 numeri per riga
  for (let riga = 0; riga < 3; riga++) {
    let numeriInseriti = 0;
    
    // Continua finché non abbiamo 5 numeri nella riga
    while (numeriInseriti < 5) {
      // Scegli una colonna casuale che ha ancora numeri
      const colonneConNumeri = colonne.map((col, idx) => col.length > 0 ? idx : -1).filter(idx => idx !== -1);
      if (colonneConNumeri.length === 0) break;
      
      const indiceColonna = colonneConNumeri[Math.floor(Math.random() * colonneConNumeri.length)];
      
      // Prendi il primo numero dalla colonna
      const numero = colonne[indiceColonna].shift();
      
      // Inserisci il numero nella cartella
      cartella[riga][indiceColonna] = numero;
      numeriInseriti++;
    }
  }
  
  // Ordina i numeri in ogni riga
  for (let riga = 0; riga < 3; riga++) {
    for (let col = 0; col < 9; col++) {
      if (cartella[riga][col] === null) continue;
      
      // Trova la posizione corretta per questo numero nella sua colonna
      let numeriColonna = [];
      for (let r = 0; r < 3; r++) {
        if (cartella[r][col] !== null) {
          numeriColonna.push({riga: r, valore: cartella[r][col]});
        }
      }
      
      // Ordina i numeri nella colonna
      numeriColonna.sort((a, b) => a.valore - b.valore);
      
      // Riassegna i numeri ordinati
      for (let i = 0; i < numeriColonna.length; i++) {
        cartella[numeriColonna[i].riga][col] = null;
      }
      for (let i = 0; i < numeriColonna.length; i++) {
        cartella[i][col] = numeriColonna[i].valore;
      }
    }
  }
}

/**
 * Aggiunge numeri mancanti per arrivare a 15
 * @param {Array<Array<number>>} colonne - Le colonne da modificare
 * @param {number} mancanti - Quanti numeri mancano
 */
function aggiungiNumeriMancanti(colonne, mancanti) {
  for (let i = 0; i < mancanti; i++) {
    // Scegli una colonna casuale
    const indiceColonna = Math.floor(Math.random() * 9);
    const colonna = colonne[indiceColonna];
    
    // Determina il range di numeri per questa colonna
    let min, max;
    if (indiceColonna === 0) {
      min = 1;
      max = 9;
    } else if (indiceColonna === 8) {
      min = 80;
      max = 90;
    } else {
      min = indiceColonna * 10;
      max = min + 9;
    }
    
    // Trova numeri che non sono già nella colonna
    const numeriEsistenti = new Set(colonna);
    const numeriPossibili = [];
    for (let num = min; num <= max; num++) {
      if (!numeriEsistenti.has(num)) {
        numeriPossibili.push(num);
      }
    }
    
    // Aggiungi un numero casuale tra quelli possibili
    if (numeriPossibili.length > 0) {
      const nuovoNumero = numeriPossibili[Math.floor(Math.random() * numeriPossibili.length)];
      colonna.push(nuovoNumero);
      colonna.sort((a, b) => a - b);
    }
  }
}

/**
 * Rimuove numeri in eccesso per arrivare a 15
 * @param {Array<Array<number>>} colonne - Le colonne da modificare
 * @param {number} eccesso - Quanti numeri sono in eccesso
 */
function rimuoviNumeriInEccesso(colonne, eccesso) {
  for (let i = 0; i < eccesso; i++) {
    // Trova colonne che hanno numeri
    const colonneConNumeri = colonne.map((col, idx) => col.length > 0 ? idx : -1).filter(idx => idx !== -1);
    
    // Scegli una colonna casuale
    const indiceColonna = colonneConNumeri[Math.floor(Math.random() * colonneConNumeri.length)];
    const colonna = colonne[indiceColonna];
    
    // Rimuovi un numero casuale
    const indiceNumero = Math.floor(Math.random() * colonna.length);
    colonna.splice(indiceNumero, 1);
  }
}

/**
 * Formatta una cartella per la visualizzazione
 * @param {Array<Array<number|null>>} cartella - La cartella da formattare
 * @returns {string} La cartella formattata come stringa
 */
function formattaCartella(cartella, numero) {
  let output = `\n╔════════════════════════════════════════════════════╗\n`;
  output += `║                   CARTELLA #${String(numero).padStart(3, '0')}                   ║\n`;
  output += `╠════╦════╦════╦════╦════╦════╦════╦════╦════╣\n`;
  
  for (let riga = 0; riga < 3; riga++) {
    output += '║';
    for (let col = 0; col < 9; col++) {
      const valore = cartella[riga][col];
      if (valore === null) {
        output += '    ';
      } else {
        output += ` ${String(valore).padStart(2, ' ')} `;
      }
      output += '║';
    }
    if (riga < 2) {
      output += '\n╠════╬════╬════╬════╬════╬════╬════╬════╬════╣\n';
    } else {
      output += '\n╚════╩════╩════╩════╩════╩════╩════╩════╩════╝\n';
    }
  }
  
  return output;
}

/**
 * Genera e stampa un numero specificato di cartelle
 * @param {number} quantita - Quante cartelle generare
 */
function generaCartelle(quantita) {
  console.log(`Generazione di ${quantita} cartelle della tombola...\n`);
  
  const cartelle = [];
  for (let i = 0; i < quantita; i++) {
    cartelle.push(generaCartella());
  }
  
  // Stampa le cartelle
  for (let i = 0; i < cartelle.length; i++) {
    console.log(formattaCartella(cartelle[i], i + 1));
  }
  
  console.log(`Generazione completata! Sono state create ${quantita} cartelle.`);
  console.log(`Per stampare le cartelle, puoi copiare l'output o salvarlo in un file.`);
}

// Numero di cartelle da generare (puoi modificare questo valore)
const numeroDiCartelle = 5;
generaCartelle(numeroDiCartelle);
