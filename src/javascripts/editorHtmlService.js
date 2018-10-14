editor.service('editorHtmlService', function(editorSelectionService, editorHtmlHelpers) {
    var h = editorHtmlHelpers,
        s = editorSelectionService,
        headerTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

    var INDENT_SIZE = 40,
        MAX_INDENT = 400;

    var parsePixels = function(str) {
        if (str.slice(-2) === 'px')
            return parseInt(str.slice(0, -2));
        return 0;
    };

    this.applyTag = function(tagName, editorElement) {
        var groups = s.getSelections(editorElement),
            anyNotInTag = false,
            test = h.tagNameTest([tagName]);
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = h.getAncestorTag(s.node, editorElement, test);
                if (!s.target) anyNotInTag = true;
            });
        });
        var method = anyNotInTag ? h.wrap : h.unwrap;
        var newTags = method(groups, tagName, editorElement);
        s.select(groups);
        return newTags;
    };

    this.applyBlockStyle = function(style, editorElement) {
        var groups = s.getSelections(editorElement),
            isBlockTag = h.tagNameTest(['DIV', 'P', 'UL', 'OL']);
        groups.forEach(function(g) {
            g.block = h.getAncestorTag(g.ancestor, editorElement, isBlockTag);
        });
        h.unique(groups, 'block').forEach(function(g) {
            h.applyStyle(g.block, style);
        });
    };

    this.applyInlineStyle = function(style, editorElement) {
        var groups = s.getSelections();
        // TODO
    };

    this.applyList = function(tagName, editorElement) {
        var groups = s.getSelections(editorElement),
            anyNotInList = false,
            isBlockTag = h.tagNameTest(['DIV', 'P', 'UL', 'OL', 'LI']);
        groups.forEach(function(g) {
            g.block = h.getAncestorTag(g.ancestor, editorElement, isBlockTag);
            g.list = h.getAncestorTag(g.ancestor, editorElement, h.isListTag);
            if (!g.list || g.list.tagName !== tagName) anyNotInList = true;
        });
        var method = anyNotInList ? h.wrapList : h.unwrapList;
        method(groups, tagName, editorElement);
    };

    this.indent = function(editorElement) {
        service.applyBlockStyle(function(tag) {
            var oldIndent = parsePixels(tag.paddingLeft),
                newIndent = Math.max(oldIndent + INDENT_SIZE, MAX_INDENT);
            tag.paddingLeft = newIndent + 'px';
        }, editorElement);
    };

    this.dedent = function(editorElement) {
        service.applyBlockStyle(function(tag) {
            var oldIndent = parsePixels(tag.paddingLeft),
                newIndent = Math.min(oldIndent - INDENT_SIZE, 0);
            tag.paddingLeft = newIndent + 'px';
        }, editorElement);
    };

    this.applyHeader = function(tagName, editorElement) {
        var groups = s.getSelections(editorElement),
            isBlockTag = h.tagNameTest(['P']),
            isHeaderTag = h.tagNameTest(headerTagNames);
        groups.forEach(function(g) {
            g.tag = h.getAncestorTag(g.ancestor, editorElement, isHeaderTag) ||
                h.getAncestorTag(g.ancestor, editorElement, isBlockTag) ||
                (g.ancestor && h.isTextNode(g.ancestor));
        });
        h.unique(groups, 'tag').forEach(function(g) {
            if (!g.tag) return;
            h.createHeader(tagName, g.tag);
        });
    };

    this.getSelectedTag = function(tagName, editorElement) {
        var groups = s.getSelections(editorElement),
            test = h.tagNameTest([tagName]);
        for (var i = 0; i < groups.length; i++) {
            var g = groups[i],
                tag = h.getAncestorTag(g.ancestor, editorElement, test);
            if (tag) return tag;
            if (g.ancestor.tagName === tagName) return g.ancestor;
            for (var j = 0; j < g.selections.length; j++) {
                var sel = g.selections[j];
                if (sel.node.tagName === tagName) return sel.node;
            }
        }
    };

    this.insert = function(tagName, editorElement) {
        var groups = s.getSelections(editorElement);
        if (groups.length === 0) return;
        var refElement = h.deleteSelection(groups, editorElement),
            newElement = document.createElement(tagName);
        h.insertAfter(refElement, newElement);
        return newElement;
    };

    this.clearFormatting = function(editorElement) {
        var groups = s.getSelections(editorElement);
        // TODO: extract text from non-P tags
    };
});