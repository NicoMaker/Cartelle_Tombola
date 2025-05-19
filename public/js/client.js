document.addEventListener("DOMContentLoaded", () => {
  // Elementi DOM
  const numGiocatoriInput = document.getElementById("numGiocatori")
  const decreaseBtn = document.querySelector(".decrease")
  const increaseBtn = document.querySelector(".increase")
  const generateBtn = document.getElementById("generateBtn")
  const printBtn = document.getElementById("printBtn")
  const loadingEl = document.getElementById("loading")
  const progressBar = document.getElementById("progressBar")
  const cardsContainer = document.getElementById("cardsContainer")
  const aboutLink = document.getElementById("aboutLink")
  const footerAboutLink = document.getElementById("footerAboutLink")
  const modalContainer = document.getElementById("modalContainer")
  const modalCloseBtn = document.querySelector(".modal-close-btn")
  const modalCloseX = document.querySelector(".modal-close")
  const navLinks = document.querySelectorAll(".app-nav a")
  const sections = document.querySelectorAll(".section-container")
  const sumcartelle = 600 // Limite massimo di cartelle

  // Elementi per il loader avanzato
  const progressPercentage = document.getElementById("progressPercentage")
  const progressCounter = document.getElementById("progressCounter")
  const loaderIcon = document.getElementById("loaderIcon")
  const loaderPhase = document.getElementById("loaderPhase")
  const loaderMessage = document.getElementById("loaderMessage")
  const progressFraction = document.getElementById("progressFraction")

  // Variabile globale per memorizzare l'ultima percentuale raggiunta
  let globalLastPercentage = 0

  // Imposta l'attributo max sull'input
  numGiocatoriInput.max = sumcartelle

  // Event listeners
  generateBtn.addEventListener("click", generateCards)
  printBtn.addEventListener("click", printCards)
  decreaseBtn.addEventListener("click", () => updateNumGiocatori(-1))
  increaseBtn.addEventListener("click", () => updateNumGiocatori(1))
  aboutLink.addEventListener("click", showModal)
  footerAboutLink.addEventListener("click", showModal)
  modalCloseBtn.addEventListener("click", hideModal)
  modalCloseX.addEventListener("click", hideModal)
  modalContainer.addEventListener("click", (e) => {
    if (e.target === modalContainer) hideModal()
  })

  // Gestione della navigazione
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (link.getAttribute("href").startsWith("#")) {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)

        // Aggiorna la classe active sui link
        navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")

        // Mostra la sezione corrispondente
        sections.forEach((section) => {
          section.classList.remove("active")
          if (section.id === targetId) {
            section.classList.add("active")
          }
        })
      }
    })
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
    const newValue = Math.max(1, Math.min(sumcartelle, currentValue + delta))
    numGiocatoriInput.value = newValue
  }

  /**
   * Aggiorna i marcatori della barra di progresso in base al numero totale di giocatori
   * @param {number} total - Numero totale di giocatori
   */
  function updateProgressMarkers(total) {
    const marker25 = document.getElementById("marker-25")
    const marker50 = document.getElementById("marker-50")
    const marker75 = document.getElementById("marker-75")
    const marker100 = document.getElementById("marker-100")

    // Calcola i valori per ogni quarto
    const quarter = Math.ceil(total / 4)
    const half = Math.ceil(total / 2)
    const threeQuarters = Math.ceil((total * 3) / 4)

    // Aggiorna i marcatori con i valori calcolati
    marker25.textContent = quarter.toString()
    marker50.textContent = half.toString()
    marker75.textContent = threeQuarters.toString()
    marker100.textContent = total.toString()
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
   * Aggiorna l'interfaccia del loader in base alla percentuale di completamento
   * @param {number} percentage - Percentuale di completamento (0-100)
   * @param {number} processed - Numero di giocatori processati
   * @param {number} total - Numero totale di giocatori
   * @param {string} phase - Fase corrente del processo
   */
  function updateLoader(percentage, processed, total, phase) {
    // Assicurati che la percentuale non diminuisca mai
    const safePercentage = Math.max(globalLastPercentage, percentage)
    globalLastPercentage = safePercentage

    // Aggiorna la percentuale
    progressPercentage.textContent = `${Math.round(safePercentage)}%`

    // Aggiorna il contatore
    progressCounter.textContent = `${processed}/${total} giocatori`

    // Aggiorna la frazione
    let fractionText = ""

    // Calcola i valori per ogni quarto
    const quarter = Math.ceil(total / 4)
    const half = Math.ceil(total / 2)
    const threeQuarters = Math.ceil((total * 3) / 4)

    // Determina in quale quarto siamo
    if (processed <= quarter) {
      fractionText = "1/4"
    } else if (processed <= half) {
      fractionText = "2/4"
    } else if (processed <= threeQuarters) {
      fractionText = "3/4"
    } else {
      fractionText = "4/4"
    }

    progressFraction.textContent = `${fractionText} completato`

    // Aggiorna la barra di progresso
    progressBar.style.width = `${safePercentage}%`

    // Aggiungi classi alla barra di progresso in base alla percentuale
    progressBar.classList.remove("quarter", "half", "three-quarters", "complete")
    if (safePercentage >= 100) {
      progressBar.classList.add("complete")
    } else if (safePercentage >= 75) {
      progressBar.classList.add("three-quarters")
    } else if (safePercentage >= 50) {
      progressBar.classList.add("half")
    } else if (safePercentage >= 25) {
      progressBar.classList.add("quarter")
    }

    // Aggiorna la fase
    loaderPhase.textContent = phase

    // Aggiorna il messaggio in base alla percentuale
    if (safePercentage < 25) {
      loaderMessage.textContent = "Inizializzazione della generazione delle cartelle..."
    } else if (safePercentage < 50) {
      loaderMessage.textContent = "Creazione struttura delle cartelle in corso..."
    } else if (safePercentage < 75) {
      loaderMessage.textContent = "Distribuzione dei numeri nelle cartelle..."
    } else {
      loaderMessage.textContent = "Finalizzazione e preparazione per la visualizzazione..."
    }

    // Cambia l'icona e lo stile della barra di progresso in base alla percentuale
    if (safePercentage < 33) {
      loaderIcon.innerHTML = '<i class="fas fa-cog fa-spin"></i>'
      progressBar.style.background = "var(--loader-initial)"
      progressPercentage.style.color = "var(--primary-color)"
    } else if (safePercentage < 66) {
      loaderIcon.innerHTML = '<i class="fas fa-dice"></i>'
      progressBar.style.background = "var(--loader-middle)"
      progressPercentage.style.color = "var(--warning-color)"
    } else {
      loaderIcon.innerHTML = '<i class="fas fa-check-circle"></i>'
      progressBar.style.background = "var(--loader-final)"
      progressPercentage.style.color = "var(--success-color)"
    }

    // Aggiungi animazione di completamento quando raggiunge il 100%
    if (safePercentage >= 100) {
      loadingEl.classList.add("loader-complete")
      loaderMessage.textContent = "Generazione completata con successo!"

      // Rimuovi la classe dopo l'animazione
      setTimeout(() => {
        loadingEl.classList.remove("loader-complete")
      }, 3000)
    } else {
      loadingEl.classList.remove("loader-complete")
    }
  }

  /**
   * Genera le cartelle della tombola
   */
  async function generateCards() {
    // Resetta la variabile globale per una nuova generazione
    globalLastPercentage = 0

    // Rimuovi la classe loader-complete se presente
    loadingEl.classList.remove("loader-complete")

    const numGiocatori = Number.parseInt(numGiocatoriInput.value)

    if (numGiocatori < 1 || numGiocatori > sumcartelle) {
      showAlert("error", "Errore", `Inserisci un numero di giocatori valido (1-${sumcartelle})`)
      return
    }

    // Aggiorna i marcatori della barra di progresso
    updateProgressMarkers(numGiocatori)

    // Mostra il loading
    loadingEl.classList.remove("hidden")
    cardsContainer.innerHTML = ""
    printBtn.disabled = true

    // Inizializza il loader
    updateLoader(0, 0, numGiocatori, "Inizializzazione")

    try {
      // Inizia a misurare il tempo
      const startTime = performance.now()

      // Chiamata all'API per generare le cartelle
      const response = await fetch(`/api/generate/${numGiocatori}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Errore durante la generazione delle cartelle")
      }

      const data = await response.json()
      const giocatori = data.giocatori

      // Simula il progresso durante il caricamento dei dati
      let processedGiocatori = 0
      const totalGiocatori = giocatori.length

      // Aggiorna il loader con il progresso
      for (let i = 0; i < totalGiocatori; i++) {
        processedGiocatori++
        const percentage = (processedGiocatori / totalGiocatori) * 50 // Arriva al 50%

        // Determina la fase attuale
        let currentPhase
        if (percentage < 25) {
          currentPhase = "Inizializzazione"
        } else {
          currentPhase = "Creazione struttura"
        }

        updateLoader(percentage, processedGiocatori, totalGiocatori, currentPhase)

        // Piccola pausa per rendere visibile l'animazione
        if (i % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 10))
        }
      }

      // Visualizza le cartelle in modo ottimizzato
      await renderCardsOptimized(giocatori)

      // Calcola il tempo impiegato
      const endTime = performance.now()
      const timeElapsed = ((endTime - startTime) / 1000).toFixed(2)

      // Abilita il pulsante di stampa
      printBtn.disabled = false

      // Mostra un alert di successo
      showAlert(
        "success",
        "Generazione completata",
        `Sono stati generati ${numGiocatori} giocatori di cartelle in ${timeElapsed} secondi.`,
      )

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
   * Renderizza le cartelle in modo ottimizzato per grandi volumi
   * @param {Array} giocatori - Array di giocatori di cartelle
   */
  async function renderCardsOptimized(giocatori) {
    // Rimuovi la classe loader-complete se presente
    loadingEl.classList.remove("loader-complete")

    // Aggiorna i marcatori della barra di progresso
    updateProgressMarkers(giocatori.length)

    cardsContainer.innerHTML = ""

    // Crea la pagina di copertina per la stampa
    const printCoverPage = createPrintCoverPage()
    cardsContainer.appendChild(printCoverPage)

    // Renderizza i giocatori in batch per evitare di bloccare l'interfaccia
    const batchSize = 10 // Numero di giocatori da renderizzare per batch
    const totalBatches = Math.ceil(giocatori.length / batchSize)
    let renderLastPercentage = globalLastPercentage // Usa la percentuale globale come punto di partenza

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      // Calcola la percentuale di rendering (dal 50% al 100%)
      const currentRenderPercentage = 50 + ((batchIndex + 1) / totalBatches) * 50

      // Assicurati che la percentuale non diminuisca mai
      const renderPercentage = Math.max(renderLastPercentage, currentRenderPercentage)
      renderLastPercentage = renderPercentage

      const processedCount = Math.min((batchIndex + 1) * batchSize, giocatori.length)

      // Aggiorna il loader con la fase di rendering
      updateLoader(renderPercentage, processedCount, giocatori.length, "Rendering cartelle")

      // Attendi il prossimo frame di animazione per mantenere l'interfaccia reattiva
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const start = batchIndex * batchSize
      const end = Math.min(start + batchSize, giocatori.length)
      const batch = giocatori.slice(start, end)

      // Renderizza il batch corrente
      batch.forEach((giocatore) => {
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

      // Piccola pausa per rendere visibile l'animazione
      if (batchIndex < totalBatches - 1) {
        await new Promise((resolve) => setTimeout(resolve, 20))
      }
    }

    // Aggiorna il loader al 100% al completamento
    updateLoader(100, giocatori.length, giocatori.length, "Completato")

    // Mostra la copertina solo quando si stampa
    window.addEventListener("beforeprint", () => {
      printCoverPage.style.display = "block"
    })

    window.addEventListener("afterprint", () => {
      printCoverPage.style.display = "none"
    })
  }

  /**
   * Stampa le cartelle in modo ottimizzato
   */
  function printCards() {
    // Mostra un alert informativo prima di iniziare la stampa
    showAlert(
      "info",
      "Preparazione stampa",
      "Preparazione della stampa in corso. Questo potrebbe richiedere alcuni secondi per grandi volumi.",
      3000,
    )

    // Breve ritardo per permettere all'alert di essere visualizzato
    setTimeout(() => {
      // Ottimizza per la stampa
      document.body.classList.add("printing")

      // Avvia la stampa
      window.print()

      // Ripristina dopo la stampa
      document.body.classList.remove("printing")
    }, 500)
  }

  /**
   * Crea la pagina di copertina per la stampa
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

    // Sezione: Introduzione
    const introSection = document.createElement("div")
    introSection.className = "print-cover-section"

    const introTitle = document.createElement("h3")
    introTitle.textContent = "Introduzione"
    introSection.appendChild(introTitle)

    const introText = document.createElement("p")
    introText.innerHTML = `
    La tombola è un gioco tradizionale italiano, particolarmente popolare durante le festività natalizie. 
    È un gioco di fortuna che coinvolge l'estrazione di numeri e la marcatura di cartelle.
  `
    introSection.appendChild(introText)
    rulesContainer.appendChild(introSection)

    // Sezione: Materiale di Gioco
    const materialsSection = document.createElement("div")
    materialsSection.className = "print-cover-section"

    const materialsTitle = document.createElement("h3")
    materialsTitle.textContent = "Materiale di Gioco"
    materialsSection.appendChild(materialsTitle)

    const materialsList = document.createElement("ul")

    const item1 = document.createElement("li")
    item1.innerHTML =
      "<strong>Cartelle:</strong> Ogni giocatore riceve un set di 6 cartelle. Ogni set contiene tutti i numeri da 1 a 90, distribuiti in modo che ogni cartella abbia 15 numeri (5 numeri per riga)."
    materialsList.appendChild(item1)

    const item2 = document.createElement("li")
    item2.innerHTML =
      "<strong>Tabellone:</strong> Un tabellone con i numeri da 1 a 90 per tenere traccia dei numeri estratti."
    materialsList.appendChild(item2)

    const item3 = document.createElement("li")
    item3.innerHTML =
      "<strong>Sacchetto con numeri:</strong> Un sacchetto contenente 90 numeri (da 1 a 90) per l'estrazione."
    materialsList.appendChild(item3)

    const item4 = document.createElement("li")
    item4.innerHTML =
      "<strong>Segnalini:</strong> Oggetti per marcare i numeri estratti sulle cartelle (fagioli, bottoni, ecc.)."
    materialsList.appendChild(item4)

    materialsSection.appendChild(materialsList)
    rulesContainer.appendChild(materialsSection)

    // Sezione: Combinazioni Vincenti
    const combinationsSection = document.createElement("div")
    combinationsSection.className = "print-cover-section"

    const combinationsTitle = document.createElement("h3")
    combinationsTitle.textContent = "Combinazioni Vincenti"
    combinationsSection.appendChild(combinationsTitle)

    const combinationsText = document.createElement("p")
    combinationsText.textContent = "Vince chi per primo realizza una delle seguenti combinazioni:"
    combinationsSection.appendChild(combinationsText)

    const combinationsList = document.createElement("ul")

    const amboItem = document.createElement("li")
    amboItem.innerHTML = "<strong>Ambo:</strong> 2 numeri sulla stessa riga"
    combinationsList.appendChild(amboItem)

    const ternoItem = document.createElement("li")
    ternoItem.innerHTML = "<strong>Terno:</strong> 3 numeri sulla stessa riga"
    combinationsList.appendChild(ternoItem)

    const quaternaItem = document.createElement("li")
    quaternaItem.innerHTML = "<strong>Quaterna:</strong> 4 numeri sulla stessa riga"
    combinationsList.appendChild(quaternaItem)

    const cinquinaItem = document.createElement("li")
    cinquinaItem.innerHTML = "<strong>Cinquina:</strong> 5 numeri sulla stessa riga (riga completa)"
    combinationsList.appendChild(cinquinaItem)

    const tombolaItem = document.createElement("li")
    tombolaItem.innerHTML = "<strong>Tombola:</strong> tutti i 15 numeri di una cartella"
    combinationsList.appendChild(tombolaItem)

    combinationsSection.appendChild(combinationsList)
    rulesContainer.appendChild(combinationsSection)

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
      `Genera facilmente cartelle per la tua tombola. Seleziona il numero di giocatori (fino a ${sumcartelle}) e clicca su Genera.`,
    )
  }, 500)
})
