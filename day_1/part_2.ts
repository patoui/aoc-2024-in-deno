import { TextLineStream } from "@std/streams/text-line-stream";

export async function main(filePath?: string): Promise<number> {
  const filename = filePath ?? import.meta.dirname + "/input.txt";
  const file = await Deno.open(filename, { read: true });
  const readableStream = file.readable
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream());

  const rows = await Array.fromAsync(readableStream);

  const left = [];
  const right = new Map();

  for (let i = 0; i < rows.length; i++) {
    const [leftNumber, rightValue] = rows[i].split("   ");
    left.push(Number(leftNumber));
    right.set(rightValue, (right.get(rightValue) ?? 0) + 1);
  }

  let sum = 0;

  for (let i = 0; i < left.length; i++) {
    sum += left[i] * (right.get(left[i].toString()) ?? 0);
  }

  // 21024792
  return sum;
}

console.log("RESULT: " + await main());
