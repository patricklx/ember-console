import { startApp } from './boot';
import { render } from 'ember-ink';

// Start the Ember application
startApp()
  .then(() => {
    // Start rendering to terminal
  })
  .catch((error) => {
    console.error('Failed to start Ember-Ink application:', error);
    process.exit(1);
  });
