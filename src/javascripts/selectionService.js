app.service('selectionService', function() {
    var forEachRange = function(callback) {
        var sel = window.getSelection();
        for (var i = 0; sel.rangeCount; i++) {
            callback(sel.getRangeAt[i]);
        }
    };

    var isChildOfTag = function(node, tagName) {
        return node.parentElement.tagName === tagName;
    };

    var rangeIsContainedInTag = function(range, tagName) {
        return isChildOfTag(range.startContainer, tagName) &&
            isChildOfTag(range.endContainer, tagName);
    };

    this.wrapSelectionInTag = function(tagName) {
        forEachRange(function(range) {
            /*var startInTag = isChildOfTag(range.startContainer, tagName),
                endInTag = isChildOfTag(range.endContainer, tagName);
            if (startInTag && endInTag) return;
            if (!startInTag) {

            }*/
            var newNode = document.createElement(tagName);
            newNode.appendChild(range.extractContent());
            range.insertNode(newNode);
        });
    };
});