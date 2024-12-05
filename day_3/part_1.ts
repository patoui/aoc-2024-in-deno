import { TextLineStream } from "@std/streams/text-line-stream";
import { parseArgs } from "@std/cli/parse-args";

function parse(rawInstructions: string): number
{
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g
  const instructions = [...rawInstructions.matchAll(regex)]

  if (instructions.length === 0) {
    return 0
  }

  let total = 0

  for (const instruction of instructions) {
    total += Number(instruction[1]) * Number(instruction[2])
  }

  return total
}

export async function main(filePath?: string): Promise<number> {
  const args = parseArgs(Deno.args, {string: "--filePath"});
  const filename = import.meta.dirname + '/' + (filePath ?? args.filePath ?? "input.txt")
  const file = await Deno.open(filename, { read: true })
  const readableStream = file.readable
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new TextLineStream)

  let total = 0

  for await (const instructions of readableStream) {
    total += parse(instructions)
  }

  return total
}

if (import.meta.main) {
  console.log('RESULT: ' + await main())
}
