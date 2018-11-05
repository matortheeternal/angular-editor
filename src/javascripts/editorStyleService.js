editor.service('editorStyleService', function($sce, editorHtmlService, editorHtmlHelpers) {
    var service = this,
        h = editorHtmlService;

    this.styles = [{
        label: 'Paragraph',
        preview: '<p>Paragraph</p>',
        apply: function(editorElement) {
            h.clearFormatting(editorElement);
        }
    }];

    this.trustStyles = function() {
        service.styles.forEach(function(style) {
            style.preview = $sce.trustAsHtml(style.preview);
        });
    };

    this.addHeaderStyle = function(level) {
        var tagName = 'H' + level,
            label = 'Heading ' + level;
        service.styles.push({
            label: label,
            preview: '<' + tagName + '>' + label  + '</' + tagName + '>',
            test: editorHtmlHelpers.tagNameTest([tagName]),
            apply: function(editorElement) {
                h.applyHeader(tagName, editorElement);
            }
        });
    };

    this.addBlockClassStyle = function(name, klass) {
        service.styles.push({
            label: name,
            preview: '<div class="' + klass + '">' + name + '</div>',
            test: function(node) {
                return node.tagName === 'DIV' &&
                    node.classList.contains(klass)
            },
            apply: function(editorElement) {
                h.applyBlockClass(klass, editorElement);
            }
        });
    };

    this.addInlineClassStyle = function(name, klass) {
        service.styles.push({
            label: name,
            preview: '<span class="' + klass + '">' + name + '</span>',
            test: function(node) {
                return node.tagName === 'SPAN' &&
                    node.classList.contains(klass)
            },
            apply: function(editorElement) {
                h.applyInlineClass(klass, editorElement);
            }
        });
    };
});