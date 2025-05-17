document.addEventListener("DOMContentLoaded", () => {
  // Elementi DOM
  const numSetsInput = document.getElementById("numSets");
  const decreaseBtn = document.querySelector(".decrease");
  const increaseBtn = document.querySelector(".increase");
  const generateBtn = document.getElementById("generateBtn");
  const printBtn = document.getElementById("printBtn");
  const loadingEl = document.getElementById("loading");
  const cardsContainer = document.getElementById("cardsContainer");
  const aboutLink = document.getElementById("aboutLink");
  const modalContainer = document.getElementById("modalContainer");
  const modalCloseBtn = document.querySelector(".modal-close-btn");
  const modalCloseX = document.querySelector(".modal-close");

  // Event listeners
  generateBtn.addEventListener("click", generateCards);
  printBtn.addEventListener("click", () => window.print());
  decreaseBtn.addEventListener("click", () => updateNumSets(-1));
  increaseBtn.addEventListener("click", () => updateNumSets(1));
  aboutLink.addEventListener("click", showModal);
  modalCloseBtn.addEventListener("click", hideModal);
  modalCloseX.addEventListener("click", hideModal);
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) hideModal();
  });

  // Sistema di alert
  const alertContainer = document.getElementById("alertContainer");
  const alertTemplate = document.getElementById("alertTemplate");

  /**
   * Mostra un alert
   * @param {string} type - Tipo di alert (success, error, warning, info)
   * @param {string} title - Titolo dell'alert
   * @param {string} message - Messaggio dell'alert
   * @param {number} duration - Durata in millisecondi (0 per non chiudere automaticamente)
   */
  function showAlert(type, title, message, duration = 5000) {
    const alert = alertTemplate.content.cloneNode(true).querySelector(".alert");
    alert.classList.add(`alert-${type}`);

    const iconElement = alert.querySelector(".alert-icon");
    const titleElement = alert.querySelector(".alert-title");
    const messageElement = alert.querySelector(".alert-message");
    const closeButton = alert.querySelector(".alert-close");

    // Imposta l'icona in base al tipo
    let icon;
    switch (type) {
      case "success":
        icon = "fa-check-circle";
        break;
      case "error":
        icon = "fa-exclamation-circle";
        break;
      case "warning":
        icon = "fa-exclamation-triangle";
        break;
      case "info":
      default:
        icon = "fa-info-circle";
    }

    iconElement.innerHTML = `<i class="fas ${icon}"></i>`;
    titleElement.textContent = title;
    messageElement.textContent = message;

    // Aggiungi l'alert al container
    alertContainer.appendChild(alert);

    // Gestisci la chiusura
    const closeAlert = () => {
      alert.classList.add("closing");
      setTimeout(() => {
        alert.remove();
      }, 300);
    };

    closeButton.addEventListener("click", closeAlert);

    // Chiudi automaticamente dopo la durata specificata
    if (duration > 0) {
      setTimeout(closeAlert, duration);
    }

    return alert;
  }

  /**
   * Aggiorna il valore del numero di set
   * @param {number} delta - Valore da aggiungere/sottrarre
   */
  function updateNumSets(delta) {
    const currentValue = parseInt(numSetsInput.value) || 1;
    const newValue = Math.max(1, Math.min(25, currentValue + delta));
    numSetsInput.value = newValue;
  }

  /**
   * Mostra il modal informativo
   */
  function showModal(e) {
    if (e) e.preventDefault();
    modalContainer.classList.remove("hidden");
    setTimeout(() => {
      modalContainer.classList.add("visible");
    }, 10);
  }

  /**
   * Nasconde il modal
   */
  function hideModal() {
    modalContainer.classList.remove("visible");
    setTimeout(() => {
      modalContainer.classList.add("hidden");
    }, 300);
  }

  /**
   * Genera le cartelle della tombola
   */
  async function generateCards() {
    const numSets = Number.parseInt(numSetsInput.value);

    if (numSets < 1 || numSets > 27) {
      showAlert("error", "Errore", "Inserisci un numero di set valido (1-27)");
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

      // Mostra un alert di successo
      showAlert(
        "success",
        "Generazione completata",
        `Sono stati generati ${numSets} set di cartelle.`
      );

      // Scorri fino alle cartelle
      setTimeout(() => {
        cardsContainer.scrollIntoView({ behavior: "smooth" });
      }, 500);

    } catch (error) {
      console.error("Errore:", error);
      showAlert("error", "Errore", `Si è verificato un errore: ${error.message}`);
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
      setTitle.innerHTML = `<i class="fas fa-folder"></i> Set #${set[0].setNumber}`;
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

  // Mostra un alert di benvenuto
  setTimeout(() => {
    showAlert(
      "info",
      "Benvenuto",
      "Genera facilmente cartelle per la tua tombola. Seleziona il numero di set e clicca su Genera."
    );
  }, 500);
});

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
    setContainer.setAttribute("data-set", set[0].setNumber);

    // Titolo del set
    const setTitle = document.createElement("h2");
    setTitle.className = "set-title";
    setTitle.innerHTML = `<i class="fas fa-folder"></i> Set #${set[0].setNumber}`;
    setContainer.appendChild(setTitle);

    // Contenitore per le cartelle del set
    const cardsGrid = document.createElement("div");
    cardsGrid.className = "cards-grid";
    cardsGrid.style.display = "grid";
    cardsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
    cardsGrid.style.gap = "15px";

    // Crea le cartelle del set
    set.forEach((card) => {
      const cardElement = createCardElement(card);
      cardsGrid.appendChild(cardElement);
    });

    setContainer.appendChild(cardsGrid);
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
  cardElement.setAttribute("data-card-id", card.id);
  cardElement.setAttribute("data-set", card.setNumber);

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