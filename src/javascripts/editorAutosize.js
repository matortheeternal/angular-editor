editor.directive('editorAutosize', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            var el = element[0];

            var resize = function() {
                el.style.height = 'auto';
                el.style.height = (el.scrollHeight) + 'px';
            };

            el.addEventListener('input', resize);
            scope.$on('resizeTextArea', function() {
                $timeout(resize);
            });
        }
    }
});