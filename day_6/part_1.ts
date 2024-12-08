export async function main(filePath?: string): Promise<number> {
  const filePathArg = Deno.args?.[0]?.replace("--filePath=", "");
  const filename = import.meta.dirname + "/" +
    (filePath ?? filePathArg ?? "input.txt");
  const text = await Deno.readTextFile(filename);

  let total = 0;

  return total;
}

if (import.meta.main) {
  console.log("RESULT: " + await main());
}
