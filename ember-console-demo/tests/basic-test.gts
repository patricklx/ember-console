import "./globalSetup";
import { setupRenderingContext } from 'ember-vitest';
import { describe, test, expect as hardExpect } from "vitest";

const expect = hardExpect.soft;

console.log('starting...', globalThis.document);

describe("example", () => {
	test("it works", async () => {
		await using ctx = await setupRenderingContext();

		await ctx.render(<template>hello there</template>);

		expect(ctx.element.textContent).contains("hello there");
	});
});
