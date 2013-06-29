
var panel = require('todolist-panel')
  , settings = require('settings')
  , angularSettings = require('angular-settings');


// injected
if (location.href.indexOf('familysearch') !== -1) {
  angularSettings.loadChromeStorage(settings, function () {
    panel.attach(window);
  });
}
// otherwise it's the settings page, angular takes care of business  
module.exports = panel;
panel.require = require;

