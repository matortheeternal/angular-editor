app.service('editorActionService', function(editorStyleService, selectionService) {
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
            callback: function(editorElement) {
                selectionService.applyTag('B', editorElement);
            }
        }, {
            title: 'Italic',
            display: 'button',
            class: 'fa fa-italic',
            callback: function(editorElement) {
                selectionService.applyTag('I', editorElement);
            }
        }, {
            title: 'Underline',
            display: 'button',
            class: 'fa fa-underline',
            callback: function(editorElement) {
                selectionService.applyTag('U', editorElement);
            }
        }, {
            title: 'Strikethrough',
            display: 'button',
            class: 'fa fa-strikethrough',
            callback: function(editorElement) {
                selectionService.applyTag('S', editorElement);
            }
        }, {
            title: 'Unordered list',
            display: 'button',
            class: 'fa fa-list-ul',
            callback: function(editorElement) {
                // TODO
                //selectionService.wrapSelectionInTag('ul');
            }
        }, {
            title: 'Ordered list',
            display: 'button',
            class: 'fa fa-list-ol',
            callback: function(editorElement) {
                // TODO
                //selectionService.wrapSelectionInTag('ol');
            }
        }, {
            title: 'Undo',
            display: 'button',
            class: 'fa fa-undo',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Redo',
            display: 'button',
            class: 'fa fa-repeat',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
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
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
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
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Insert image',
            display: 'button',
            class: 'fa fa-image',
            callback: function(editorElement) {
                // TODO
            }
        }, {
            title: 'Insert / edit link',
            display: 'button',
            class: 'fa fa-link',
            callback: function(editorElement) {
                // TODO
            }
        },  {
            title: 'Insert video',
            display: 'button',
            class: 'fa fa-youtube-play',
            callback: function(editorElement) {
                // TODO
            }
        },{
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            callback: function(editorElement) {
                // TODO
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});