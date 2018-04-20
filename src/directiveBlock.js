app.directive('directiveBlock', function() {
    return {
        restrict: 'E',
        templateUrl: '../partials/directiveBlock.html',
        scope: {
            code: '=?'
        },
        controller: 'directiveBlockController',
        link: function(scope, element) {
            element[0].setAttribute('contenteditable', 'false');
        }
    }
});

app.controller('directiveBlockController', function($scope, $element, $sce, $compile) {
    if (!$scope.code) $scope.code = '';
    $scope.directives = $scope.$parent.allowedDirectives;
    $scope.showCode = true;

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