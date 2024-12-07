import { assertEquals } from "jsr:@std/assert";
import { main } from "./part_2.ts";

Deno.test("part 1 example test", async () => {
  const result = await main(import.meta.dirname + "/example.txt");
  assertEquals(result, 31);
});
