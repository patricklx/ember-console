import EmberRouter from 'ember-source/dist/packages/@ember/routing/router';
import ENV from './config/env';

export default class Router extends EmberRouter {
  location = 'none';
  rootURL = ENV.rootURL || '/';
}

Router.map(function () {
  // Define your routes here
});
