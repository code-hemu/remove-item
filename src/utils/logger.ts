const PREFIX = "[remove-item]";

export function log(message: string): void {
  console.log(`${PREFIX} ${message}`);
}

export function warn(message: string): void {
  console.warn(`${PREFIX} ${message}`);
}

export function error(message: string): void {
  console.error(`${PREFIX} ${message}`);
}

export function verbose(message: string, isVerbose: boolean): void {
  if (isVerbose) {
    log(message);
  }
}
