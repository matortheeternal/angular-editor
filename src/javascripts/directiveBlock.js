app.directive('directiveBlock', function() {
    var elementIsChild = function(element, parent) {
        while (element) {
            if (element === parent) return true;
            element = element.parentNode;
        }
    };

    return {
        restrict: 'E',
        templateUrl: '../../partials/directiveBlock.html',
        scope: {
            index: '='
        },
        controller: 'directiveBlockController',
        link: function(scope, element) {
            var focused = false;
            var el = element[0];

            var clickHandler = function(e) {
                if (!focused) return;
                if (elementIsChild(e.target, el)) return;
                setFocused(false);
            };

            var setFocused = function(b) {
                if (focused === b) return;
                focused = b;
                var method = b ? 'add' : 'remove';
                el.classList[method]('focused');
                window[method + 'EventListener']('click', clickHandler);
            };

            el.setAttribute('contenteditable', 'false');
            el.setAttribute('tabindex', '0');

            el.addEventListener('click', function() {
                setFocused(true);
            });

            scope.$on('destroy', function() {
                setFocused(false);
            });
        }
    }
});

app.controller('directiveBlockController', function($scope, $sce, $compile, $timeout, directiveService) {
    var foundDirective;

    // helper functions
    var determineActiveDirective = function() {
        var dirEl = $scope.previewElement[0].firstElementChild,
            tagName = dirEl && dirEl.tagName.toLowerCase();
        $scope.activeDirective = $scope.directives.find(function(d) {
            foundDirective = d.tagName === tagName;
            return foundDirective;
        }) || $scope.directives[0];
    };

    var previewHtml = function() {
        $scope.previewElement.html($sce.trustAsHtml($scope.code).toString());
        $compile($scope.previewElement.contents())($scope.$parent);
    };

    // scope functions
    $scope.toggleMode = function() {
        $scope.showCode = !$scope.showCode;
    };

    $scope.delete = function() {
        $scope.$emit('deleteDirective', $scope.index);
    };

    $scope.escape = function() {
        $timeout(function() {
            $scope.$emit('escapeDirective', $scope.index);
        });
    };

    // event handlers
    $scope.$watch('activeDirective', function() {
        if (!$scope.activeDirective) return;
        if (foundDirective) return foundDirective = false;
        $scope.code = $scope.activeDirective.code;
        previewHtml();
    });
    
    $scope.$watch('code', function() {
        $scope.html = $sce.trustAsHtml($scope.code).toString();
    });
    
    $scope.$watch('showCode', function() {
        if ($scope.showCode || !$scope.previewElement) return;
        previewHtml();
        if (!$scope.activeDirective) determineActiveDirective();
    });

    // initialization
    $scope.directives = directiveService.availableDirectives;
    $scope.showCode = false;
    $scope.code = $scope.$parent.directiveSources[$scope.index];
});