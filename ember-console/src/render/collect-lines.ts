import ElementNode from "../dom/nodes/ElementNode";
import { elementIterator } from "../dom/nodes/DocumentNode";
import { TerminaTextElement } from "../dom/native-elements/TerminaTextElement";


/**
 * Extract lines from the document tree
 */
export function extractLines(rootNode: ElementNode): string[] {
	const lines: string[] = [];
	for (const node of elementIterator(rootNode)) {
		if (node instanceof TerminaTextElement) {
			lines.push(...node.text.split('\n'));
		}
	}
	return lines;
}
