/**
 * Render function for Ember-Ink
 * Renders Glimmer components to terminal output
 */

import TerminalDocumentNode from './dom/nodes/TerminalDocumentNode';
import { _backburner } from "@ember/runloop";
import { elementIterator } from "./dom/nodes/DocumentNode";
import { TerminaTextElement } from "./dom/native-elements/TerminaTextElement";
import { DocumentNode } from "./index";
import * as process from "node:process";
import ElementNode from "./dom/nodes/ElementNode";

export interface RenderOptions {
  /**
   * Output stream where app will be rendered.
   * @default process.stdout
   */
  stdout?: NodeJS.WriteStream;

  /**
   * Input stream where app will listen for input.
   * @default process.stdin
   */
  stdin?: NodeJS.ReadStream;

  /**
   * Error stream.
   * @default process.stderr
   */
  stderr?: NodeJS.WriteStream;
}

export interface RenderInstance {
  /**
   * The root document node
   */
  document: TerminalDocumentNode;

  /**
   * Unmount the app
   */
  unmount: () => void;

  /**
   * Clear the terminal output
   */
  clear: () => void;
}

function render(rootNode: ElementNode) {
	process.stdout.cursorTo(0, 0);
	process.stdout.clearScreenDown();
	for (const node of elementIterator(rootNode)) {
		if (node instanceof TerminaTextElement) {
			process.stdout.write(node.text + '\n');
		}
	}
}

/**
 * Render a Glimmer component to the terminal
 */
export function startRender(
  document: DocumentNode
): void {
	render(document.body);
	_backburner.on('end', () => render(document.body));

	const stdout = process.stdout;
	const stdin = process.stdin;

	stdin.setRawMode(true);
	stdin.resume();
	stdin.setEncoding('utf8');

	stdin.on('data', function(keyBuffer){
		const key = keyBuffer.toString();
		if (key == '\u001B\u005B\u0041') {
			process.stdout.write('up');
		}
		if (key == '\u001B\u005B\u0043') {
			process.stdout.write('right');
		}
		if (key == '\u001B\u005B\u0042') {
			process.stdout.write('down');
		}
		if (key == '\u001B\u005B\u0044') {
			process.stdout.write('left');
		}

		if (key == '\u0003') { process.exit(); }    // ctrl-c
	});

	stdout.on('resize', () => {

	});
}
