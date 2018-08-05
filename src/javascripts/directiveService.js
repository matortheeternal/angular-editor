app.service('directiveService', function() {
    this.availableDirectives = [{
        name: 'Test Directive',
        tagName: 'editor-test-directive',
        code: '<editor-test-directive text="">\n  <p>Transcluded content here</p>\n</editor-test-directive>'
    }, {
        name: 'YouTube',
        tagName: 'youtube',
        code: '<youtube video-id="p8rC_pLvzXg"></youtube>'
    }];
});