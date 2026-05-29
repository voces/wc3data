export const iniToObjs = (
  data: string,
): Record<string, Record<string, string>> => {
  const table: Record<string, Record<string, string>> = {};
  let entry: Record<string, string> | undefined;

  for (let line of data.replace(/\r/g, "").split("\n")) {
    line = line.replace(/\/\/.*/, "").trim();
    if (line.startsWith("/ ")) continue; // typo'd "//" comment in itemfunc.txt

    if (line === "") continue;

    const headerMatch = line.match(/^\[([0-9A-Za-z]{4})\]$/);
    if (headerMatch) {
      entry = {};
      table[headerMatch[1]] = entry;
      continue;
    }

    if (entry === undefined) throw new Error(`Bad line ${line}`);

    const valueMatch = line.match(/^([0-9A-Za-z]+)(?::[^=]*)?=(.*)/);
    if (valueMatch) {
      if (line[valueMatch[1].length] === ":") continue;
      const key = valueMatch[1]
        .replace("UberTip", "Ubertip")
        .replace("ButtonPos", "Buttonpos")
        .replace("Missilehoming", "MissileHoming")
        .replace("RequiresCount", "Requirescount")
        .replace("UnitSound", "unitSound");
      entry[key] = valueMatch[2];
      continue;
    }

    throw new Error(`Bad line ${line}`);
  }

  return table;
};
