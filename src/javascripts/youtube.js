editor.directive('youtube', function($sce) {
    var defaultYouTubeWidth = 854,
        defaultYouTubeHeight = 480,
        ytEmbedUrl = 'https://www.youtube.com/embed/';

    return {
        restrict: 'E',
        scope: true,
        template: '<iframe width="{{::width}}" height="{{::height}}" ng-src="{{::url}}" frameborder="0" allow="encrypted-media" allowfullscreen></iframe>',
        link: function(scope, element, attrs) {
            var url = ytEmbedUrl + attrs.videoId + '?rel=0';
            scope.url = $sce.trustAsResourceUrl(url);
            scope.width = attrs.width || defaultYouTubeWidth;
            scope.height = attrs.height || defaultYouTubeHeight;
        }
    }
});