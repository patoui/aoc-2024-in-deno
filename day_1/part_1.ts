import { TextLineStream } from "@std/streams/text-line-stream";

async function main(): Promise<void> {
  const file = await Deno.open(import.meta.dirname + "/input.txt", { read: true })
  const readableStream = file.readable
    .pipeThrough(new TextDecoderStream)
    .pipeThrough(new TextLineStream)

  const rows = await Array.fromAsync(readableStream);

  const left = [];
  const right = [];

  for (let i = 0; i < rows.length; i++) {
    const [leftNumber, rightNumber] = rows[i].split('   ').map(Number)
    left.push(leftNumber)
    right.push(rightNumber)
  }

  left.sort()
  right.sort()

  let sum = 0;

  for (let i = 0; i < left.length; i++) {
    sum += Math.abs(left[i] - right[i])
  }

  // 1879048
  console.log('SUM: ' + sum)
}

main()
