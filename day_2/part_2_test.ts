import { assertEquals } from "jsr:@std/assert";
import { main } from "./part_2.ts";

Deno.test("part 1 example test", async () => {
  const result = await main("example.txt")
  assertEquals(result, 4)
})

Deno.test("part 1 example extra test", async () => {
  const result = await main("example_extra.txt")
  assertEquals(result, 4)
})
