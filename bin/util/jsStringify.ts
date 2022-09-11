// This functionality is meant for object literals as a JS-version of JSON.stringify
interface Options {
  wrapping: number;
  tabWidth: number;
  trailingComma: boolean;
  replacer: (obj: unknown, level?: number, curLength?: number) => string;
}

const stringifyArray = (
  arr: unknown[],
  space: string,
  level: number,
  curLength: number,
  spaceWidth: number,
  { wrapping, replacer, trailingComma }: Options,
): string => {
  // A minimum; "[0]".length = 3, "[0, 1]".length = 6, etc
  let tryingCompact = curLength + arr.length * 3 < wrapping;
  let compact = "[";

  for (let i = 0; i < arr.length && tryingCompact; i++) {
    compact += replacer(arr[i], level + 1, curLength + compact.length) +
      (i < arr.length - 1 ? ", " : "");

    if (compact.length > wrapping) tryingCompact = false;
  }
  if (tryingCompact) {
    compact += "]";
    if (curLength + compact.length <= wrapping) return compact;
  }

  return [
    "[",
    arr
      .map(
        (element) =>
          space.repeat(level + 1) +
          replacer(element, level + 1, (level + 1) * spaceWidth),
      )
      .join(",\n") + (trailingComma ? "," : ""),
    space.repeat(level) + "]",
  ].join("\n");
};

const escapeKey = (key: string): string =>
  key.match(/^[_a-zA-Z][_0-9a-zA-Z]*$/) ? key : `"${key.replace(/"/g, "\\")}"`;

const stringifyObject = (
  obj: Record<string, unknown>,
  space: string,
  level: number,
  curLength: number,
  spaceWidth: number,
  { wrapping, replacer, trailingComma }: Options,
): string => {
  const entries = Object.entries(obj);
  // A minimum; "{ a: 0 }".length = 8, "{ a: 0, b: 1 }".length = 14, etc
  let tryingCompact = curLength + entries.length * 6 + 2 <= wrapping;
  if (tryingCompact) {
    let compact = "{" + (entries.length ? " " : "");

    for (let i = 0; i < entries.length && tryingCompact; i++) {
      const [key, value] = entries[i];

      compact += escapeKey(key) +
        ": " +
        replacer(value, level + 1, curLength + compact.length) +
        (i < entries.length - 1 ? ", " : "");

      if (curLength + compact.length > wrapping) tryingCompact = false;
    }

    if (tryingCompact) {
      compact += (entries.length ? " " : "") + "}";
      if (curLength + compact.length <= wrapping) return compact;
    }
  }

  return [
    "{",
    entries
      .map(([key, value]) => {
        const prefix = escapeKey(key) + ":";
        const stringified = replacer(
          value,
          level + 1,
          // + 2 to include potential space and trailing comma
          (level + 1) * spaceWidth + prefix.length + 2,
        );

        const compact = space.repeat(level + 1) + prefix + " " + stringified;

        if (
          compact
            .split("\n")[0]
            .replace(/\t/g, " ".repeat(spaceWidth)).length <
            wrapping
        ) {
          return compact;
        }

        return (
          space.repeat(level + 1) +
          prefix +
          "\n" +
          space.repeat(level + 2) +
          stringified
        );
      })
      .join(",\n") + (trailingComma ? "," : ""),
    space.repeat(level) + "}",
  ].join("\n");
};

const hasToJSFunction = (
  obj: unknown,
): obj is {
  toJS: (
    obj: unknown,
    spacer: string,
    level: number,
    currentLineLength: number,
    options: Options,
  ) => string;
} =>
  !!obj && typeof obj === "object" && "toJS" in obj &&
  typeof (obj as Record<string, unknown>).toJS === "function";

export const jsStringify = (
  obj: unknown,
  space: number | string = "\t",
  options: {
    wrapping?: number;
    tabWidth?: number;
    trailingComma?: boolean;
    replacer?: (obj: unknown, level?: number, curLength?: number) => string;
  } = {},
): string => {
  if (!("wrapping" in options)) options.wrapping = 80;
  if (!("tabWidth" in options)) options.tabWidth = 4;
  if (!("trailingComma" in options)) options.trailingComma = true;
  const tabWidth = options.tabWidth as number;

  if (typeof space === "number") space = " ".repeat(space);
  const spaceWidth = space.replace(/\t/g, " ".repeat(tabWidth)).length;

  const replacer = options.replacer ||
    (options.replacer = (obj, level = 0, curLength = 0): string => {
      const cleanedOptions = options as Options;

      // No chance of these having .toJS
      if (obj === undefined) return "undefined";

      if (obj === null) return "null";

      // Allow values to have their own toJS function
      if (hasToJSFunction(obj)) {
        return obj.toJS(
          obj,
          space as string,
          level,
          curLength,
          cleanedOptions,
        );
      }

      // Strings are pretty safe, just escape their definer
      if (typeof obj === "string") {
        return `"${obj.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
      }

      if (typeof obj === "number") obj.toString();

      // booleans and functions
      if (typeof obj !== "object") return obj.toString();

      if (Array.isArray(obj)) {
        return stringifyArray(
          obj,
          space as string,
          level,
          curLength,
          spaceWidth,
          cleanedOptions,
        );
      }

      return stringifyObject(
        obj as Record<string, unknown>,
        space as string,
        level,
        curLength,
        spaceWidth,
        cleanedOptions,
      );
    });

  return replacer(obj);
};
