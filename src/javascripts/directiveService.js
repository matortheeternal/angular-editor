editor.service('directiveService', function() {
    var service = this;

    this.availableDirectives = [{
        name: 'YouTube',
        tagName: 'youtube',
        code: '<youtube video-id="p8rC_pLvzXg"></youtube>'
    }];

    this.buildDirectiveExpr = function() {
        var tagNames = service.availableDirectives.map(function(dir) {
            return dir.tagName;
        });
        return new RegExp('<(' + tagNames.join('|') + ')[\\s\\S]*?<\\/\\1>', 'g');
    };
});