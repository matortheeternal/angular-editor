app.directive('directiveBlock', function() {
    var elementIsChild = function(element, parent) {
        while (element) {
            if (element === parent) return true;
            element = element.parentNode;
        }
    };

    return {
        restrict: 'E',
        templateUrl: '../partials/directiveBlock.html',
        scope: {
            code: '=?'
        },
        controller: 'directiveBlockController',
        link: function(scope, element) {
            var focused = false;

            var clickHandler = function(e) {
                if (!focused) return;
                if (elementIsChild(e.target, element[0])) return;
                setFocused(false);
            };

            var setFocused = function(b) {
                if (focused === b) return;
                focused = b;
                var method = b ? 'add' : 'remove';
                element[0].classList[method]('focused');
                window[method + 'EventListener']('click', clickHandler);
            };

            element[0].setAttribute('contenteditable', 'false');
            element[0].setAttribute('tabindex', '0');

            element[0].addEventListener('click', function() {
                setFocused(true);
            });

            scope.$on('destroy', function() {
                setFocused(false);
            });
        }
    }
});

app.controller('directiveBlockController', function($scope, $sce, $compile) {
    if (!$scope.code) $scope.code = '';
    $scope.directives = $scope.$parent.allowedDirectives;
    $scope.showCode = false;

    // scope functions
    $scope.toggleMode = function() {
        $scope.showCode = !$scope.showCode;
    };

    // event handlers
    $scope.$watch('activeDirective', function() {
        if (!$scope.activeDirective) return;
        $scope.code = $scope.activeDirective.code;
    });
    
    $scope.$watch('code', function() {
        $scope.html = $sce.trustAsHtml($scope.code).toString();
    });
    
    $scope.$watch('showCode', function() {
        if ($scope.showCode || !$scope.previewElement) return;
        $scope.previewElement.html($sce.trustAsHtml($scope.code).toString());
        $compile($scope.previewElement.contents())($scope.$parent);
    });
});