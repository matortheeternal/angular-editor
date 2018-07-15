app.service('htmlService', function(selectionService) {
    var listTagNames = ['OL', 'UL'],
        headerTagNames = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];

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

    var createHeader = function(tagName, tag) {
        var headerItem = document.createElement(tagName);
        headerItem.innerText = tag.innerText;
        tag.parentNode.insertBefore(headerItem, tag);
        tag.remove();
    };

    var wrapList = function(groups, tagName) {
        var listElement = document.createElement(tagName),
            firstAncestor = groups[0].list || groups[0].block;
        firstAncestor.parentNode.insertBefore(listElement, firstAncestor);
        unique(groups, 'block').forEach(function(g) {
            if (!isListTag(g.block))
                return appendListItem(listElement, g.block);
            for (var i = g.block.childNodes.length - 1; i >= 0; i--)
                appendListItem(listElement, g.block.childNodes[i]);
        });
    };

    var unwrapList = function(groups) {
        unique(groups, 'list').forEach(function(g) {
            if (!g.list) return;
            var f = document.createDocumentFragment();
            for (var i = 0; i < g.list.childNodes.length; i++) {
                var p = document.createElement('P');
                p.innerHTML = g.list.childNodes[i].innerHTML;
                f.appendChild(p);
            }
            g.list.parentNode.insertBefore(f, g.list);
            g.list.remove();
        });
    };

    var getAncestorTag = function(node, ancestor, test) {
        while (node) {
            if (test(node)) return node;
            if (node === ancestor) return;
            node = node.parentNode;
        }
    };

    var applyStyle = function(node, style) {
        var styleKeys = Object.keys(style);
        styleKeys.forEach(function(key) {
            node.style[key] = null;
        });
        var computedStyle = getComputedStyle(node);
        styleKeys.forEach(function(key) {
            if (computedStyle[key] === style[key]) return;
            node.style[key] = style[key];
        });
    };

    var tagNameTest = function(tagNames) {
        return function(node) {
            return tagNames.indexOf(node.tagName) > -1;
        }
    };

    var isListTag = tagNameTest(listTagNames);

    this.applyTag = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            anyNotInTag = false,
            test = tagNameTest([tagName]);
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                s.target = getAncestorTag(s.node, editorElement, test);
                if (!s.target) anyNotInTag = true;
            });
        });
        (anyNotInTag ? wrap : unwrap)(groups, tagName, editorElement);
    };

    this.applyBlockStyle = function(style, editorElement) {
        var groups = selectionService.getSelections(),
            isBlockTag = tagNameTest(['DIV', 'P', 'UL', 'OL']);
        groups.forEach(function(g) {
            g.block = getAncestorTag(g.ancestor, editorElement, isBlockTag);
        });
        unique(groups, 'block').forEach(function(g) {
            applyStyle(g.block, style);
        });
    };

    this.applyInlineStyle = function(style, editorElement) {
        var groups = selectionService.getSelections();
        // TODO
    };

    this.applyList = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            anyNotInList = false,
            isBlockTag = tagNameTest(['DIV', 'P', 'UL', 'OL', 'LI']);
        groups.forEach(function(g) {
            g.block = getAncestorTag(g.ancestor, editorElement, isBlockTag);
            g.list = getAncestorTag(g.ancestor, editorElement, isListTag);
            if (!g.list || g.list.tagName !== tagName) anyNotInList = true;
        });
        (anyNotInList ? wrapList : unwrapList)(groups, tagName, editorElement);
    };

    this.indent = function(editorElement) {

    };

    this.dedent = function(editorElement) {

    };

    this.applyHeader = function(tagName, editorElement) {
        var groups = selectionService.getSelections(),
            isBlockTag = tagNameTest(['P']),
            isHeaderTag = tagNameTest(headerTagNames);
        groups.forEach(function(g) {
            g.tag = getAncestorTag(g.ancestor, editorElement, isHeaderTag) ||
                getAncestorTag(g.ancestor, editorElement, isBlockTag) ||
                (g.ancestor.nodeType === 3 && g.ancestor);
        });
        unique(groups, 'tag').forEach(function(g) {
            if (!g.tag) return;
            createHeader(tagName, g.tag);
        });
    };

    this.clearFormatting = function(editorElement) {
        var groups = selectionService.getSelections();
        // TODO: extract text nodes and put them in paragraph elements
    };
});