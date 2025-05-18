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
   * Crea la pagina di copertina per la stampa con le regole
   * @returns {HTMLElement} Elemento della pagina di copertina
   */
  function createPrintCoverPage() {
    const coverPage = document.createElement("div")
    coverPage.className = "print-cover-page"
    coverPage.style.display = "none" // Nascondi nell'interfaccia normale

    // Titolo principale
    const mainTitle = document.createElement("h1")
    mainTitle.className = "print-cover-title"
    mainTitle.textContent = "CARTELLE TOMBOLA"
    coverPage.appendChild(mainTitle)

    // Logo/Icona
    const logoContainer = document.createElement("div")
    logoContainer.className = "print-cover-logo"
    logoContainer.innerHTML = '<i class="fas fa-dice"></i>'
    coverPage.appendChild(logoContainer)

    // Sottotitolo
    const subtitle = document.createElement("h2")
    subtitle.className = "print-cover-subtitle"
    subtitle.textContent = "Istruzioni e Regole del Gioco"
    coverPage.appendChild(subtitle)

    // Contenitore delle regole
    const rulesContainer = document.createElement("div")
    rulesContainer.className = "print-cover-rules"

    // Sezione: Contenuto delle cartelle
    const contentSection = document.createElement("div")
    contentSection.className = "print-cover-section"

    const contentTitle = document.createElement("h3")
    contentTitle.textContent = "Contenuto delle Cartelle"
    contentSection.appendChild(contentTitle)

    const contentText = document.createElement("p")
    contentText.innerHTML = `
      Ogni giocatore riceve un set di 6 cartelle. Ogni set contiene tutti i numeri da 1 a 90, 
      distribuiti in modo che ogni cartella abbia 15 numeri (5 numeri per riga). 
      Le cartelle sono numerate progressivamente e raggruppate per giocatore.
    `
    contentSection.appendChild(contentText)
    rulesContainer.appendChild(contentSection)

    // Sezione: Come si gioca
    const howToPlaySection = document.createElement("div")
    howToPlaySection.className = "print-cover-section"

    const howToPlayTitle = document.createElement("h3")
    howToPlayTitle.textContent = "Come si Gioca"
    howToPlaySection.appendChild(howToPlayTitle)

    const howToPlayText = document.createElement("p")
    howToPlayText.innerHTML = `
      Il conduttore estrae a sorte i numeri da 1 a 90, uno alla volta. I giocatori controllano 
      se il numero estratto è presente nelle loro cartelle e lo segnano. Vince chi per primo realizza 
      una delle seguenti combinazioni:
    `
    howToPlaySection.appendChild(howToPlayText)

    const combinationsList = document.createElement("ul")

    const amboItem = document.createElement("li")
    amboItem.textContent = "Ambo: 2 numeri sulla stessa riga"
    combinationsList.appendChild(amboItem)

    const ternoItem = document.createElement("li")
    ternoItem.textContent = "Terno: 3 numeri sulla stessa riga"
    combinationsList.appendChild(ternoItem)

    const quaternaItem = document.createElement("li")
    quaternaItem.textContent = "Quaterna: 4 numeri sulla stessa riga"
    combinationsList.appendChild(quaternaItem)

    const cinquinaItem = document.createElement("li")
    cinquinaItem.textContent = "Cinquina: 5 numeri sulla stessa riga (riga completa)"
    combinationsList.appendChild(cinquinaItem)

    const tombolaItem = document.createElement("li")
    tombolaItem.textContent = "Tombola: tutti i 15 numeri di una cartella"
    combinationsList.appendChild(tombolaItem)

    howToPlaySection.appendChild(combinationsList)
    rulesContainer.appendChild(howToPlaySection)

    // Sezione: Suggerimenti per la stampa
    const printTipsSection = document.createElement("div")
    printTipsSection.className = "print-cover-section"

    const printTipsTitle = document.createElement("h3")
    printTipsTitle.textContent = "Suggerimenti per la Stampa"
    printTipsSection.appendChild(printTipsTitle)

    const printTipsList = document.createElement("ul")

    const tip1 = document.createElement("li")
    tip1.textContent = "Stampa in formato A4 per una migliore leggibilità"
    printTipsList.appendChild(tip1)

    const tip2 = document.createElement("li")
    tip2.textContent = "Ogni giocatore inizia su una nuova pagina"
    printTipsList.appendChild(tip2)

    const tip3 = document.createElement("li")
    tip3.textContent = "Utilizza carta di buona qualità per una maggiore durata"
    printTipsList.appendChild(tip3)

    const tip4 = document.createElement("li")
    tip4.textContent = "Consigliato l'uso di pennarelli o segnalini per marcare i numeri estratti"
    printTipsList.appendChild(tip4)

    printTipsSection.appendChild(printTipsList)
    rulesContainer.appendChild(printTipsSection)

    // Nota a piè di pagina
    const footer = document.createElement("div")
    footer.className = "print-cover-footer"
    footer.innerHTML = `
      <p>Generato con il Generatore di Cartelle Tombola - ${new Date().toLocaleDateString()}</p>
    `
    rulesContainer.appendChild(footer)

    coverPage.appendChild(rulesContainer)
    return coverPage
  }

  /**
   * Visualizza le cartelle generate
   * @param {Array} giocatori - Array di giocatore di cartelle
   */
  function renderCards(giocatori) {
    cardsContainer.innerHTML = ""

    // Crea la pagina di copertina per la stampa
    const printCoverPage = createPrintCoverPage()
    cardsContainer.appendChild(printCoverPage)

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

    // Mostra la copertina e l'intestazione solo quando si stampa
    window.addEventListener("beforeprint", () => {
      printCoverPage.style.display = "block"
      printHeader.style.display = "block"
    })

    window.addEventListener("afterprint", () => {
      printCoverPage.style.display = "none"
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
