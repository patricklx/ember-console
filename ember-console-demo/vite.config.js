import { defineConfig } from "vite";
import { ember, extensions } from "@embroider/vite";
import { babel } from "@rollup/plugin-babel";

export default defineConfig({
	// Add this config
	test: {
		disableConsoleIntercept: true,
		environment: "node",
		include: ["tests/**/*-test.{gjs,gts}"],
		deps: {
			inline: true,
		},
		maxConcurrency: 1,
		server: {
			deps: {
				inline: true,
			},
		},
	},
	// For dev server (if needed)
	server: {
		deps: {
			inline: true,
		},
	},
	// Existing config:
	plugins: [
		{
			enforce: "pre",
			async resolveId(source, from) {
				if (source.startsWith('ember-source')) {
					return this.resolve(source);
				}
			}
		},
		ember(),
		babel({
			babelHelpers: "runtime",
			extensions,
		}),
	],
});
