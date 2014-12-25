angular.module('todoApp')
  .controller('TodoController', function ($scope, notesFactory) {
    $scope.notes = notesFactory.get();
    $scope.createNote = function () {
      notesFactory.put($scope.note);
      $scope.note = '';
      $scope.notes = notesFactory.get();
    };
  });