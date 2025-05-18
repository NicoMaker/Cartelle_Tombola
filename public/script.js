document.addEventListener("DOMContentLoaded", () => {
  // Elementi DOM
  const numGiocatoriInput = document.getElementById("numGiocatori")
  const decreaseBtn = document.querySelector(".decrease")
  const increaseBtn = document.querySelector(".increase")
  const generateBtn = document.getElementById("generateBtn")
  const printBtn = document.getElementById("printBtn")
  const loadingEl = document.getElementById("loading")
  const cardsContainer = document.getElementById("cardsContainer")
  const aboutLink = document.getElementById("aboutLink")
  const modalContainer = document.getElementById("modalContainer")
  const modalCloseBtn = document.querySelector(".modal-close-btn")
  const modalCloseX = document.querySelector(".modal-close")

  // Event listeners
  generateBtn.addEventListener("click", generateCards)
  printBtn.addEventListener("click", () => window.print())
  decreaseBtn.addEventListener("click", () => updateNumGiocatori(-1))
  increaseBtn.addEventListener("click", () => updateNumGiocatori(1))
  aboutLink.addEventListener("click", showModal)
  modalCloseBtn.addEventListener("click", hideModal)
  modalCloseX.addEventListener("click", hideModal)
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) hideModal()
  })

  // Sistema di alert
  const alertContainer = document.getElementById("alertContainer")
  const alertTemplate = document.getElementById("alertTemplate")

  /**
   * Mostra un alert
   * @param {string} type - Tipo di alert (success, error, warning, info)
   * @param {string} title - Titolo dell'alert
   * @param {string} message - Messaggio dell'alert
   * @param {number} duration - Durata in millisecondi (0 per non chiudere automaticamente)
   */
  function showAlert(type, title, message, duration = 5000) {
    const alert = alertTemplate.content.cloneNode(true).querySelector(".alert")
    alert.classList.add(`alert-${type}`)

    const iconElement = alert.querySelector(".alert-icon")
    const titleElement = alert.querySelector(".alert-title")
    const messageElement = alert.querySelector(".alert-message")
    const closeButton = alert.querySelector(".alert-close")

    // Imposta l'icona in base al tipo
    let icon
    switch (type) {
      case "success":
        icon = "fa-check-circle"
        break
      case "error":
        icon = "fa-exclamation-circle"
        break
      case "warning":
        icon = "fa-exclamation-triangle"
        break
      case "info":
      default:
        icon = "fa-info-circle"
    }

    iconElement.innerHTML = `<i class="fas ${icon}"></i>`
    titleElement.textContent = title
    messageElement.textContent = message

    // Aggiungi l'alert al container
    alertContainer.appendChild(alert)

    // Gestisci la chiusura
    const closeAlert = () => {
      alert.classList.add("closing")
      setTimeout(() => {
        alert.remove()
      }, 300)
    }

    closeButton.addEventListener("click", closeAlert)

    // Chiudi automaticamente dopo la durata specificata
    if (duration > 0) {
      setTimeout(closeAlert, duration)
    }

    return alert
  }

  /**
   * Aggiorna il valore del numero di giocatori
   * @param {number} delta - Valore da aggiungere/sottrarre
   */
  function updateNumGiocatori(delta) {
    const currentValue = Number.parseInt(numGiocatoriInput.value) || 1
    const newValue = Math.max(1, Math.min(501, currentValue + delta))
    numGiocatoriInput.value = newValue
  }

  /**
   * Mostra il modal informativo
   */
  function showModal(e) {
    if (e) e.preventDefault()
    modalContainer.classList.remove("hidden")
    setTimeout(() => {
      modalContainer.classList.add("visible")
    }, 10)
  }

  /**
   * Nasconde il modal
   */
  function hideModal() {
    modalContainer.classList.remove("visible")
    setTimeout(() => {
      modalContainer.classList.add("hidden")
    }, 300)
  }

  /**
   * Genera le cartelle della tombola
   */
  async function generateCards() {
    const numGiocatori = Number.parseInt(numGiocatoriInput.value)

    if (numGiocatori < 1 || numGiocatori > 501) {
      showAlert("error", "Errore", "Inserisci un numero di giocatori valido (1-501)")
      return
    }

    // Mostra il loading
    loadingEl.classList.remove("hidden")
    cardsContainer.innerHTML = ""
    printBtn.disabled = true

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ numGiocatori }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Errore nella generazione delle cartelle")
      }

      // Visualizza le cartelle
      renderCards(data.giocatori)

      // Abilita il pulsante di stampa
      printBtn.disabled = false

      // Mostra un alert di successo
      showAlert("success", "Generazione completata", `Sono stati generati ${numGiocatori} giocatori di cartelle.`)

      // Scorri fino alle cartelle
      setTimeout(() => {
        cardsContainer.scrollIntoView({ behavior: "smooth" })
      }, 500)
    } catch (error) {
      console.error("Errore:", error)
      showAlert("error", "Errore", `Si è verificato un errore: ${error.message}`)
    } finally {
      // Nascondi il loading
      loadingEl.classList.add("hidden")
    }
  }

  /**
   * Visualizza le cartelle generate
   * @param {Array} giocatori - Array di giocatore di cartelle
   */
  function renderCards(giocatori) {
    cardsContainer.innerHTML = ""

    // Aggiungi l'intestazione principale per la stampa
    const printHeader = document.createElement("div")

    giocatori.forEach((giocatore) => {
      // Crea un contenitore per il giocatore
      const setContainer = document.createElement("div")
      setContainer.className = "card-giocatore"
      setContainer.setAttribute("data-giocatore", giocatore[0].setNumber)

      // Titolo del giocatore
      const setTitle = document.createElement("h2")
      setTitle.className = "giocatore-title"
      setTitle.innerHTML = `<i class="fas fa-folder"></i> Giocatore #${giocatore[0].setNumber}`
      setContainer.appendChild(setTitle)

      // Contenitore per le cartelle del giocatore (griglia)
      const cardsGrid = document.createElement("div")
      cardsGrid.className = "cards-grid"

      // Stile per la visualizzazione normale (non in stampa)
      cardsGrid.style.display = "grid"
      cardsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))"
      cardsGrid.style.gap = "15px"

      // Crea le cartelle del giocatore
      giocatore.forEach((card) => {
        const cardElement = createCardElement(card)
        cardsGrid.appendChild(cardElement)
      })

      setContainer.appendChild(cardsGrid)
      cardsContainer.appendChild(setContainer)
    })

    // Mostra l'intestazione di stampa solo quando si stampa
    window.addEventListener("beforeprint", () => {
      printHeader.style.display = "block"
    })

    window.addEventListener("afterprint", () => {
      printHeader.style.display = "none"
    })
  }

  /**
   * Crea l'elemento HTML per una cartella
   * @param {Object} card - Dati della cartella
   * @returns {HTMLElement} Elemento della cartella
   */
  function createCardElement(card) {
    const cardElement = document.createElement("div")
    cardElement.className = "tombola-card"
    cardElement.setAttribute("data-card-id", card.id)
    cardElement.setAttribute("data-giocatore", card.setNumber)

    // Header della cartella
    const cardHeader = document.createElement("div")
    cardHeader.className = "card-header"
    cardHeader.textContent = `Cartella #${card.id}`
    cardElement.appendChild(cardHeader)

    // Griglia della cartella
    const table = document.createElement("table")
    table.className = "card-grid"

    const tbody = document.createElement("tbody")

    // Crea le righe della cartella
    for (let row = 0; row < 3; row++) {
      const tr = document.createElement("tr")

      // Crea le celle della riga
      for (let col = 0; col < 9; col++) {
        const td = document.createElement("td")
        const value = card.grid[row][col]

        if (value !== null) {
          td.textContent = value
          td.className = "filled"
        }

        tr.appendChild(td)
      }

      tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    cardElement.appendChild(table)

    return cardElement
  }

  // Mostra un alert di benvenuto
  setTimeout(() => {
    showAlert(
      "info",
      "Benvenuto",
      "Genera facilmente cartelle per la tua tombola. Seleziona il numero di giocatori e clicca su Genera."
    )
  }, 500)

  // Aggiorna il testo della descrizione
  const descriptionText = document.querySelector(".form-group small")
  if (descriptionText) {
    descriptionText.textContent = "Ogni giocatore contiene 6 cartelle con tutti i numeri da 1 a 90"
  }
})
