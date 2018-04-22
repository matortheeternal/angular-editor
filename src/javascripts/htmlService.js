app.service('htmlService', function(selectionService) {
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

    var getAncestorTag = function(node, ancestor, tagName) {
        while (node) {
            if (node.tagName === tagName) return node;
            if (node === ancestor) return;
            node = node.parentNode;
        }
    };

    this.applyTag = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            anyNotInTag = false;
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = getAncestorTag(s.node, editorElement, tagName);
                if (!s.target) anyNotInTag = true;
            });
        });
        (anyNotInTag ? wrap : unwrap)(groups, tagName, editorElement);
    };

    this.applyStyle = function(style, editorElement) {
        var groups = selectionService.getSelections();
        // TODO
    };
});