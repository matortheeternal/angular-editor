app.directive('editorDropdown', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/editorDropdown.html',
        scope: true,
        controller: 'editorDropdownController'
    }
});

app.controller('editorDropdownController', function($scope) {
    // inherited variables
    $scope.action = $scope.$parent.action;

    // scope functions
    $scope.toggleDropdown = function() {
        $scope.showDropdown = !$scope.showDropdown;
    };

    $scope.selectItem = function(item) {
        $scope.action.activeItem = item;
        $scope.showDropdown = false;
    };

    // event handlers
    $scope.$watch('action.activeItem', function() {
        $scope.$parent.selectChanged($scope.action);
    });

    // initialization
    $scope.selectItem($scope.action.options[0]);
});