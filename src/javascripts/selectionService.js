app.service('selectionService', function() {
    var service = this;

    var forEachRange = function(callback) {
        var sel = window.getSelection();
        for (var i = 0; i < sel.rangeCount; i++) {
            callback(sel.getRangeAt(i));
        }
    };

    var addSelections = function(node, selections) {
        if (node.nodeType === 3) return selections.push({ node: node });
        for (var i = 0; i < node.childNodes.length; i++)
            addSelections(node.childNodes[i], selections);
        return selections;
    };

    var indexOfNode = function(child) {
        var i = 0;
        while (!!(child = child.previousSibling)) i++;
        return i;
    };

    var makeStartSelectionObjects = function(range, groups) {
        var selections = [{
                node: range.startContainer,
                start: range.startOffset
            }],
            ancestor = range.startContainer;
        while (true) {
            var p = ancestor.parentNode;
            if (p === range.commonAncestorContainer) break;
            var n = indexOfNode(ancestor);
            for (var i = n + 1; i < p.childNodes.length; i++)
                addSelections(p.childNodes[i], selections);
            ancestor = p;
        }
        groups.push({ ancestor: ancestor, selections: selections });
    };

    var makeEndSelectionObjects = function(range, groups) {
        var selections = [],
            ancestor = range.endContainer;
        while (true) {
            var p = ancestor.parentNode;
            if (p === range.commonAncestorContainer) break;
            var n = indexOfNode(ancestor);
            for (var i = 0; i < n; i++)
                addSelections(p.childNodes[i], selections);
            ancestor = p;
        }
        selections.push({
            node: range.endContainer,
            end: range.endOffset
        });
        groups.push({ ancestor: ancestor, selections: selections });
    };

    var makeIntermediateSelectionObjects = function(range, groups) {
        var ancestor = range.commonAncestorContainer,
            startIndex = indexOfNode(groups[0].ancestor),
            endIndex = indexOfNode(groups[1].ancestor);
        for (var i = startIndex + 1; i < endIndex; i++) {
            var child = ancestor.childNodes[i];
            groups.splice(-1, 0, {
                ancestor: child,
                selections: addSelections(child, [])
            });
        }
    };

    var simpleSelection = function(range) {
        return {
            ancestor: range.commonAncestorContainer,
            selections: [{
                node: range.startContainer,
                start: range.startOffset,
                end: range.endOffset
            }]
        };
    };

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
                    html = [s.node.substringData(start, end)];
                combineTag(html, s.node.previousSibling, tagName, 'unshift');
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

    this.getSelections = function() {
        var selections = [];
        forEachRange(function(range) {
            if (range.startContainer === range.endContainer)
                return selections.push(simpleSelection(range));
            makeStartSelectionObjects(range, selections);
            makeEndSelectionObjects(range, selections);
            makeIntermediateSelectionObjects(range, selections);
        });
        return selections;
    };

    this.applyTag = function(tagName, editorElement) {
        var groups = service.getSelections(),
            anyNotInTag = false;
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = getAncestorTag(s.node, editorElement, tagName);
                if (!s.target) anyNotInTag = true;
            });
        });
        (anyNotInTag ? wrap : unwrap)(groups, tagName, editorElement);
    };
});