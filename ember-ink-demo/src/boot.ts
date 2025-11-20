import { setup, TerminalDocumentNode } from 'ember-ink';
import App from './app';
import type ApplicationClass from "@ember/application";
import env from "./config/env";

function init(
	Application: typeof ApplicationClass,
	env
) {

	env.rootElement = TerminalDocumentNode.createElement('root-layout');

	const app = Application.create({
		// @ts-expect-error expected
		name: env.modulePrefix,
		version: env.APP.version,
		ENV: env
	});

	app.register('config:environment', env);

	return app;
}

export async function boot() {
  return new Promise<void>((resolve, reject) => {
    try {
      // Set up the terminal environment (creates document, window, etc.)
      setup();

      console.log('🚀 Starting Ember-Ink Application...\n');

      // Resolve immediately - we're ready to visit
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

export async function startApp() {
  await boot();

  const document = globalThis.document;

	const app = init(App, env)
  // Visit the root route
  await app.visit('/', {
    document: document,
    isInteractive: true,
  });

  console.log('\n✨ Ember-Ink application started successfully!');

  // Make app available globally for debugging
  (globalThis as any).app = app;
}
