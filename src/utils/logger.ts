const PREFIX = "[remove-item]";

let isQuiet = false;

export function setQuiet(quiet: boolean): void {
  isQuiet = quiet;
}

export function log(message: string): void {
  if (!isQuiet) {
    console.log(`${PREFIX} ${message}`);
  }
}

export function warn(message: string): void {
  if (!isQuiet) {
    console.warn(`${PREFIX} ${message}`);
  }
}

export function error(message: string): void {
  console.error(`${PREFIX} ${message}`);
}

export function verbose(message: string, isVerbose: boolean, quiet?: boolean): void {
  if (isVerbose && !(quiet ?? isQuiet)) {
    log(message);
  }
}
