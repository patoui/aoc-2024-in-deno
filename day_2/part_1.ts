import { TextLineStream } from "@std/streams/text-line-stream";
import { parseArgs } from "@std/cli/parse-args";

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
    let isReportSafe = true;
    let lastSign = null;

    for (let i = 0; i < levels.length - 1; i++) {
      const level = Number(levels[i]);
      const nextLevel = Number(levels[i + 1]);
      const differenceNext = level - nextLevel;

      if (lastSign !== null && lastSign !== Math.sign(differenceNext)) {
        isReportSafe = false;
        break;
      }

      if (Math.abs(differenceNext) > 3) {
        isReportSafe = false;
        break;
      }

      lastSign = Math.sign(differenceNext);
    }

    if (isReportSafe) {
      safe++;
    }
  }

  return safe;
}

console.log("RESULT: " + await main());
