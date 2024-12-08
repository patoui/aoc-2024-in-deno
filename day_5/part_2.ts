function move(numbers: Array<string>, from: number, to: number) {
  const val = numbers[from];
  numbers.splice(from, 1);
  numbers.splice(to, 0, val);
}

export async function main(filePath?: string): Promise<number> {
  const filePathArg = Deno.args?.[0]?.replace("--filePath=", "");
  const filename = import.meta.dirname + "/" +
    (filePath ?? filePathArg ?? "input.txt");
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
  const invalids = new Array<string[]>();

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

        if (ruleIndex < i) {
          move(numbers, ruleIndex, i);
          i--;
          isValid = false;
        }
      }
    }

    if (!isValid) {
      invalids.push(numbers);
    }
  }

  for (const numbers of invalids) {
    const middleIndex = Math.floor(numbers.length / 2);
    total += Number(numbers[middleIndex]);
  }

  return total;
}

if (import.meta.main) {
  console.log("RESULT: " + await main());
}
