
var angular = require('angularjs')
  , request = require('superagent')
  , promise = require('promise')
  , todo = require('todo')
  , newTodo = require('new-todo')
  , todoList = require('todo-list')
  , fan = require('fan')
  , ffapi = require('ffapi')
  , bootstrap = require('ng-bootstrap')
  , settings = require('settings')

  , template = require('./template');

function tpldiv(template) {
  var div = document.createElement('div');
  div.innerHTML = template;
  return div.firstElementChild;
}

function inject(personId) {
  if (document.getElementById('FamilyFoundSection')) {
    return;
  }
  var div = tpldiv(template)
    , parentDiv = document.querySelector('#ancestorPage .details-content')
  div.querySelector('#FamilyFound').setAttribute('data-person-id', personId);
  bootstrap(div, parentDiv, 'familyfound', parentDiv.querySelector('#LifeSketchVitalSection'));
}

function parseArgs(args) {
  return [].concat(args.split('&').map(function(a){
    return a.split('=');
  })).reduce(function (rest, one) { rest[one[0]] = one[1]; return rest; });
}

function hashChange() {
  if (location.hash.indexOf('#view=ancestor') === 0) {
    setTimeout(function () {
      var items = parseArgs(location.hash.slice(1));
      if (!items.person) return;
      inject(items.person);
    }, 100);
  }
}

settings.set('ffapi:main.ffhome', 'https://familyfound.herokuapp.com/');

var loadPeople = function (get, base, scope, gens) {
  if (gens <= 0) {
    base.hideParents = true;
    return null;
  }
  base.hideParents = false;
  if (base.fatherId) {
    get(base.fatherId, function (data, cached) {
        base.father = data;
        data.mainChild = base;
        loadPeople(get, base.father, scope, gens - 1);
        if (!cached) scope.$digest();
      });
  }
  if (base.motherId) {
    get(base.motherId, function (data, cached) {
        base.mother = data;
        data.mainChild = base;
        loadPeople(get, base.mother, scope, gens - 1);
        if (!cached) scope.$digest();
      });
  }
};

angular.module('familyfound', ['todo', 'new-todo', 'todo-list', 'fan', 'ffapi'])

  .controller('FamilyFoundCtrl', function ($scope, $attrs, ffperson, ffapi) {
    $scope.personId = $attrs.personId;
    window.addEventListener('hashchange', function () {
      var params = parseArgs(location.hash.slice(1));
      if (params.person !== $scope.personId) {
        $scope.personId = params.person;
        ffperson($scope.personId, function (person) {
          $scope.todos = person.todos;
          $scope.status = person.status;
          $scope.$digest();
        });
        $scope.rootPerson = false;
        ffapi.relation($scope.personId, function (person, cached) {
          $scope.rootPerson = person;
          loadPeople(ffapi.relation, person, $scope, 5);
          if (!cached) $scope.$digest();
        });
        $scope.$digest();
      }
    });
    $scope.status = null;
    ffperson($attrs.personId, function (person) {
      $scope.todos = person.todos;
      $scope.status = person.status;
      $scope.$digest();
    });
    $scope.$watch('status', function (value, old) {
      if (value === old || !old) return;
      ffapi('person/status', {status: value, id: $scope.personId});
    });
    $scope.fanConfig = {
      gens: 6,
      links: false,
      width: 240,
      height: 170,
      center: {x: 120, y: 120},
      ringWidth: 20,
      doubleWidth: false,
      tips: true,
      removeRoot: true,
      onNode: function (el, person) {
        el.on('click', function () {
          window.location.hash = '#view=ancestor&person=' + person.id;
        });
      }
    };
    $scope.rootPerson = false;
    ffapi.relation($attrs.personId, function (person, cached) {
      $scope.rootPerson = person;
      loadPeople(ffapi.relation, person, $scope, 5);
      if (!cached) $scope.$digest();
    });
  });

module.exports = {
  attach: function (window) {
    window.addEventListener('hashchange', hashChange);
    hashChange();
  },
  inject: inject
};
