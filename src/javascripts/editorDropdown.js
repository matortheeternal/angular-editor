app.directive('editorDropdown', function() {
    return {
        restrict: 'E',
        templateUrl: '/partials/editorDropdown.html',
        scope: {
            disabled: '='
        },
        controller: 'editorDropdownController'
    }
});

app.controller('editorDropdownController', function($scope, $element) {
    // inherited variables
    $scope.action = $scope.$parent.action;

    // scope functions
    $scope.toggleDropdown = function() {
        if ($scope.disabled) return;
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

    $scope.$watch('disabled', function() {
        var classList = $element[0].classList;
        $scope.disabled ? classList.add('disabled') :
            classList.remove('disabled');
    });

    // initialization
    $scope.selectItem($scope.action.options[0]);
});