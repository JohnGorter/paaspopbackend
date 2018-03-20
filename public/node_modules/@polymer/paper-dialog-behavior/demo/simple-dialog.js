import { html } from '../../polymer/polymer.js';
import { PaperDialogBehavior } from '../paper-dialog-behavior.js';
import '../paper-dialog-shared-styles.js';
import { Polymer } from '../../polymer/lib/legacy/polymer-fn.js';

Polymer({
  _template: html`
    <style include="paper-dialog-shared-styles"></style>
    <slot></slot>
`,

  is: 'simple-dialog',

  behaviors: [
    PaperDialogBehavior
  ]
});
