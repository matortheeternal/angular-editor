app.service('editorStyleService', function($sce) {
    var service = this;

    this.styles = [{
        label: 'Paragraph',
        preview: '<p>Paragraph</p>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 1',
        preview: '<h1>Heading 1</h1>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 2',
        preview: '<h2>Heading 2</h2>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 3',
        preview: '<h3>Heading 3</h3>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 4',
        preview: '<h4>Heading 4</h4>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 5',
        preview: '<h5>Heading 5</h5>',
        apply: function(selection) {
            // TODO
        }
    }, {
        label: 'Heading 6',
        preview: '<h6>Heading 6</h6>',
        apply: function(selection) {
            // TODO
        }
    }];

    // TODO: Add code and quote styles?
    this.trustStyles = function() {
        service.styles.forEach(function(style) {
            style.preview = $sce.trustAsHtml(style.preview);
        });
    };
});