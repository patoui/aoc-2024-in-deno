import { TextLineStream } from "@std/streams/text-line-stream";
import { parseArgs } from "@std/cli/parse-args";

function findXmas(
  grid: string[][],
  startY: number,
  startX: number,
  toFind: string,
  direction?: string|null
): number {
  if (toFind.length === 0) {
    return 1
  }

  let total = 0
  const next = toFind[0]

  const left = grid[startY]?.[startX-1]

  if ((!direction || direction === 'left') && left === next) {
    total += findXmas(grid, startY, startX-1, toFind.slice(1), 'left')
  }

  const right = grid[startY]?.[startX+1]

  if ((!direction || direction === 'right') && right === next) {
    total += findXmas(grid, startY, startX+1, toFind.slice(1), 'right')
  }

  const up = grid[startY-1]?.[startX]

  if ((!direction || direction === 'up') && up === next) {
    total += findXmas(grid, startY-1, startX, toFind.slice(1), 'up')
  }

  const down = grid[startY+1]?.[startX]

  if ((!direction || direction === 'down') && down === next) {
    total += findXmas(grid, startY+1, startX, toFind.slice(1), 'down')
  }

  const leftUp = grid[startY-1]?.[startX-1]

  if ((!direction || direction === 'leftUp') && leftUp === next) {
    total += findXmas(grid, startY-1, startX-1, toFind.slice(1), 'leftUp')
  }

  const rightUp = grid[startY-1]?.[startX+1]

  if ((!direction || direction === 'rightUp') && rightUp === next) {
    total += findXmas(grid, startY-1, startX+1, toFind.slice(1), 'rightUp')
  }

  const leftDown = grid[startY+1]?.[startX-1]

  if ((!direction || direction === 'leftDown') && leftDown === next) {
    total += findXmas(grid, startY+1, startX-1, toFind.slice(1), 'leftDown')
  }

  const rightDown = grid[startY+1]?.[startX+1]

  if ((!direction || direction === 'rightDown') && rightDown === next) {
    total += findXmas(grid, startY+1, startX+1, toFind.slice(1), 'rightDown')
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
  const grid = [];

  for await (const row of readableStream) {
    grid.push(row.split(''))
  }

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === 'X') {
        total += findXmas(grid, y, x, 'MAS')
      }
    }
  }

  return total
}

if (import.meta.main) {
  console.log('RESULT: ' + await main())
}
