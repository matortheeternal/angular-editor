editor.service('editorHtmlHelpers', function(editorSelectionService) {
    var h = this,
        select = editorSelectionService.select,
        listTagNames = ['OL', 'UL'],
        combineMethods = {
            previous: 'unshift',
            next: 'push'
        };

    var removeEmptyStyle = function(tag) {
        if (tag.getAttribute('style') === '')
            tag.removeAttribute('style');
    };

    var combineTag = function(html, s, tagName, type) {
        var sibling = s.node[type + 'Sibling'];
        if (!sibling || sibling.tagName !== tagName) return;
        var method = combineMethods[type];
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

    var setStartEnd = function(s) {
        s.len = s.node.length;
        if (!s.hasOwnProperty('start')) s.start = 0;
        if (!s.hasOwnProperty('end')) s.end = s.len;
    };

    var combineTags = function(s, tagName, html) {
        if (s.start === 0)
            combineTag(html, s, tagName, 'previous');
        if (s.end === s.len)
            combineTag(html, s, tagName, 'next');
    };

    var buildWrapNode = function(s, tagName) {
        var newNode = document.createElement(tagName);
        html = [s.node.substringData(s.start, s.end - s.start)];
        combineTags(s, tagName, html);
        newNode.innerHTML = html.join('');
        newNode.normalize();
        return newNode;
    };

    var buildWrapFragment = function(s, newNode) {
        var f = document.createDocumentFragment();
        if (s.start > 0) f.appendChild(createTextNode(s.node, 0, s.start));
        f.appendChild(newNode);
        if (s.end < s.len) f.appendChild(createTextNode(s.node, s.end, s.len));
        return f;
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
                if (s.target) return newTags.push(s.target);
                setStartEnd(s);
                var newNode = buildWrapNode(s, tagName);
                s.node.replaceWith(buildWrapFragment(s, newNode));
                s.node = newNode.firstChild;
                s.start = 0;
                s.end = s.node.length;
                newTags.push(newNode);
            });
        });
        return newTags;
    };

    this.unwrap = function(groups, tagName, editorElement) {
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                var i, p = s.target.parentNode;
                if (!p) return;
                // TODO: Handle partial unwrapping
                if (p === editorElement) {
                    var e = document.createElement('p');
                    e.innerHTML = s.target.innerHTML;
                    s.target.replaceWith(e);
                    s.node = e;
                    s.start = 0;
                    s.end = e.lastChild.length - 1;
                } else {
                    var f = document.createDocumentFragment();
                    for (i = 0; i < s.target.childNodes.length; i++)
                        f.appendChild(s.target.childNodes[i]);
                    var textNode;
                    for (i = 0; i < p.childNodes.length; i++) {
                        var childNode = p.childNodes[i];
                        if (childNode === s.target) break;
                        if (childNode.nodeType === 3) textNode = childNode;
                    }
                    s.start = textNode ? textNode.length : 0;
                    s.end = s.start + f.childNodes[0].length;
                    s.target.replaceWith(f);
                    p.normalize();
                    s.node = p.childNodes[textNode ? i - 1 : i];
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
        if (style.constructor === Function) {
            style(node);
            removeEmptyStyle(node);
            return;
        }
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

    this.deleteSelection = function(groups, editorEl) {
        var refElement = groups[0].ancestor;
        if (refElement === editorEl) {
            var index = groups[0].selections[0].end - 1;
            return editorEl.children[index];
        }
        groups.forEach(function(g) {
            g.selections.forEach(function(s) {
                var start = s.node.start || 0,
                    len = (s.end || s.node.length) - start,
                    parent = s.node.parentNode;
                if (parent === editorEl && s.node === refElement)
                    refElement = refElement.previousSibling;
                h.isTextNode(s.node) ?
                    s.node.deleteData(start, len) :
                    s.node.remove();
                if (parent === editorEl) return;
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