module.exports = '\n<div id="FamilyFoundSection" class="rounded-section">\n  <div class="section-wrap">\n    <h4 class="gadget-title">Family Found Research</h4>\n    <div id="FamilyFound" ng-controller="FamilyFoundCtrl" class="gadget familyFound">\n      <div data-toggle="buttons-radio" class="status btn-group">\n        <label>\n          <input type="radio" value="working" ng-model="status"/><span>Working</span>\n        </label>\n        <label>\n          <input type="radio" value="clean" ng-model="status"/><span>Clean</span>\n        </label>\n        <label>\n          <input type="radio" value="complete" ng-model="status"/><span>Complete</span>\n        </label>\n      </div>\n      <form ng-submit="addTodo()" class="todo-form">\n        <select ng-model="todoType" ng-options="value for value in todoTypes" class="todo-type"></select>\n        <input placeholder="Describe your todo" ng-model="todoDescription" class="new-todo"/>\n      </form>\n      <ul class="todos">\n        <li ng-repeat="todo in todos" ng-class="{done: todo.done}" data-todo="todo" class="todo"></li>\n      </ul>\n    </div>\n  </div>\n</div>';