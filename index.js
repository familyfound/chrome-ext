
var angular = require('angularjs')
  , request = require('superagent')
  , promise = require('promise')
  , todo = require('todo')
  , ffapi = require('ffapi')
  , bootstrap = require('ng-bootstrap')

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

var todoTypes = ['General', 'Find Record', 'Resolve Duplicates', 'Find Children'];

angular.module('familyfound', ['todo', 'ffapi'])

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
      }
    });
    $scope.todoType = todoTypes[0];
    $scope.todoTypes = todoTypes;
    $scope.todoDescription = '';
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
    $scope.removeTodo = function (todo) {
      var i = $scope.todos.indexOf(todo);
      if (i === -1) {
        console.warn('Todo not found', todo, $scope.todos);
        return;
      }
      $scope.todos.splice(i, 1);
      ffapi('todos/remove', {id: todo._id});
      $scope.$digest();
    };
    $scope.addTodo = function () {
      // TODO: should I limit this? If I've got really good types, then not
      // if (!$scope.todoDescription) return;
      var todo = {
        completed: false,
        type: $scope.todoType,
        title: $scope.todoDescription,
        person: $scope.personId
      };
      $scope.todoType = todoTypes[0];
      $scope.todoDescription = '';
      ffapi('todos/add', todo, function (data) {
        todo._id = data.id;
        todo.watching = true;
        todo.owned = true;
        $scope.todos.push(todo);
        $scope.$digest();
      });
    };
  });

module.exports = {
  attach: function (window) {
    window.addEventListener('hashchange', hashChange);
    hashChange();
  },
  inject: inject
};
