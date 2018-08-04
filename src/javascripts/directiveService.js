app.service('directiveService', function() {
    this.availableDirectives = [{
        name: 'Test Directive',
        tagName: 'test-directive',
        code: '<test-directive text="">\n  <p>Transcluded content here</p>\n</test-directive>'
    }, {
        name: 'YouTube',
        tagName: 'youtube',
        code: '<youtube video-id="p8rC_pLvzXg"></youtube>'
    }];
});