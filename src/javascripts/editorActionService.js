app.service('editorActionService', function(editorStyleService, htmlService) {
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
        }, {
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
        }, {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
            hotkey: 'Ctrl + Del',
            callback: function(editorElement) {
                // TODO
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
                // TODO
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            hotkey: 'Ctrl + Shift + C',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            hotkey: 'Ctrl + Shift + R',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            hotkey: 'Ctrl + Shift + J',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            hotkey: 'Tab', // NOTE: ignore if additional modifiers pressed
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
            hotkey: 'Shift + Tab', // NOTE: ignore if additional modifiers pressed
            callback: function(editorElement) {
                // TODO
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
            title: 'Insert image',
            display: 'button',
            class: 'fa fa-image',
            hotkey: 'Ctrl + I',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Insert / edit link',
            display: 'button',
            class: 'fa fa-link',
            hotkey: 'Ctrl + K',
            callback: function(editorElement) {
                // TODO
            }
        },  {
            title: 'Insert video',
            display: 'button',
            class: 'fa fa-youtube-play',
            hotkey: 'Ctrl + Alt + V',
            callback: function(editorElement) {
                // TODO
            }
        },{
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            hotkey: 'Ctrl + Alt + T',
            callback: function(editorElement) {
                // TODO
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});