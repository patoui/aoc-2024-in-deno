import { TextLineStream } from "@std/streams/text-line-stream";
import { parseArgs } from "@std/cli/parse-args";

export async function main(filePath?: string): Promise<number> {
  const args = parseArgs(Deno.args, {string: "--filePath"});
  const filename = import.meta.dirname + '/' + (filePath ?? args.filePath ?? "input.txt")
  const file = await Deno.open(filename, { read: true })
  const readableStream = file.readable
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new TextLineStream)

  let total = 0
  let isEnabled = true

  for await (const instructions of readableStream) {
    const commands = [...instructions.matchAll(/mul\((\d{1,3}),(\d{1,3})\)|don't\(\)|do\(\)/g)]

    for (let i = 0; i < commands.length; i++) {
      if (commands[i][0] === "don't()") {
        isEnabled = false
      } else if (commands[i][0] === 'do()') {
        isEnabled = true
      } else if (isEnabled) {
        total += Number(commands[i][1]) * Number(commands[i][2])
      }
    }
  }

  return total
}

if (import.meta.main) {
  console.log('RESULT: ' + await main())
}
