editor.service('editorHtmlHelpers', function() {
    var h = this,
        listTagNames = ['OL', 'UL'];

    var combineTag = function(html, sibling, tagName, method) {
        if (!sibling || sibling.tagName !== tagName) return;
        html[method](sibling.innerHTML);
        sibling.remove();
    };

    var createTextNode = function(node, start, end) {
        var text = node.substringData(start, end);
        return document.createTextNode(text);
    };

    var appendListItem = function(listElement, item) {
        var listItem = document.createElement('LI');
        listItem.innerHTML = item.innerHTML;
        listElement.appendChild(listItem);
        item.remove();
    };

    this.unique = function(a, key) {
        return a.reduce(function(newArray, item) {
            var value = item[key],
                match = newArray.find(function(item) {
                    return item[key] === value;
                });
            if (!match) newArray.push(item);
            return newArray;
        }, []);
    };

    this.isTextNode = function(node) {
        return node.nodeType === 3;
    };

    this.wrap = function(groups, tagName) {
        var newTags = [];
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                if (!h.isTextNode(s.node)) return;
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
                newTags.push(newNode);
            });
        });
        return newTags;
    };

    this.unwrap = function(groups, tagName, editorElement) {
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

    this.createHeader = function(tagName, tag) {
        var headerItem = document.createElement(tagName);
        headerItem.innerText = tag.innerText;
        tag.parentNode.insertBefore(headerItem, tag);
        tag.remove();
    };

    this.wrapList = function(groups, tagName) {
        var listElement = document.createElement(tagName),
            firstAncestor = groups[0].list || groups[0].block;
        firstAncestor.parentNode.insertBefore(listElement, firstAncestor);
        h.unique(groups, 'block').forEach(function(g) {
            if (!h.isListTag(g.block))
                return appendListItem(listElement, g.block);
            for (var i = g.block.childNodes.length - 1; i >= 0; i--)
                appendListItem(listElement, g.block.childNodes[i]);
        });
    };

    this.unwrapList = function(groups) {
        h.unique(groups, 'list').forEach(function(g) {
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

    this.getAncestorTag = function(node, ancestor, test) {
        while (node) {
            if (test(node)) return node;
            if (node === ancestor) return;
            node = node.parentNode;
        }
    };

    this.applyStyle = function(node, style) {
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

    this.tagNameTest = function(tagNames) {
        return function(node) {
            return tagNames.indexOf(node.tagName) > -1;
        }
    };

    this.insertAfter = function(refNode, newNode) {
        refNode.parentNode.insertBefore(newNode, refNode.nextSibling);
    };

    this.deleteSelection = function(groups) {
        var refElement = groups[0].ancestor;
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                var start = s.node.start || 0,
                    len = (s.node.end || s.node.length) - start,
                    parent = s.node.parentNode;
                h.isTextNode(s.node) ? s.node.deleteData(start, len) :
                    s.node.remove();
                parent.normalize();
                if (parent.innerHTML.trim() === '') {
                    if (parent === refElement || s.node === refElement)
                        refElement = parent.previousSibling;
                    parent.remove();
                }
            });
        });
        return refElement;
    };

    this.elementIsChild = function(element, parent) {
        while (element) {
            if (element === parent) return true;
            element = element.parentNode;
        }
    };

    this.isListTag = h.tagNameTest(listTagNames);
});