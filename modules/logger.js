/**
 * Modulo per il logging
 */

/**
 * Semplice logger per l'applicazione
 */
export const logger = {
  /**
   * Log informativo
   * @param {string} message - Messaggio da loggare
   */
  info: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`[INFO] ${timestamp} - ${message}`);
  },
  
  /**
   * Log di errore
   * @param {string} message - Messaggio di errore
   */
  error: (message) => {
    const timestamp = new Date().toISOString();
    console.error(`[ERROR] ${timestamp} - ${message}`);
  },
  
  /**
   * Log di avviso
   * @param {string} message - Messaggio di avviso
   */
  warn: (message) => {
    const timestamp = new Date().toISOString();
    console.warn(`[WARN] ${timestamp} - ${message}`);
  },
  
  /**
   * Log di debug
   * @param {string} message - Messaggio di debug
   */
  debug: (message) => {
    if (process.env.DEBUG) {
      const timestamp = new Date().toISOString();
      console.debug(`[DEBUG] ${timestamp} - ${message}`);
    }
  }
};
