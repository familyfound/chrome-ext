
var panel = require('todolist-panel')
  , settings = require('settings')
  , chromeStorage = require('chrome-storage');

// injected
if (location.href.indexOf('familysearch') !== -1) {
  chromeStorage.load(settings, function () {
    panel.attach(window);
  });
} else {
  // otherwise it's the settings page, angular takes care of business  
  module.exports = panel;
  panel.require = require;
  angular.module('ff-settings', ['familyfound', 'chrome-storage'])
    .controller('Settings', function () {
    });
}

