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
                // TODO: Clear formatting
            }
        }]
    };

    var alignmentGroup = {
        actions: [] // TODO
    };

    var specialGroup = {
        actions: [] // TODO
    };

    this.groups = [styleGroup, formatGroup, alignmentGroup, specialGroup];
});