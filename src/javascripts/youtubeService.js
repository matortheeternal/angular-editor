app.service('youtubeService', function() {
    var youTubeExpr = /youtube.com\/watch\?v=(\w+)/i;

    this.extractVideoId = function(url) {
        var match = url.match(youTubeExpr);
        return match && match[1];
    };
});