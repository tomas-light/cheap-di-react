import { Logger } from './Logger';

export class ConsoleLogger extends Logger {
  prefix: string;

  constructor(prefix: string) {
    super();
    this.prefix = prefix;
  }

  debug(message: string) {
    console.log(`${this.prefix}: ${message}`);
  }
}
