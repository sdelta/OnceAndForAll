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

function flatList(nestedList, seed = []) {
    return nestedList.reduce(function(a, b) {
        return a.concat(b);
    }, seed)
}

function is_leaf(node) {
    if (!node.hasChildNodes() || node.children.length == 0) {
        return true;
    } else {
        return false;
    }
}

function getNodeLeafsFromIter(iterator, make_iterator, maxLeafs) {
    var result = [];
    var cur_res = iterator.next();
    while (cur_res.done == false && result.length < maxLeafs) {
        result = result.concat(getNodeLeafs(cur_res.value, make_iterator, maxLeafs - result.length));
        cur_res = iterator.next();
    }

    return result;
}

function getNodeLeafs(node, make_iterator, maxLeafs) {
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

    if (zero_index == -1) {
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

var previous_n = get_n_neibhor_leafs.bind(null, makeBackwardIterator);
var next_n = get_n_neibhor_leafs.bind(null, makeForwardIterator);

module.exports.ancestors_all = ancestors_all;
module.exports.ancestors_n = ancestors_n;
module.exports.previous_n = previous_n;
module.exports.next_n = next_n;
