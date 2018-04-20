app.directive('directiveBlock', function() {
    return {
        restrict: 'E',
        templateUrl: '../partials/directiveBlock.html',
        scope: true,
        controller: 'directiveBlockController',
        link: function(scope, element) {
            element[0].setAttribute('contenteditable', 'false');
        }
    }
});

app.controller('directiveBlockController', function($scope, $element, $sce, $compile, $timeout) {
    var previewElement;
    $scope.code = '';
    $scope.directives = $scope.$parent.allowedDirectives;
    $scope.showCode = true;

    // helper functions
    var findPreviewElement = function() {
        previewElement = $element[0].lastElementChild.firstElementChild;
    };

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
        if ($scope.showCode || !previewElement) return;
        var e = angular.element(previewElement);
        e.html($sce.trustAsHtml($scope.code).toString());
        $compile(e.contents())($scope.$parent);
    });

    // initialization
    $timeout(findPreviewElement);
});