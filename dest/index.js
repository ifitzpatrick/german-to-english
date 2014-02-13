// ==UserScript==
// @name       german-dictionary
// @namespace  http://use.i.E.your.homepage/
// @version    0.1
// @description  enter something useful
// @match      http://tampermonkey.net/index.php?version=3.6.3737.80&ext=dhdg&updated=true
// @copyright  2012+, You
// @include    http://www.dw.de/*
// @include    http://www.spiegel.de
// @include    http://www.spiegel.de/*
// @include    http://www.sueddeutsche.de
// @include    http://www.sueddeutsche.de/*
// ==/UserScript==


(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty;

module.exports = {
  create: function(tag, styles) {
    var ele, key, value;
    ele = document.createElement(tag);
    for (key in styles) {
      if (!__hasProp.call(styles, key)) continue;
      value = styles[key];
      ele.style[key] = value;
    }
    return ele;
  }
};


},{}],2:[function(require,module,exports){
var popover;

popover = require("./popover");

document.addEventListener("keydown", function(event) {
  var node, selection, text, x, y;
  selection = document.getSelection();
  if (event.which === 68 && event.ctrlKey && selection) {
    node = selection.anchorNode.parentElement;
    text = selection.toString();
    x = node.offsetLeft + node.offsetWidth;
    y = node.offsetTop;
    return popover.create(x, y, text);
  } else if (event.which === 27) {
    return popover.replace();
  }
});


},{"./popover":3}],3:[function(require,module,exports){
var $, dataTree, element, nodeToJSON, request,
  __hasProp = {}.hasOwnProperty;

$ = require("./query");

element = require("./element");

request = require("./request");

nodeToJSON = function(dom, nodeSpec, tree) {
  var attrName, childNodeSpec, ele, key, node, nodes;
  if (tree == null) {
    tree = {};
  }
  tree[nodeSpec.name] = nodes = (function() {
    var _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
    _ref = dom.querySelectorAll(nodeSpec.selector);
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      ele = _ref[_i];
      node = {};
      _ref1 = nodeSpec.attrs || {};
      for (key in _ref1) {
        if (!__hasProp.call(_ref1, key)) continue;
        attrName = _ref1[key];
        node[key] = ele.getAttribute(attrName);
      }
      if (nodeSpec.text) {
        node["text"] = ele.textContent;
      }
      _ref2 = nodeSpec.children || [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        childNodeSpec = _ref2[_j];
        nodeToJSON(ele, childNodeSpec, node);
      }
      _results.push(node);
    }
    return _results;
  })();
  return tree;
};

dataTree = function(xml, spec) {
  var dom, parser;
  parser = new DOMParser;
  dom = parser.parseFromString(xml, "application/xml");
  return nodeToJSON(dom, spec);
};

module.exports = {
  create: function(x, y, search) {
    var div, height, url, width;
    width = 600;
    height = 800;
    div = element.create("div", {
      width: width + "px",
      height: height + "px",
      position: "absolute",
      left: x.toString() + "px",
      top: y.toString() + "px",
      background: "white",
      overflowY: "auto",
      zIndex: 999
    });
    url = "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=" + search;
    div.innerText = "LOADING...";
    this.replace(div);
    return request(url).then(function(res) {
      var body, e, spec, text, tree;
      try {
        body = res.responseText;
        spec = {
          name: "sections",
          selector: "section",
          attrs: {
            sectionName: "sctTitle"
          },
          children: [
            {
              name: "definitions",
              selector: "entry",
              children: [
                {
                  name: "langs",
                  selector: "side",
                  attrs: {
                    lang: "lang"
                  },
                  text: true
                }
              ]
            }
          ]
        };
        tree = dataTree(body, spec);
        text = JSON.stringify(tree, null, 4);
        div.innerHtml = "";
        return div.innerText = text;
      } catch (_error) {
        e = _error;
        debugger;
      }
    }, function() {
      return div.innerText = "ERROR";
    });
  },
  replace: function(newPopover) {
    var body;
    if (newPopover == null) {
      newPopover = null;
    }
    body = $("body")[0];
    if (this.current) {
      this.current.remove();
    }
    if (newPopover) {
      body.appendChild(newPopover);
    }
    return this.current = newPopover;
  },
  current: null
};


},{"./element":1,"./query":4,"./request":5}],4:[function(require,module,exports){
module.exports = function(selector) {
  return document.querySelectorAll(selector);
};


},{}],5:[function(require,module,exports){
module.exports = function(url) {
  return new Promise(function(resolve, reject) {
    return GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: function(res) {
        return resolve(res);
      },
      onerror: function(error) {
        return reject(error);
      }
    });
  });
};


},{}]},{},[2])