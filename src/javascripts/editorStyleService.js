editor.service('editorStyleService', function($sce, editorHtmlService) {
    var service = this,
        h = editorHtmlService;

    this.styles = [{
        label: 'Paragraph',
        preview: '<p>Paragraph</p>',
        apply: function(editorElement) {
            h.clearFormatting(editorElement);
        }
    }, {
        label: 'Heading 1',
        preview: '<h1>Heading 1</h1>',
        apply: function(editorElement) {
            h.applyHeader('H1', editorElement);
        }
    }, {
        label: 'Heading 2',
        preview: '<h2>Heading 2</h2>',
        apply: function(editorElement) {
            h.applyHeader('H2', editorElement);
        }
    }, {
        label: 'Heading 3',
        preview: '<h3>Heading 3</h3>',
        apply: function(editorElement) {
            h.applyHeader('H3', editorElement);
        }
    }, {
        label: 'Heading 4',
        preview: '<h4>Heading 4</h4>',
        apply: function(editorElement) {
            h.applyHeader('H4', editorElement);
        }
    }, {
        label: 'Custom Style 1',
        preview: '<span class="custom-style-1">Custom Style 1</span>',
        apply: function(editorElement) {
            h.applyInlineClass('custom-style-1', editorElement);
        }
    }];

    this.trustStyles = function() {
        service.styles.forEach(function(style) {
            style.preview = $sce.trustAsHtml(style.preview);
        });
    };
});