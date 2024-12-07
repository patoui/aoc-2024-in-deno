import { assertEquals } from "jsr:@std/assert";
import { main } from "./part_1.ts";

Deno.test("part 1 example test", async () => {
  const result = await main("example.txt")
  assertEquals(result, 18)
})
