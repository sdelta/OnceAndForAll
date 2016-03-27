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

function getNodeLeafs(node) {
    if (node.children != 0) {
        return [node];
    }
    
    var result = [];

    for (var i = 0; i < node.childen.length; i++) {
        result.push(getNodeLeafs(node.childen[i]));
    }
    
    return flatList(result);
}

function previous_n(doc, node, n) {
    if (node.isEqualNode(doc.elementNode)) {
        return []; 
    }

    var left_siblings = [];

    for (var i = 0; i < node.parentNode.childNodes.length; ++i) {
        if (node.isEqualNode(node.parentNode.childNodes[i])) {
            break;
        }

        left_siblings.push(node.parentNode.childNodes[i]);
    }

    left_siblings.reverse();
    var sum_length = 0;
    var leafsList = [];
    for (var i = 0; i < left_siblings.length && sum_length < n; i++) {
        var currentLeafsList = getNodeLeafs(left_siblings[i]);
        leafsList.push(currentLeafsList);
        sum_length += currentLeafsList.length;
    }

    return flatList(leafsList);
}

function next_n(doc, node, n) {
    if (node.isEqualNode(doc.elementNode)) {
        return []; 
    }

    var right_siblings = [];
    var afterNode = false;

    for (var i = 0; i < node.parentNode.childNodes.length; ++i) {
        if (afterNode) {
            right_siblings.push(node.parentNode.childNodes[i]);
        }

        if (node.isEqualNode(node.parentNode.childNodes[i])) {
            afterNode = true;
        }
    }

    var sum_length = 0;
    var leafsList = [];
    for (var i = 0; i < right_siblings.length && sum_length < n; i++) {
        var currentLeafsList = getNodeLeafs(right_siblings[i]);
        leafsList.push(currentLeafsList);
        sum_length += currentLeafsList.length;
    }

    return flatList(leafsList);

}

module.exports.ancestors_all = ancestors_all;
module.exports.ancestors_n = ancestors_n;
module.exports.previous_n = previous_n;
module.exports.next_n = next_n;
