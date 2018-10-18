editor.directive('editorDropdown', function() {
    return {
        restrict: 'E',
        template:
        '<div class="selected-item" ng-click="toggleDropdown()">\n' +
        '    {{action.activeItem.label}}\n' +
        '</div>\n' +
        '<div class="dropdown" ng-show="showDropdown" title>\n' +
        '    <div ng-repeat="item in action.options" ng-bind-html="item.preview" ng-click="selectItem(item)"></div>\n' +
        '</div>',
        scope: {
            disabled: '='
        },
        controller: 'editorDropdownController'
    }
});

editor.controller('editorDropdownController', function($scope, $element, editorHtmlHelpers) {
    // inherited variables
    $scope.action = $scope.$parent.action;

    var unfocusDropdown = function(e) {
        var isChild = editorHtmlHelpers.elementIsChild(e.target, $element[0]);
        if (isChild) return;
        $scope.$applyAsync(function() {
            $scope.showDropdown = false;
        });
        window.removeEventListener('click', unfocusDropdown);
    };

    // scope functions
    $scope.toggleDropdown = function() {
        if ($scope.disabled) return;
        $scope.showDropdown = !$scope.showDropdown;
        if (!$scope.showDropdown) return;
        window.addEventListener('click', unfocusDropdown);
    };

    $scope.selectItem = function(item) {
        $scope.action.activeItem = item;
        $scope.showDropdown = false;
        $scope.$parent.selectChanged($scope.action);
    };

    // event handlers
    $scope.$watch('disabled', function() {
        var classList = $element[0].classList;
        $scope.disabled ? classList.add('disabled') :
            classList.remove('disabled');
    });

    $scope.$on('dropdownCallback', function(e, cb) {
        cb($scope);
    });

    // initialization
    $scope.selectItem($scope.action.options[0]);
});