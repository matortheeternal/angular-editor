app.service('editorActionService', function(editorStyleService) {
    var styleGroup = {
        actions: [{
            display: 'dropdown',
            class: 'style-dropdown',
            options: editorStyleService.styles
        }]
    };

    var formatGroup = {
        actions: [{
            display: 'button',
            class: 'fa fa-bold',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-italic',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-underline',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-strikethrough',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-strikethrough',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-list-ul',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-list-ol',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-undo',
            callback: function(selection) {
                // TODO
            }
        }, {
            display: 'button',
            class: 'fa fa-redo',
            callback: function(selection) {
                // TODO
            }
        }, {
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