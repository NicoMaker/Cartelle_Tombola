### Tombola Generator - Guida Completa

## Descrizione del Progetto

Questo progetto è un'applicazione web per generare e stampare cartelle della tombola italiana. Ogni Giocatori di 6 cartelle contiene tutti i numeri da 1 a 90, distribuiti secondo le regole tradizionali della tombola (3 righe e 9 colonne per cartella, con 5 numeri per riga).

## Requisiti di sistema

- Node.js (versione 14.x o superiore)
- npm (incluso con Node.js)
- Un browser web moderno (Chrome, Firefox, Safari, Edge)

## Installazione

Segui questi passaggi per installare e avviare l'applicazione:

1. **Clona il repository**

```shellscript
git clone https://github.com/tuonome/tombola-generator.git
cd tombola-generator
```

2. **Installa le dipendenze**

```shellscript
npm install
```

3. **Avvia l'applicazione**

```shellscript
npm start
```

4. **Accedi all'applicazione**

Apri il tuo browser e vai all'indirizzo:

```plaintext
http://localhost:3000
```

## Struttura del Progetto

### File principali

- `server.js` - Server Express che gestisce le richieste API
- `public/index.html` - Interfaccia utente principale
- `public/script.js` - Logica frontend per l'interazione con l'utente
- `public/styles.css` - Stili CSS per l'interfaccia utente
- `tombola-generator.js` - Modulo principale per la generazione delle cartelle

### Struttura della pagina index.html

La pagina index.html è strutturata in diverse sezioni per facilitare l'interazione dell'utente:

1. **Header (`app-header`)**

1. Logo dell'applicazione
1. Titolo principale "Generatore Cartelle Tombola"
1. Sottotitolo descrittivo

1. **Pannello di controllo (`control-panel`)**

1. Card con le impostazioni
1. Selettore per il numero di Giocatori da generare
1. Pulsanti per aumentare/diminuire il numero di Giocatori
1. Pulsante "Genera Cartelle" per avviare la generazione
1. Pulsante "Stampa Cartelle" per stampare le cartelle generate

1. **Area di caricamento (`loading-container`)**

1. Spinner di caricamento durante la generazione delle cartelle
1. Messaggio "Generazione in corso..."

1. **Contenitore delle cartelle (`cards-container`)**

1. Area dove vengono visualizzate le cartelle generate
1. Organizzata in Giocatori, con ogni Giocatori contenente 6 cartelle
1. Ogni Giocatori ha un titolo con il numero del Giocatori

1. **Sistema di alert (`alert-container`)**

1. Mostra messaggi di successo, errore, avviso o informazione
1. Gli alert si chiudono automaticamente dopo alcuni secondi

1. **Modal informativo**

1. Accessibile tramite il link "Informazioni" nel footer
1. Contiene dettagli sul funzionamento dell'applicazione

1. **Footer (`app-footer`)**

1. Copyright e link alle informazioni

## Guida all'Utilizzo dell'Interfaccia

### 1. Pannello di Controllo

Quando apri l'applicazione, vedrai il pannello di controllo nella parte superiore della pagina:

- **Numero di Giocatori da generare**: Puoi impostare quanti Giocatori di cartelle vuoi generare (da 1 a 501)

- Usa i pulsanti `-` e `+` per diminuire o aumentare il numero
- Oppure inserisci direttamente il numero nell'input

- **Pulsante "Genera Cartelle"**: Cliccando su questo pulsante, l'applicazione inizierà a generare i Giocatori di cartelle richiesti

- Durante la generazione, vedrai un indicatore di caricamento

- **Pulsante "Stampa Cartelle"**: Questo pulsante sarà attivo solo dopo che le cartelle sono state generate

- Cliccando su di esso, si aprirà la finestra di dialogo di stampa del browser

### 2. Visualizzazione delle Cartelle Generate

Dopo aver cliccato su "Genera Cartelle" e completato la generazione, le cartelle appariranno nella parte inferiore della pagina:

- **Organizzazione in Giocatori**: Le cartelle sono organizzate in Giocatori, con ogni Giocatori contenente 6 cartelle

- Ogni Giocatori ha un titolo "Giocatori #X" dove X è il numero del Giocatori
- I Giocatori sono separati visivamente per facilitare la navigazione

- **Visualizzazione delle Cartelle**: Ogni cartella mostra:

- Un'intestazione con il numero della cartella
- Una griglia 3x9 con i numeri della tombola
- Le celle vuote rappresentano spazi senza numeri
- Le celle con numeri hanno uno sfondo leggermente colorato

### 3. Stampa delle Cartelle

Quando clicchi sul pulsante "Stampa Cartelle":

- Si aprirà la finestra di dialogo di stampa del browser
- Le cartelle sono formattate specificamente per la stampa:

- 2 cartelle per riga
- Ogni Giocatori inizia su una nuova pagina
- L'intestazione "CARTELLE TOMBOLA" appare all'inizio della stampa
- I colori e i bordi sono ottimizzati per la stampa

### 4. Sistema di Alert

L'applicazione ti fornisce feedback attraverso alert che appaiono nell'angolo in alto a destra:

- **Alert di successo** (verde): Conferma che un'operazione è stata completata con successo
- **Alert di errore** (rosso): Indica che si è verificato un problema
- **Alert di avviso** (giallo): Fornisce avvertimenti
- **Alert informativi** (blu): Fornisce informazioni generali

Gli alert si chiudono automaticamente dopo alcuni secondi, oppure puoi chiuderli manualmente cliccando sulla X.

### 5. Modal Informativo

Cliccando sul link "Informazioni" nel footer, si aprirà un modal con dettagli sul funzionamento dell'applicazione:

- Spiegazione delle regole della tombola
- Istruzioni su come utilizzare l'applicazione
- Informazioni sulle cartelle generate

Puoi chiudere il modal cliccando sul pulsante "Chiudi", sulla X nell'angolo in alto a destra, o cliccando all'esterno del modal.

## Funzionamento Tecnico

### Generazione delle Cartelle

Il processo di generazione delle cartelle avviene in questi passaggi:

1. Quando clicchi su "Genera Cartelle", l'applicazione invia una richiesta POST all'endpoint `/api/generate` con il numero di Giocatori richiesti
2. Il server utilizza l'algoritmo in `tombola-generator.js` per generare i Giocatori di cartelle
3. L'algoritmo:

4. Crea un array con tutti i numeri da 1 a 90
5. Mescola i numeri in modo casuale
6. Divide i numeri in 9 colonne secondo le regole della tombola
7. Distribuisce i numeri nelle 6 cartelle di ogni Giocatori
8. Assicura che ogni riga abbia esattamente 5 numeri
9. Formatta le cartelle per la risposta

10. Il server risponde con i dati delle cartelle generate
11. Il frontend visualizza le cartelle nella pagina

### Struttura di una Cartella

Ogni cartella è rappresentata come una griglia 3x9:

- 3 righe orizzontali
- 9 colonne verticali
- Ogni riga contiene esattamente 5 numeri e 4 spazi vuoti
- I numeri sono posizionati nelle colonne appropriate:

- Colonna 1: numeri da 1 a 9
- Colonna 2: numeri da 10 a 19
- E così via fino alla colonna 9: numeri da 80 a 90

### Stampa delle Cartelle

La funzionalità di stampa utilizza i CSS media queries per ottimizzare il layout per la stampa:

- Nasconde elementi non necessari (header, footer, pulsanti)
- Ridimensiona le cartelle per adattarle alla pagina
- Aggiunge interruzioni di pagina tra i Giocatori
- Mantiene i colori e i bordi per una migliore leggibilità

## Risoluzione dei Problemi Comuni

### L'applicazione non si avvia

- Verifica che Node.js sia installato correttamente (`node -v`)
- Assicurati di aver installato tutte le dipendenze (`npm install`)
- Controlla che la porta 3000 non sia già in uso da un'altra applicazione

### Le cartelle non vengono generate

- Verifica che il numero di Giocatori sia valido (tra 1 e 501)
- Controlla la console del browser per eventuali errori JavaScript
- Verifica che il server sia in esecuzione

### Problemi di stampa

- Assicurati che le cartelle siano state generate prima di tentare la stampa
- Nelle impostazioni di stampa, assicurati che l'opzione "Grafica di sfondo" sia abilitata
- Prova a utilizzare un browser diverso se riscontri problemi

## Sviluppo e Personalizzazione

Per avviare l'applicazione in modalità sviluppo con ricaricamento automatico:

```shellscript
npm run dev
```

### Personalizzazione dell'Aspetto

Puoi personalizzare l'aspetto dell'applicazione modificando il file `styles.css`. Le principali variabili CSS sono definite all'inizio del file:

```css
:root {
  --primary-color: #e53935;
  --primary-dark: #c62828;
  --primary-light: #ffcdd2;
  --secondary-color: #2196f3;
  /* altre variabili... */
}
```

### Estensione delle Funzionalità

Per aggiungere nuove funzionalità, puoi modificare:

- `script.js` per la logica frontend
- `server.js` per aggiungere nuovi endpoint API
- `tombola-generator.js` per modificare l'algoritmo di generazione

## Conclusione

Questa applicazione ti permette di generare e stampare facilmente cartelle per la tombola italiana. Seguendo questa guida, dovresti essere in grado di installare, utilizzare e personalizzare l'applicazione secondo le tue esigenze.

Buon divertimento con la tua tombola! 🎮 🎲
