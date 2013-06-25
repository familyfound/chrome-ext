
var angular = require('angularjs')
  , request = require('superagent')
  , promise = require('promise')

  , todoTpl = require('./todo-tpl')
  , template = require('./template');

function inject(personId, parentDiv, app) {
  var details = document.querySelector('#ancestorPage .details-content')
    , div = document.createElement('div');
  if ((!details && !parentDiv) || document.getElementById('FamilyFoundSection')) {
    // no need to inject
    return;
  }
  div.innerHTML = template;
  div = div.firstElementChild;
  if (parentDiv) {
    if (parentDiv.children.length) {
      parentDiv.insertBefore(div, parentDiv.children[0]);
    } else {
      parentDiv.appendChild(div);
    }
  } else {
    details.insertBefore(div, details.querySelector('#LifeSketchVitalSection'));
  }
  div.querySelector('#FamilyFound').setAttribute('data-person-id', personId);
  angular.bootstrap(div, [app || 'familyfound']);
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

var homepage = 'http://familyfound.local:3000/';

var todoTypes = ['General', 'Find Record', 'Resolve Duplicates', 'Find Children'];

angular.module('familyfound', [])

  .factory('authorize', function () {
    var sessionid = null;
    var cookie = [].concat(document.cookie.split('; ')
                   .map(function (m) { return m.split('='); }))
                   .reduce(function (rest, one) { rest[one[0]] = decodeURIComponent(one[1]); return rest; });
    return function (req) {
      req.set('Authorization', 'Bearer ' + cookie.fssessionid);
      return req;
    };
  })

  .factory('ffApi', function (authorize) {
    return function (name, options, next) {
      var url = homepage + 'api/' + name;
      var req = authorize(request.post(url));
      if (options) req.send(options);
      req.set('Accept', 'application/json')
        .end(function (err, res) {
          if (err) { return console.error('failed in ff api', url, options, err); }
          next && next(res.body);
        });
    };
  })

  .directive('todo', function (ffApi) {
    return {
      scope: {},
      replace: false,
      restrict: 'A',
      template: todoTpl,
      link: function (scope, element, attrs) {
        var name = attrs.todo;
        scope.$parent.$watch(name, function(value) {
          scope.todo = value;
        });
        scope.$watch('todo', function(value) {
          scope.$parent[name] = value;
        });
        scope.$watch('todo.watching', function (value, old) {
          if (value === old) return;
          var url = value ? 'watch' : 'unwatch';
          ffApi('todos/' + url, {id: scope.todo._id});
        });
        scope.$watch('todo.done', function (value, old) {
          if (value === old) return;
          var url = value ? 'done' : 'undone';
          ffApi('todos/' + url, {id: scope.todo._id});
        });
        element.find('button')[0].addEventListener('click', function () {
          scope.$parent.removeTodo(scope.todo);
        });
      }
    };
  })

  .controller('FamilyFoundCtrl', function ($scope, person, ffApi, $attrs) {
    $scope.personId = $attrs.personId;
    window.addEventListener('hashchange', function () {
      var params = parseArgs(location.hash.slice(1));
      if (params.person !== $scope.personId) {
        $scope.personId = params.person;
        person($scope.personId, function (person) {
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
    person($attrs.personId, function (person) {
      $scope.todos = person.todos;
      $scope.status = person.status;
      $scope.$digest();
    });
    $scope.$watch('status', function (value, old) {
      if (value === old || !old) return;
      ffApi('person/status', {status: value, id: $scope.personId});
    });
    $scope.removeTodo = function (todo) {
      var i = $scope.todos.indexOf(todo);
      if (i === -1) {
        console.warn('Todo not found', todo, $scope.todos);
        return;
      }
      $scope.todos.splice(i, 1);
      ffApi('todos/remove', {id: todo._id});
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
      ffApi('todos/add', todo, function (data) {
        todo._id = data.id;
        todo.watching = true;
        todo.owned = true;
        $scope.todos.push(todo);
        $scope.$digest();
      });
    };
  })

  .factory('person', function (authorize) {
    return function (personId, next) {
      authorize(request.get(homepage + 'api/person/' + personId))
        .end(function (err, data) {
          if (err) return console.error('failed to get person', personId, err);
          return next(data.body);
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
