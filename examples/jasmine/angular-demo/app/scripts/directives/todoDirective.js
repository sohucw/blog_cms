angular.module('todoApp')
.directive('customColor', function() {
  return {
    restrict: 'A',
    link: function(scope, elem, attrs) {
      elem.css({'background-color': attrs.customColor});
    }
  };
});