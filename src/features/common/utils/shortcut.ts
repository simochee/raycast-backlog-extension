import type { Keyboard } from "@raycast/api";

export const indexToShortcut = (
  index: number,
  modifiers: Array<Keyboard.KeyModifier> = [],
): Keyboard.Shortcut | undefined => {
  if (index > 9) return;

  const key = `${index + (1 % 10)}`;

  switch (key) {
    case "1":
    case "2":
    case "3":
    case "4":
    case "5":
    case "6":
    case "7":
    case "8":
    case "9":
    case "0":
      return { key, modifiers };
  }
};
