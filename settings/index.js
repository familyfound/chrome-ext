
var panel = require('todolist-panel')
  , settings = require('settings')()
  , angularSettings = require('angular-settings')
  , chromeStorage = require('settings-chrome-storage');

angularSettings.config('familyfound', 'default', {
    settings: ['panel.display.*'],
    name: 'display',
    title: 'Display'
  }, {
    settings: ['ffapi.*'],
    name: 'network',
    title: 'Network'
  });

module.exports = angular.module('ff-settings', ['todolist-panel', 'settings-chrome-storage', 'settings']);
module.exports.settings = settings;

settings.set('ffapi.ffhome', 'https://familyfound.herokuapp.com/');
