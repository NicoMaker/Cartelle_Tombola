document.addEventListener("DOMContentLoaded", () => {
  // Elementi DOM
  const numSetsInput = document.getElementById("numSets");
  const generateBtn = document.getElementById("generateBtn");
  const printBtn = document.getElementById("printBtn");
  const loadingEl = document.getElementById("loading");
  const cardsContainer = document.getElementById("cardsContainer");

  // Event listeners
  generateBtn.addEventListener("click", generateCards);
  printBtn.addEventListener("click", () => window.print());

  /**
   * Genera le cartelle della tombola
   */
  async function generateCards() {
    const numSets = Number.parseInt(numSetsInput.value);

    if (numSets < 1 || numSets > 25) {
      alert("Inserisci un numero di set valido (1-25)");
      return;
    }

    // Mostra il loading
    loadingEl.classList.remove("hidden");
    cardsContainer.innerHTML = "";
    printBtn.disabled = true;

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numSets }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Errore nella generazione delle cartelle");
      }

      // Visualizza le cartelle
      renderCards(data.sets);

      // Abilita il pulsante di stampa
      printBtn.disabled = false;
    } catch (error) {
      console.error("Errore:", error);
      alert(`Si è verificato un errore: ${error.message}`);
    } finally {
      // Nascondi il loading
      loadingEl.classList.add("hidden");
    }
  }

  /**
   * Visualizza le cartelle generate
   * @param {Array} sets - Array di set di cartelle
   */
  function renderCards(sets) {
    cardsContainer.innerHTML = "";

    sets.forEach((set) => {
      // Crea un contenitore per il set
      const setContainer = document.createElement("div");
      setContainer.className = "card-set";

      // Titolo del set
      const setTitle = document.createElement("h2");
      setTitle.className = "set-title";
      setTitle.textContent = `Set #${set[0].setNumber}`;
      setContainer.appendChild(setTitle);

      // Crea le cartelle del set
      set.forEach((card) => {
        const cardElement = createCardElement(card);
        setContainer.appendChild(cardElement);
      });

      cardsContainer.appendChild(setContainer);
    });
  }

  /**
   * Crea l'elemento HTML per una cartella
   * @param {Object} card - Dati della cartella
   * @returns {HTMLElement} Elemento della cartella
   */
  function createCardElement(card) {
    const cardElement = document.createElement("div");
    cardElement.className = "tombola-card";

    // Header della cartella
    const cardHeader = document.createElement("div");
    cardHeader.className = "card-header";
    cardHeader.textContent = `Cartella #${card.id}`;
    cardElement.appendChild(cardHeader);

    // Griglia della cartella
    const table = document.createElement("table");
    table.className = "card-grid";

    const tbody = document.createElement("tbody");

    // Crea le righe della cartella
    for (let row = 0; row < 3; row++) {
      const tr = document.createElement("tr");

      // Crea le celle della riga
      for (let col = 0; col < 9; col++) {
        const td = document.createElement("td");
        const value = card.grid[row][col];

        if (value !== null) {
          td.textContent = value;
          td.className = "filled";
        }

        tr.appendChild(td);
      }

      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    cardElement.appendChild(table);

    return cardElement;
  }
});