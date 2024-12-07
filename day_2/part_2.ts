import { TextLineStream } from "@std/streams/text-line-stream";
import { parseArgs } from "@std/cli/parse-args";

function checkReport(levels: string[]): boolean {
  let isReportSafe = true;
  let lastSign = null;

  for (let i = 0; i < levels.length - 1; i++) {
    const level = Number(levels[i]);
    const nextLevel = Number(levels[i + 1]);
    const difference = level - nextLevel;

    if (lastSign !== null && lastSign !== Math.sign(difference)) {
      isReportSafe = false;
      break;
    }

    const absDifference = Math.abs(difference);

    if (absDifference < 1 || absDifference > 3) {
      isReportSafe = false;
      break;
    }

    lastSign = Math.sign(difference);
  }

  return isReportSafe;
}

export async function main(filePath?: string) {
  const args = parseArgs(Deno.args, { string: "--filePath" });
  const filename = import.meta.dirname + "/" +
    (filePath ?? args.filePath ?? "input.txt");
  const file = await Deno.open(filename, { read: true });
  const readableStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  let safe = 0;

  for await (const report of readableStream) {
    const levels = report.split(" ");

    if (checkReport(levels)) {
      safe++;
      continue;
    }

    for (let i = 0; i < levels.length; i++) {
      const modified = levels.filter((_, index) => index !== i);
      if (checkReport(modified)) {
        safe++;
        break;
      }
    }
  }

  // incorrect: 460
  // incorrect: 462
  // correct: 488
  return safe;
}

if (import.meta.main) {
  console.log("RESULT: " + await main());
}
