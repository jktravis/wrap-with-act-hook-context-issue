/* eslint-disable
@typescript-eslint/no-angle-bracket-type-assertion,
@typescript-eslint/no-inferrable-types,
@typescript-eslint/no-namespace,
*/
/* global
Main,
*/
export namespace langParts {
  export function getLangParts(currentLang = ""): string[] {
    let langInParts: string[] = [];
    if (currentLang && currentLang.length > 0) {
      langInParts = currentLang.split("-");
    } else if (Main.currentLang && Main.currentLang.length > 0) {
      langInParts = Main.currentLang.split("-");
    } else {
      langInParts[0] = "en";
      langInParts[1] = "US";
    }
    return langInParts;
  }
}
