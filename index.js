
var panel = require('todolist-panel')
  , settings = require('settings')
  , chromeStorage = require('settings-chrome-storage');

settings.set('ffapi:main.ffhome', 'https://familyfound.herokuapp.com/');

chromeStorage.load(settings, function () {
  panel.attach(window);
});

