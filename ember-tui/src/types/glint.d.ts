import type ElementNode from '../dom/nodes/ElementNode';
import '@glint/ember-tsc/types/-private/dsl/globals.d.ts';
import '@glint/template/-private/dsl/emit';
import type { ComponentLike, ModifierLike } from '@glint/template';
import 'ember-modifier';
import type {
  EmptyObject,
  NamedArgs,
  PositionalArgs,
} from 'ember-modifier/-private/signature';
import type {
  FunctionBasedModifier,
  Teardown,
} from 'ember-modifier/-private/function-based/modifier';
import { ElementForTagName, MathMlElementForTagName, SVGElementForTagName } from "@glint/template/-private/dsl/types";

declare module '*.gts' {
  import Component from '@glimmer/component';
  const value: typeof Component;
  export default value;
}

declare module '*.hbs' {
  const value: string;
  export default value;
}
