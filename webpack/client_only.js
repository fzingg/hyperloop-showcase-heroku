// webpack/client_only.js

// any packages that depend specifically on the DOM go here
// for example the Webpack CSS loader generates code that will break prerendering
console.log('client_only.js loaded');
require('bootstrap/dist/css/bootstrap.css');