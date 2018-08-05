editor.service('editorActionService', function(editorStyleService, editorHtmlService, editorSelectionService) {
    var h = editorHtmlService,
        s = editorSelectionService,
        youTubeExpr = /youtube.com\/watch\?v=(\w+)/i;

    var extractVideoId = function(url) {
        var match = url.match(youTubeExpr);
        return match && match[1];
    };

    var styleGroup = {
        actions: [{
            title: 'Style',
            display: 'dropdown',
            class: 'style-dropdown',
            options: editorStyleService.styles
        }]
    };

    var formatGroup = {
        actions: [{
            title: 'Bold',
            display: 'button',
            class: 'fa fa-bold',
            hotkey: 'Ctrl + B',
            callback: function(editor) {
                h.applyTag('B', editor);
                return true;
            }
        }, {
            title: 'Italic',
            display: 'button',
            class: 'fa fa-italic',
            hotkey: 'Ctrl + I',
            callback: function(editor) {
                h.applyTag('I', editor);
                return true;
            }
        }, {
            title: 'Underline',
            display: 'button',
            class: 'fa fa-underline',
            hotkey: 'Ctrl + U',
            callback: function(editor) {
                h.applyTag('U', editor);
                return true;
            }
        }, {
            title: 'Strikethrough',
            display: 'button',
            class: 'fa fa-strikethrough',
            // Ctrl + S saves page and Ctrl + T opens new tab in browser
            hotkey: 'Ctrl + Alt + T',
            callback: function(editor) {
                h.applyTag('S', editor);
                return true;
            }
        }, {
            title: 'Unordered list',
            display: 'button',
            class: 'fa fa-list-ul',
            hotkey: 'Ctrl + -',
            callback: function(editor) {
                h.applyList('UL', editor);
                return true;
            }
        }, {
            title: 'Ordered list',
            display: 'button',
            class: 'fa fa-list-ol',
            hotkey: 'Ctrl + 1',
            callback: function(editor) {
                h.applyList('OL', editor);
                return true;
            }
        }, /*{
            title: 'Undo',
            display: 'button',
            class: 'fa fa-undo',
            hotkey: 'Ctrl + Z',
            callback: function(editor) {
                // TODO
            }
        }, {
            title: 'Redo',
            display: 'button',
            class: 'fa fa-repeat',
            hotkey: 'Ctrl + Shift + Z',
            callback: function(editor) {
                // TODO
            }
        },*/ {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
            hotkey: 'Ctrl + Del',
            callback: function(editor) {
                h.clearFormatting(editor);
                return true;
            }
        }]
    };

    var alignmentGroup = {
        actions: [ {
            title: 'Align left',
            display: 'button',
            class: 'fa fa-align-left',
            hotkey: 'Ctrl + Shift + L',
            callback: function(editor) {
                h.applyBlockStyle({
                    "text-align": "left"
                }, editor);
                return true;
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            hotkey: 'Ctrl + Shift + C',
            callback: function(editor) {
                h.applyBlockStyle({
                    "text-align": "center"
                }, editor);
                return true;
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            hotkey: 'Ctrl + Shift + R',
            callback: function(editor) {
                h.applyBlockStyle({
                    "text-align": "right"
                }, editor);
                return true;
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            hotkey: 'Ctrl + Shift + J',
            callback: function(editor) {
                h.applyBlockStyle({
                    "text-align": "justify"
                }, editor);
                return true;
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            hotkey: 'Tab',
            callback: function(editor) {
                h.indent(editor);
                return true;
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
            hotkey: 'Shift + Tab',
            callback: function(editor) {
                h.dedent(editor);
                return true;
            }
        }]
    };

    var specialGroup = {
        actions: [{
            title: 'Toggle HTML / Rich Text',
            display: 'button',
            class: 'fa fa-code',
            hotkey: 'Ctrl + ~',
            enabled: true,
            callback: function(editor, scope) {
                scope.showCode = !scope.showCode;
            }
        }, {
            title: 'Insert / edit image',
            display: 'button',
            class: 'fa fa-image',
            hotkey: 'Ctrl + I',
            callback: function(editor, scope) {
                s.store(editor);
                var imgTag = h.getSelectedTag('IMG', editor);
                scope.$emit('insertImage', imgTag, function(url) {
                    if (!imgTag) imgTag = h.insert('img');
                    s.clearStore();
                    imgTag.setAttribute('src', url);
                    imgTag.setAttribute('tabindex', '0');
                });
                return true;
            }
        }, {
            title: 'Insert / edit link',
            display: 'button',
            class: 'fa fa-link',
            hotkey: 'Ctrl + K',
            callback: function(editor, scope) {
                s.store(editor);
                var aTag = h.getSelectedTag('A', editor);
                scope.$emit('insertLink', aTag, function(url) {
                    if (aTag) return aTag.setAttribute('href', url);
                    var tags = h.applyTag('a', editor);
                    s.clearStore();
                    tags.forEach(function(tag) {
                        tag.setAttribute('href', url);
                    });
                });
                return true;
            }
        }, {
            title: 'Insert / edit video',
            display: 'button',
            class: 'fa fa-youtube-play',
            hotkey: 'Ctrl + Alt + V',
            callback: function(editor, scope) {
                s.store(editor);
                scope.$emit('insertVideo', null, function(url) {
                    var vid = extractVideoId(url);
                    if (!vid) return s.clearStore();
                    var source = '<youtube video-id="' + vid + '"></youtube>';
                    scope.addDirective(source);
                    s.clearStore();
                });
                return true;
            }
        }, {
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            hotkey: 'Ctrl + Alt + T',
            callback: function(editor, scope) {
                scope.addDirective('');
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});