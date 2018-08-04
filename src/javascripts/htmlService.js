app.service('htmlService', function(selectionService, htmlHelpers) {
    var h = htmlHelpers,
        listTagNames = ['OL', 'UL'],
        headerTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

    var isListTag = h.tagNameTest(listTagNames);

    var unique = function(a, key) {
        return a.reduce(function(newArray, item) {
            var value = item[key],
                match = newArray.find(function(item) {
                    return item[key] === value;
                });
            if (!match) newArray.push(item);
            return newArray;
        }, []);
    };

    this.applyTag = function(tagName, editorElement) {
        var groups = selectionService.getSelections(editorElement),
            anyNotInTag = false,
            test = h.tagNameTest([tagName]);
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = h.getAncestorTag(s.node, editorElement, test);
                if (!s.target) anyNotInTag = true;
            });
        });
        var method = anyNotInTag ? h.wrap : h.unwrap;
        return method(groups, tagName, editorElement);
    };

    this.applyBlockStyle = function(style, editorElement) {
        var groups = selectionService.getSelections(editorElement),
            isBlockTag = h.tagNameTest(['DIV', 'P', 'UL', 'OL']);
        groups.forEach(function(g) {
            g.block = h.getAncestorTag(g.ancestor, editorElement, isBlockTag);
        });
        unique(groups, 'block').forEach(function(g) {
            h.applyStyle(g.block, style);
        });
    };

    this.applyInlineStyle = function(style, editorElement) {
        var groups = selectionService.getSelections();
        // TODO
    };

    this.applyList = function(tagName, editorElement) {
        var groups = selectionService.getSelections(editorElement),
            anyNotInList = false,
            isBlockTag = h.tagNameTest(['DIV', 'P', 'UL', 'OL', 'LI']);
        groups.forEach(function(g) {
            g.block = h.getAncestorTag(g.ancestor, editorElement, isBlockTag);
            g.list = h.getAncestorTag(g.ancestor, editorElement, isListTag);
            if (!g.list || g.list.tagName !== tagName) anyNotInList = true;
        });
        var method = anyNotInList ? h.wrapList : h.unwrapList;
        method(groups, tagName, editorElement);
    };

    this.indent = function(editorElement) {
        // TODO
    };

    this.dedent = function(editorElement) {
        // TODO
    };

    this.applyHeader = function(tagName, editorElement) {
        var groups = selectionService.getSelections(editorElement),
            isBlockTag = h.tagNameTest(['P']),
            isHeaderTag = h.tagNameTest(headerTagNames);
        groups.forEach(function(g) {
            g.tag = h.getAncestorTag(g.ancestor, editorElement, isHeaderTag) ||
                h.getAncestorTag(g.ancestor, editorElement, isBlockTag) ||
                (g.ancestor && h.isTextNode(g.ancestor));
        });
        unique(groups, 'tag').forEach(function(g) {
            if (!g.tag) return;
            h.createHeader(tagName, g.tag);
        });
    };

    this.getSelectedTag = function(tagName, editorElement) {
        var groups = selectionService.getSelections(editorElement);
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i];
            if (g.ancestor.tagName === tagName) return g.ancestor;
            for (var j = 0; j < g.selections.length; j++) {
                var s = g.selections[j];
                if (s.node.tagName === tagName) return s.node;
            }
        }
    };

    this.insert = function(tagName, editorElement) {
        var groups = selectionService.getSelections(editorElement);
        if (groups.length === 0) return;
        var refElement = h.deleteSelection(groups),
            newElement = document.createElement(tagName);
        h.insertAfter(refElement, newElement);
        return newElement;
    };

    this.clearFormatting = function(editorElement) {
        var groups = selectionService.getSelections(editorElement);
        // TODO: extract text nodes and put them in paragraph elements
    };
});