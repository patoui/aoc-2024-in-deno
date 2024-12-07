import { parseArgs } from "@std/cli/parse-args";

export async function main(filePath?: string): Promise<number> {
  const args = parseArgs(Deno.args, { string: "--filePath" });
  const filename = import.meta.dirname + "/" +
    (filePath ?? args.filePath ?? "input.txt");
  const text = await Deno.readTextFile(filename);

  let isRule = true;
  const rules: { [key: string]: string[] } = {};
  const pageNumbers = [];

  for (const line of text.split(/\n/)) {
    if (line === "") {
      isRule = false;
      continue;
    }

    if (isRule) {
      const [key, value] = line.split("|");
      if (!(key in rules)) {
        rules[key] = [];
      }
      rules[key].push(value);
    } else {
      pageNumbers.push(line.split(","));
    }
  }

  let total = 0;

  for (const numbers of pageNumbers) {
    let isValid = true;
    for (let i = 0; i < numbers.length; i++) {
      const num = numbers[i];
      const numRules = rules[num];

      if (!numRules) {
        continue;
      }

      for (const rule of numRules) {
        const ruleIndex = numbers.indexOf(rule);

        if (ruleIndex === -1) {
          continue;
        }

        if (num > rule && ruleIndex < i) {
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        break;
      }
    }

    if (isValid) {
      const middleIndex = Math.floor(numbers.length / 2);
      total += Number(numbers[middleIndex]);
    }
  }

  // incorrect: 2971 (too low)
  return total;
}

if (import.meta.main) {
  console.log("RESULT: " + await main());
}
