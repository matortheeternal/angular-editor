app.service('editorActionService', function(editorStyleService, htmlService, selectionService, youtubeService) {
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
            callback: function(editorElement) {
                htmlService.applyTag('B', editorElement);
                return true;
            }
        }, {
            title: 'Italic',
            display: 'button',
            class: 'fa fa-italic',
            hotkey: 'Ctrl + I',
            callback: function(editorElement) {
                htmlService.applyTag('I', editorElement);
                return true;
            }
        }, {
            title: 'Underline',
            display: 'button',
            class: 'fa fa-underline',
            hotkey: 'Ctrl + U',
            callback: function(editorElement) {
                htmlService.applyTag('U', editorElement);
                return true;
            }
        }, {
            title: 'Strikethrough',
            display: 'button',
            class: 'fa fa-strikethrough',
            // Ctrl + S saves page and Ctrl + T opens new tab in browser
            hotkey: 'Ctrl + Alt + T',
            callback: function(editorElement) {
                htmlService.applyTag('S', editorElement);
                return true;
            }
        }, {
            title: 'Unordered list',
            display: 'button',
            class: 'fa fa-list-ul',
            hotkey: 'Ctrl + -',
            callback: function(editorElement) {
                htmlService.applyList('UL', editorElement);
                return true;
            }
        }, {
            title: 'Ordered list',
            display: 'button',
            class: 'fa fa-list-ol',
            hotkey: 'Ctrl + 1',
            callback: function(editorElement) {
                htmlService.applyList('OL', editorElement);
                return true;
            }
        }, /*{
            title: 'Undo',
            display: 'button',
            class: 'fa fa-undo',
            hotkey: 'Ctrl + Z',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Redo',
            display: 'button',
            class: 'fa fa-repeat',
            hotkey: 'Ctrl + Shift + Z',
            callback: function(editorElement) {
                // TODO
            }
        },*/ {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
            hotkey: 'Ctrl + Del',
            callback: function(editorElement) {
                htmlService.clearFormatting(editorElement);
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
            callback: function(editorElement) {
                htmlService.applyBlockStyle({
                    "text-align": "left"
                }, editorElement);
                return true;
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            hotkey: 'Ctrl + Shift + C',
            callback: function(editorElement) {
                htmlService.applyBlockStyle({
                    "text-align": "center"
                }, editorElement);
                return true;
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            hotkey: 'Ctrl + Shift + R',
            callback: function(editorElement) {
                htmlService.applyBlockStyle({
                    "text-align": "right"
                }, editorElement);
                return true;
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            hotkey: 'Ctrl + Shift + J',
            callback: function(editorElement) {
                htmlService.applyBlockStyle({
                    "text-align": "justify"
                }, editorElement);
                return true;
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            hotkey: 'Tab',
            callback: function(editorElement) {
                htmlService.indent(editorElement);
                return true;
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
            hotkey: 'Shift + Tab',
            callback: function(editorElement) {
                htmlService.dedent(editorElement);
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
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Insert / edit image',
            display: 'button',
            class: 'fa fa-image',
            hotkey: 'Ctrl + I',
            callback: function(editorEl, scope) {
                selectionService.store(editorEl);
                var imgTag = htmlService.getSelectedTag('IMG', editorEl);
                scope.$emit('insertImage', imgTag, function(url) {
                    if (!imgTag) imgTag = htmlService.insert('img');
                    selectionService.clearStore();
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
            callback: function(editorEl, scope) {
                selectionService.store(editorEl);
                var aTag = htmlService.getSelectedTag('A', editorEl);
                scope.$emit('insertLink', aTag, function(url) {
                    if (aTag) return aTag.setAttribute('href', url);
                    var tags = htmlService.applyTag('a', editorEl);
                    selectionService.clearStore();
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
            callback: function(editorEl, scope) {
                selectionService.store(editorEl);
                scope.$emit('insertVideo', null, function(url) {
                    var vid = youtubeService.extractVideoId(url);
                    if (!vid) return selectionService.clearStore();
                    var source = '<youtube video-id="' + vid + '"></youtube>';
                    scope.addDirective(source);
                    selectionService.clearStore();
                });
                return true;
            }
        }, {
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            hotkey: 'Ctrl + Alt + T',
            callback: function(editorEl, scope) {
                scope.addDirective('');
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});