class Logger {
  constructor() {
    if (!Logger.instance) {
      Logger.instance = this;
    }
    return Logger.instance;
  }
  log(level, message, metaData = {}) {
    let messageobj = {
      level: level,
      message: message,
      timestamp: new Date(),
      metaData: metaData,
    };
    console.log(JSON.stringify(messageobj));
  }
  error(message, metaData = {}) {
    this.log("error", message, metaData);
  }
  info(message, metaData = {}) {
    this.log("info", message, metaData);
  }
  debug(message, metaData = {}) {
    this.log("debug", message, metaData);
  }
}

export const logger = new Logger();
