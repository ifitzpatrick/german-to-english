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


(function() {
  var $, createElement, currentPopover, dataTree, nodeToJSON, popover, replacePopover, request,
    __hasProp = {}.hasOwnProperty;

  $ = function(selector) {
    return document.querySelectorAll(selector);
  };

  currentPopover = null;

  replacePopover = function(newPopover) {
    var body;
    if (newPopover == null) {
      newPopover = null;
    }
    body = $("body")[0];
    if (currentPopover) {
      currentPopover.remove();
    }
    if (newPopover) {
      body.appendChild(newPopover);
    }
    return currentPopover = newPopover;
  };

  createElement = function(tag, styles) {
    var ele, key, value;
    ele = document.createElement(tag);
    for (key in styles) {
      if (!__hasProp.call(styles, key)) continue;
      value = styles[key];
      ele.style[key] = value;
    }
    return ele;
  };

  request = function(url) {
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

  nodeToJSON = function(dom, nodeSpec, tree) {
    var attrName, childNodeSpec, element, key, node, nodes;
    if (tree == null) {
      tree = {};
    }
    tree[nodeSpec.name] = nodes = (function() {
      var _i, _j, _len, _len1, _ref, _ref1, _ref2, _results;
      _ref = dom.querySelectorAll(nodeSpec.selector);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        node = {};
        _ref1 = nodeSpec.attrs || {};
        for (key in _ref1) {
          if (!__hasProp.call(_ref1, key)) continue;
          attrName = _ref1[key];
          node[key] = element.getAttribute(attrName);
        }
        if (nodeSpec.text) {
          node["text"] = element.textContent;
        }
        _ref2 = nodeSpec.children || [];
        for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
          childNodeSpec = _ref2[_j];
          nodeToJSON(element, childNodeSpec, node);
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

  popover = function(x, y, search) {
    var div, height, url, width;
    width = 600;
    height = 800;
    div = createElement("div", {
      width: width + "px",
      height: height + "px",
      position: "absolute",
      left: x.toString() + "px",
      top: y.toString() + "px"
    });
    url = "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=" + search;
    div.innerText = "LOADING...";
    replacePopover(div);
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
  };

  document.addEventListener("keydown", function(event) {
    var node, selection, text, x, y;
    selection = document.getSelection();
    if (event.which === 68 && event.ctrlKey && selection) {
      node = selection.anchorNode.parentElement;
      text = selection.toString();
      x = node.offsetLeft + node.offsetWidth;
      y = node.offsetTop;
      return popover(x, y, text);
    } else if (event.which === 27) {
      return replacePopover();
    }
  });

}).call(this);
