
var panel = require('todolist-panel')
  , settings = require('settings')
  , angularSettings = require('angular-settings')
  , chromeStorage = require('settings-chrome-storage');

angularSettings.config('familyfound', {
  name: 'default',
  pages: [{
    module: 'panel',
    page: 'display'
    title: 'Display'
  }, {
    module: 'ffapi',
    page: 'main',
    title: 'Network'
  }]
});

module.exports = angular.module('ff-settings', ['todolist-panel', 'settings-chrome-storage', 'settings']);
