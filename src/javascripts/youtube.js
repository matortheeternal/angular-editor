app.directive('youtube', function($sce) {
    var defaultYouTubeWidth = 854;
    var defaultYouTubeHeight = 480;
    var ytEmbedUrl = 'https://www.youtube.com/embed/';

    return {
        restrict: 'E',
        scope: true,
        templateUrl: '/partials/youtube.html',
        link: function(scope, element, attrs) {
            var url = ytEmbedUrl + attrs.videoId + '?rel=0';
            scope.url = $sce.trustAsResourceUrl(url);
            scope.width = attrs.width || defaultYouTubeWidth;
            scope.height = attrs.height || defaultYouTubeHeight;
        }
    }
});