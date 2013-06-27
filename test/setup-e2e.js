
var angular = require('angularjs')
  , chromeExt = require('chrome-ext')
  , copy = require('deep-copy')

  , log = require('domlog');

log.init();

var man = {
  display: {
    name: "Jared Forsyth",
    gender: "Male",
    lifespan: "1599-1634",
    birthDate: "12 July 1599",
    birthPlace: "Mayfield, Iowa"
  },
  id: 'MALE-X3T',
  todos: [],
  fatherId: 'MALE-X3T',
  motherId: 'FEM-JKL',
  father: null,
  mother: null
};

var woman = {
  display: {
    name: "Eliza Jane Harris",
    gender: "Female",
    lifespan: "1599-1650",
    birthDate: "12 May 1599",
    birthPlace: "Mayfield, Iowa"
  },
  id: 'FEM-JKL',
  todos: [],
  fatherId: 'MALE-X3T',
  motherId: 'FEM-JKL',
  father: null,
  mother: null
};

angular.module('test', ['familyfound'])
  .factory('ffperson', function () {
    return function (personId, next) {
      setTimeout(function() {
        return next({
          id: personId,
          status: 'working',
          todos: [{
            _id: '12434jJLKFSDf',
            completed: false,
            type: 'General',
            title: 'Fix all my stuff',
            owned: false,
            watching: true
          }, {
            _id: 'QWEIOPERsdfssf',
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
    var ffapi = function (name, params, next) {
      log('call made', name, params, next);
      if (name == 'todos/add') {
        setTimeout(function () {
          next({id: '234tre'});
        }, 0);
      }
    };
    ffapi.relation = function (personId, next) {
      log('getting ancestor', personId);
      setTimeout(function () {
        var base;
        if (personId === 'MALE-X3T') base = copy(man);
        else base = copy(woman);
        base.status = ['working', 'clean', 'complete'][parseInt(Math.random()*3)];
        return next(base);
      }, 100 + Math.random() * 300);
    };
    return ffapi;
  });
