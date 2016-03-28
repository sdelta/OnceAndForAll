function ancestors_n(doc, node, ancestors_number) {
    var result = [];
    while (node != doc.documentElement && ancestors_number > 0) {
        result.push(node.parentNode);
        node = node.parentNode;
        ancestors_number = ancestors_number - 1;
    }

    return result;
}

function ancestors_all(doc, node) {
    var result = [];
    while (node != doc.documentElement) {
        result.push(node.parentNode);
        node = node.parentNode;
    }

    return result;
}

function is_leaf(node) {
    if (!node.hasChildNodes() || node.children.length === 0) {
        return true;
    } else {
        return false;
    }
}

function getNodeLeafsFromIter(iterator, make_iterator = makeForwardIterator, maxLeafs = Infinity) {
    var result = [];
    var cur_res = iterator.next();
    while (cur_res.done === false && result.length < maxLeafs) {
        result = result.concat(getNodeLeafs(cur_res.value, make_iterator, maxLeafs - result.length));
        cur_res = iterator.next();
    }

    return result;
}

function getNodeLeafs(node, make_iterator, maxLeafs = Infinity) {
    if (is_leaf(node)) {
        return [node];
    }

    return getNodeLeafsFromIter(make_iterator(node.childNodes), make_iterator, maxLeafs);
}


function get_n_neibhor_leafs(make_iterator, doc, node, maxLeafs) {
    var ascending_list = [];
    while (node != doc.documentElement) {
        var siblings = node.parentNode.childNodes;
        var indexOfNode = Array.prototype.indexOf.call(siblings, node);
        ascending_list.push(make_iterator(siblings, indexOfNode));
        node = node.parentNode;
    }

    var result = [];
    for (var i = 0; i < ascending_list.length && result.length < maxLeafs; i++) {
        result = result.concat(getNodeLeafsFromIter(ascending_list[i], make_iterator, maxLeafs - result.length));
    }

    return result;
}

var previous_n = get_n_neibhor_leafs.bind(null, makeBackwardIterator);
var next_n = get_n_neibhor_leafs.bind(null, makeForwardIterator);

function makeForwardIterator(array, zero_index = -1) {
    var cur_index = zero_index + 1;
    
    return {
        next: function() {
            if (cur_index < array.length) {
                return {
                    value: array[cur_index++],
                    done: false
                };
            } else {
                return { done: true };
            }
        }
    }    
}

function makeBackwardIterator(array, zero_index = -1) {
    var cur_index;

    if (zero_index === -1) {
        cur_index = array.length - 1;
    } else {
        cur_index = zero_index - 1;   
    }
    
    return {
        next: function() {
            if (cur_index >= 0) {
                return {
                    value: array[cur_index--],
                    done: false
                };
            } else {
                return { done: true };
            }
        }
    }    
}


function getSelectedForest(win) {
    var selection = win.getSelection();
    var first_selection_node = selection.anchorNode;
    if (first_selection_node === null) {
        return [];
    }
    
    var result = [];
    while (selection.containsNode(first_selection_node, true)) {
        var cur_node = first_selection_node;

        const treeRoot = win.document.documentElement;
        var rightestChild = function (node) {
            // assuming that node is legitimate node
            // therefore there is at least 1 child
            return getNodeLeafs(node, makeBackwardIterator)[0];
        }

        while (cur_node != treeRoot && selection.containsNode(rightestChild(cur_node.parentNode), true)) {
            cur_node = cur_node.parentNode;
        }

        result.push(cur_node);

        var nextNodeLst = next_n(win.document, cur_node, 1);
        if (nextNodeLst.length === 0) {
            break;
        }

        first_selection_node = nextNodeLst[0];
    }

    return result;
}


/*
 * following functions may come in handy later
 * but for now they are just useless untested piece of code
 *
function hashDistance(hash1, hash2) {
    var result = 0;
    for (var className in hash1) {
        if (!hash1.hasOwnProperty(className)) {
            continue;
        }

        if (hash2.hasOwnProperty(className)) {
            result = result + abs(hash1.className - hash2.className);
        } else {
            result = result + hash1.className
        }
    }
}

function leafsListToLeafsSetHash(list) {
   var hash = {};
    for (var i = 0; i < list.length; i++) {
        if (hash.hasOwnProperty(list[i].nodeName)) {
            hash[list.nodeName]++;
        } else {
            hash[list.nodeName] = 1;
        }
    }

    return hash;
}
*/

module.exports.getAllAncestorsOfNode = ancestors_all;
module.exports.getNAncestorsOfNode = ancestors_n;
module.exports.getPreviousNNodes = previous_n;
module.exports.getNextNNodes = next_n;
module.exports.getSelectedForest = getSelectedForest
