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
  const sumcartelle = 600 // Aumentato a 600 il limite massimo

  // Imposta l'attributo max sull'input
  const inputGiocatori = document.getElementById("numGiocatori")
  inputGiocatori.max = sumcartelle

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

    if (numGiocatori < 1 || numGiocatori > sumcartelle) {
      showAlert("error", "Errore", `Inserisci un numero di giocatori valido (1-${sumcartelle})`)
      return
    }

    // Mostra il loading
    loadingEl.classList.remove("hidden")
    cardsContainer.innerHTML = ""
    printBtn.disabled = true
    progressBar.style.width = "0%"

    try {
      // Aggiorna il messaggio di caricamento
      const loadingMessage = loadingEl.querySelector("p")
      loadingMessage.textContent =
        "Generazione in corso... Questo potrebbe richiedere alcuni secondi per grandi volumi."

      // Inizia a misurare il tempo
      const startTime = performance.now()

      // Aggiorna la barra di progresso (simulazione)
      let progress = 0
      const progressInterval = setInterval(() => {
        progress += 1
        if (progress <= 90) {
          progressBar.style.width = `${progress}%`
        }
      }, 50)

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

      // Completa la barra di progresso
      clearInterval(progressInterval)
      progressBar.style.width = "100%"

      // Calcola il tempo impiegato
      const endTime = performance.now()
      const timeElapsed = ((endTime - startTime) / 1000).toFixed(2)

      // Visualizza le cartelle in modo ottimizzato
      await renderCardsOptimized(data.giocatori)

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
    cardsContainer.innerHTML = ""

    // Crea la pagina di copertina per la stampa
    const printCoverPage = createPrintCoverPage()
    cardsContainer.appendChild(printCoverPage)


    // Renderizza i giocatori in batch per evitare di bloccare l'interfaccia
    const batchSize = 10 // Numero di giocatori da renderizzare per batch
    const totalBatches = Math.ceil(giocatori.length / batchSize)

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      // Aggiorna il messaggio di caricamento
      loadingEl.querySelector("p").textContent =
        `Rendering in corso... ${Math.min((batchIndex + 1) * batchSize, giocatori.length)}/${giocatori.length} giocatori`

      // Aggiorna la barra di progresso
      progressBar.style.width = `${Math.min((((batchIndex + 1) * batchSize) / giocatori.length) * 100, 100)}%`

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
    }

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

  // Modifica la funzione createPrintCoverPage per includere tutte le regole
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

    // Sezione: Preparazione
    const prepSection = document.createElement("div")
    prepSection.className = "print-cover-section"

    const prepTitle = document.createElement("h3")
    prepTitle.textContent = "Preparazione"
    prepSection.appendChild(prepTitle)

    const prepList = document.createElement("ol")

    const prep1 = document.createElement("li")
    prep1.textContent = "Distribuire le cartelle ai giocatori."
    prepList.appendChild(prep1)

    const prep2 = document.createElement("li")
    prep2.textContent = 'Nominare un "banditore" che sarà responsabile dell\'estrazione dei numeri.'
    prepList.appendChild(prep2)

    const prep3 = document.createElement("li")
    prep3.textContent = "Stabilire i premi per le diverse combinazioni vincenti."
    prepList.appendChild(prep3)

    prepSection.appendChild(prepList)
    rulesContainer.appendChild(prepSection)

    // Sezione: Svolgimento del Gioco
    const gameplaySection = document.createElement("div")
    gameplaySection.className = "print-cover-section"

    const gameplayTitle = document.createElement("h3")
    gameplayTitle.textContent = "Svolgimento del Gioco"
    gameplaySection.appendChild(gameplayTitle)

    const gameplayList = document.createElement("ol")

    const gameplay1 = document.createElement("li")
    gameplay1.textContent = "Il banditore estrae un numero alla volta dal sacchetto e lo annuncia ad alta voce."
    gameplayList.appendChild(gameplay1)

    const gameplay2 = document.createElement("li")
    gameplay2.textContent = "I giocatori controllano se il numero estratto è presente nelle loro cartelle."
    gameplayList.appendChild(gameplay2)

    const gameplay3 = document.createElement("li")
    gameplay3.textContent =
      "Se un giocatore trova il numero estratto su una delle sue cartelle, lo marca con un segnalino."
    gameplayList.appendChild(gameplay3)

    const gameplay4 = document.createElement("li")
    gameplay4.textContent = "Il gioco continua fino a quando non vengono assegnati tutti i premi."
    gameplayList.appendChild(gameplay4)

    gameplaySection.appendChild(gameplayList)
    rulesContainer.appendChild(gameplaySection)

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

    // Sezione: Suggerimenti per la Stampa
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

  // Aggiorna il testo della descrizione
  const descriptionText = document.querySelector(".form-group small")
  if (descriptionText) {
    descriptionText.textContent = "Ogni giocatore contiene 6 cartelle con tutti i numeri da 1 a 90"
  }

  // Aggiungi effetti di animazione alle cartelle quando vengono generate
  const addCardAnimations = () => {
    const cards = document.querySelectorAll(".tombola-card")
    cards.forEach((card, index) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(20px)"
      setTimeout(() => {
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease"
        card.style.opacity = "1"
        card.style.transform = "translateY(0)"
      }, index * 50)
    })
  }

  // Aggiungi stili CSS per l'ottimizzazione della stampa
  const addPrintStyles = () => {
    const styleElement = document.createElement("style")
    styleElement.textContent = `
      @media print {
        body.printing .app-content {
          padding: 0 !important;
          margin: 0 !important;
        }
        
        body.printing .card-giocatore {
          page-break-before: always !important;
          break-before: page !important;
        }
        
        body.printing .card-giocatore:first-child {
          page-break-before: auto !important;
          break-before: auto !important;
        }
        
        body.printing .cards-grid {
          display: grid !important;
          grid-template-columns: repeat(2, 1fr) !important;
          gap: 15px !important;
          width: 100% !important;
        }
        
        body.printing .tombola-card {
          width: 100% !important;
          margin-bottom: 15px !important;
        }
      }
    `
    document.head.appendChild(styleElement)
  }

  // Aggiungi gli stili di stampa
  addPrintStyles()
})
