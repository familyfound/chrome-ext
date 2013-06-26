
var angular = require('angularjs')
  , chromeExt = require('chrome-ext')

  , log = require('domlog');

log.init();

angular.module('test', ['familyfound'])
  .factory('ffperson', function () {
    return function (personId, next) {
      setTimeout(function() {
        return next({
          id: personId,
          status: 'working',
          todos: [{
            id: '12434jJLKFSDf',
            completed: false,
            type: 'General',
            title: 'Fix all my stuff',
            owned: false,
            watching: true
          }, {
            id: 'QWEIOPERsdfssf',
            completed: true,
            type: 'Find Record',
            title: 'marriage',
            owned: true,
            watching: false
          }]});
      }, 0);
    };
  })
  .factory('ffapi', function () {
    return function (name, params, next) {
      log('call made', name, params, next);
      if (name == 'todos/add') {
        setTimeout(function () {
          next({id: '234tre'});
        }, 0);
      }
    };
  });
