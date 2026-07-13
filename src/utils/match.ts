const GLOB_CHARS = /[*?[\]{}]/;

export function hasGlob(s: string): boolean {
  return GLOB_CHARS.test(s);
}

function globToRegex(pattern: string): RegExp {
  let regex = "";
  for (const ch of pattern) {
    if (ch === "*") {
      regex += "[^\\\\/]*";
    } else if (ch === "?") {
      regex += "[^\\\\/]";
    } else if (/[.+^${}()|\[\]\\]/.test(ch)) {
      regex += "\\" + ch;
    } else {
      regex += ch;
    }
  }
  return new RegExp(`^${regex}$`);
}

export function matchesGlob(name: string, pattern: string): boolean {
  return globToRegex(pattern).test(name);
}
