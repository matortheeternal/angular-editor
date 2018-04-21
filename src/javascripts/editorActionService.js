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
            callback: function() {
                selectionService.wrapSelectionInTag('b');
            }
        }, {
            title: 'Italic',
            display: 'button',
            class: 'fa fa-italic',
            callback: function() {
                selectionService.wrapSelectionInTag('i');
            }
        }, {
            title: 'Underline',
            display: 'button',
            class: 'fa fa-underline',
            callback: function() {
                selectionService.wrapSelectionInTag('u');
            }
        }, {
            title: 'Strikethrough',
            display: 'button',
            class: 'fa fa-strikethrough',
            callback: function() {
                selectionService.wrapSelectionInTag('s');
            }
        }, {
            title: 'Unordered list',
            display: 'button',
            class: 'fa fa-list-ul',
            callback: function() {
                // TODO
                //selectionService.wrapSelectionInTag('ul');
            }
        }, {
            title: 'Ordered list',
            display: 'button',
            class: 'fa fa-list-ol',
            callback: function() {
                // TODO
                //selectionService.wrapSelectionInTag('ol');
            }
        }, {
            title: 'Undo',
            display: 'button',
            class: 'fa fa-undo',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Redo',
            display: 'button',
            class: 'fa fa-repeat',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
            callback: function() {
                // TODO
            }
        }]
    };

    var alignmentGroup = {
        actions: [ {
            title: 'Align left',
            display: 'button',
            class: 'fa fa-align-left',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
            callback: function() {
                // TODO
            }
        }]
    };

    var specialGroup = {
        actions: [{
            title: 'Toggle HTML / Rich Text',
            display: 'button',
            class: 'fa fa-code',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Insert image',
            display: 'button',
            class: 'fa fa-image',
            callback: function() {
                // TODO
            }
        }, {
            title: 'Insert / edit link',
            display: 'button',
            class: 'fa fa-link',
            callback: function() {
                // TODO
            }
        },  {
            title: 'Insert video',
            display: 'button',
            class: 'fa fa-youtube-play',
            callback: function() {
                // TODO
            }
        },{
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            callback: function() {
                // TODO
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});