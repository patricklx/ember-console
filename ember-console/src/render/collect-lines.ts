import ElementNode from "../dom/nodes/ElementNode";
import { calculateLayout } from "../dom/layout.js";
import Output from "./Output.js";
import { renderNodeToOutput } from "./renderNodeToOutput.js";

/**
 * Extract lines from the document tree using layout-based rendering
 *
 * This function:
 * 1. Calculates layout using Yoga
 * 2. Creates an Output instance for coordinate-based rendering
 * 3. Renders each node using renderNodeToOutput
 * 4. Extracts the final output and converts to lines
 */
export function extractLines(rootNode: ElementNode): string[] {
	// Get terminal dimensions
	const terminalWidth = process.stdout.columns || 80;
	const terminalHeight = process.stdout.rows || 24;

	// Calculate layout for the entire tree
	calculateLayout(rootNode, terminalWidth, terminalHeight);

	// Create output buffer with terminal dimensions
	const output = new Output({
		width: terminalWidth,
		height: terminalHeight,
	});

	// Render the node tree to the output buffer
	renderNodeToOutput(rootNode, output, {
		offsetX: 0,
		offsetY: 0,
		transformers: [],
		skipStaticElements: false,
	});

	// Extract the final output
	const {output: renderedOutput} = output.get();

	// Convert to lines
	const lines = renderedOutput.split('\n');

	return lines;
}
