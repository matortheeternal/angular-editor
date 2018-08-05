app.service('editorModalService', function() {
    this.bind = function(scope) {
        var openUrlModal = function(name, tag, options) {
            scope.modalOptions = Object.assign({
                label: (tag ? 'Edit ' : 'Insert ') + name,
                class: 'edit-' + name + '-modal',
                tag: tag
            }, options);
        };

        scope.$on('insertLink', function(e, tag, apply) {
            if (scope.customModals) return;
            e.stopPropagation();
            openUrlModal('link', tag, {
                apply: apply,
                url: tag ? tag.href : ''
            });
        });

        scope.$on('insertVideo', function(e, tag, apply) {
            if (scope.customModals) return;
            e.stopPropagation();
            openUrlModal('video', tag, {
                apply: apply,
                url: tag ? tag.url : ''
            });
        });

        scope.$on('insertImage', function(e, tag, apply) {
            if (scope.customModals) return;
            e.stopPropagation();
            openUrlModal('image', tag, {
                apply: apply,
                url: tag ? tag.src : ''
            });
        });

        scope.$on('closeModal', function(e) {
            if (scope.customModals) return;
            e.stopPropagation();
            delete scope.modalOptions;
        });

        scope.$on('applyUrl', function(e) {
            if (scope.customModals) return;
            e.stopPropagation();
            scope.modalOptions.apply(scope.modalOptions.url);
            delete scope.modalOptions;
        });
    };
});