app.service('htmlService', function(selectionService) {
    var listTagNames = ['OL', 'UL'];

    var combineTag = function(html, sibling, tagName, method) {
        if (!sibling || sibling.tagName !== tagName) return;
        html[method](sibling.innerHTML);
        sibling.remove();
    };

    var createTextNode = function(node, start, end) {
        var text = node.substringData(start, end);
        return document.createTextNode(text);
    };

    var wrap = function(groups, tagName) {
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                if (s.node.nodeType !== 3) return;
                if (s.target) return;
                var len = s.node.length,
                    start = s.start || 0,
                    end = s.end || len,
                    newNode = document.createElement(tagName),
                    f = document.createDocumentFragment(),
                    html = [s.node.substringData(start, end - start)];
                if (start === 0)
                    combineTag(html, s.node.previousSibling, tagName, 'unshift');
                if (end === len)
                    combineTag(html, s.node.nextSibling, tagName, 'push');
                if (start > 0) f.appendChild(createTextNode(s.node, 0, start));
                newNode.innerHTML = html.join('');
                newNode.normalize();
                f.appendChild(newNode);
                if (end < len) f.appendChild(createTextNode(s.node, end, len));
                s.node.replaceWith(f);
            });
        });
    };

    var unwrap = function(groups, tagName, editorElement) {
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                var p = s.target.parentNode;
                if (!p) return;
                // TODO: Handle partial unwrapping
                if (p === editorElement) {
                    var e = document.createElement('p');
                    e.innerHTML = s.target.innerHTML;
                    s.target.replaceWith(e);
                } else {
                    var f = document.createDocumentFragment();
                    for (var i = 0; i < s.target.childNodes.length; i++)
                        f.appendChild(s.target.childNodes[i]);
                    s.target.replaceWith(f);
                    p.normalize();
                }
            });
        });
    };

    var appendListItem = function(listElement, item) {
        var listItem = document.createElement('LI');
        listItem.innerHTML = item.innerHTML;
        listElement.appendChild(listItem);
        item.remove();
    };

    var wrapList = function(groups, tagName) {
        var listElement = document.createElement(tagName),
            firstAncestor = groups[0].ancestor;
        firstAncestor.parentNode.insertBefore(listElement, firstAncestor);
        groups.forEach(function(g) {
            if (listTagNames.indexOf(g.ancestor.tagName) === -1)
                return appendListItem(listElement, g.ancestor);
            while (g.ancestor.childNodes.length > 0)
                listElement.appendChild(g.ancestor.childNodes[0]);
            g.ancestor.remove();
        });
    };

    var unwrapList = function(groups) {
        groups.forEach(function(g) {
            if (!g.ancestor.parentNode) return;
            var f = document.createDocumentFragment();
            for (var i = 0; i < g.ancestor.childNodes.length; i++) {
                var p = document.createElement('P');
                p.innerHTML = g.ancestor.childNodes[i].innerHTML;
                f.appendChild(p);
            }
            g.ancestor.parentNode.insertBefore(f, g.ancestor);
            g.ancestor.remove();
        });
    };

    var getAncestorTag = function(node, ancestor, tagNames) {
        while (node) {
            if (tagNames.index(node.tagName) > -1) return node;
            if (node === ancestor) return;
            node = node.parentNode;
        }
    };

    var getTrueAncestor = function(group, editorElement, tagNames) {
        if (group.ancestor.nodeType === 3)
            group.ancestor = group.ancestor.parentNode;
        var listTag = getAncestorTag(group.ancestor, editorElement, tagNames);
        if (listTag) group.ancestor = listTag;
    };

    this.applyTag = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            anyNotInTag = false;
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = getAncestorTag(s.node, editorElement, [tagName]);
                if (!s.target) anyNotInTag = true;
            });
        });
        (anyNotInTag ? wrap : unwrap)(groups, tagName, editorElement);
    };

    // find parent containers, toggle style on them
    this.applyStyle = function(style, editorElement) {
        var groups = selectionService.getSelections();
        // TODO
    };

    // find parent containers, wrap them in tagName
    // change parent containers to LI
    this.applyList = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            anyNotInList = false;
        groups.forEach(function(g) {
            getTrueAncestor(g, editorElement, listTagNames);
            g.selections.forEach(function(s) {
                s.target = getAncestorTag(s.node, editorElement, [tagName]);
                if (!s.target) anyNotInList = true;
            });
        });
        (anyNotInList ? wrapList : unwrapList)(groups, tagName, editorElement);
    };

    this.clearFormatting = function(editorElement) {
        var groups = selectionService.getSelections();
        // TODO
    };
});