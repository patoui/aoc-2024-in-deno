import { assertEquals } from "jsr:@std/assert";
import { main } from "./part_2.ts";

Deno.test("part 2 example test", async () => {
  const result = await main("example.txt");
  assertEquals(result, 123);
});
