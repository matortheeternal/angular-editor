app.service('editorActionService', function(editorStyleService) {
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
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Italic',
            display: 'button',
            class: 'fa fa-italic',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Underline',
            display: 'button',
            class: 'fa fa-underline',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Strikethrough',
            display: 'button',
            class: 'fa fa-strikethrough',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Unordered list',
            display: 'button',
            class: 'fa fa-list-ul',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Ordered list',
            display: 'button',
            class: 'fa fa-list-ol',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Undo',
            display: 'button',
            class: 'fa fa-undo',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Redo',
            display: 'button',
            class: 'fa fa-repeat',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Clear formatting',
            display: 'button',
            class: 'fa fa-ban',
            callback: function(selection) {
                // TODO
            }
        }]
    };

    var alignmentGroup = {
        actions: [ {
            title: 'Align left',
            display: 'button',
            class: 'fa fa-align-left',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Align center',
            display: 'button',
            class: 'fa fa-align-center',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Align right',
            display: 'button',
            class: 'fa fa-align-right',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Justify',
            display: 'button',
            class: 'fa fa-align-justify',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Increase indent',
            display: 'button',
            class: 'fa fa-indent',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Decrease indent',
            display: 'button',
            class: 'fa fa-dedent',
            callback: function(selection) {
                // TODO
            }
        }]
    };

    var specialGroup = {
        actions: [{
            title: 'Toggle HTML / Rich Text',
            display: 'button',
            class: 'fa fa-code',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Insert image',
            display: 'button',
            class: 'fa fa-image',
            callback: function(selection) {
                // TODO
            }
        }, {
            title: 'Insert / edit link',
            display: 'button',
            class: 'fa fa-link',
            callback: function(selection) {
                // TODO
            }
        },  {
            title: 'Insert video',
            display: 'button',
            class: 'fa fa-youtube-play',
            callback: function(selection) {
                // TODO
            }
        },{
            title: 'Insert template',
            display: 'button',
            class: 'fa fa-cube',
            callback: function(selection) {
                // TODO
            }
        }]
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});