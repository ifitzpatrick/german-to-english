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
  var node, selection, text;
  selection = document.getSelection();
  if (event.which === 71 && event.altKey && selection) {
    node = selection.anchorNode.parentElement;
    text = selection.toString();
    return popover.create(text);
  } else if (event.which === 27) {
    return popover.replace();
  }
});


},{"./popover":3}],3:[function(require,module,exports){
var $, build, element, request, xmlToJson;

$ = require("./query");

element = require("./element");

request = require("./request");

xmlToJson = require("./xml_to_json.coffee");

build = function(search, tree) {
  var base, cell, defRow, defTable, definition, lang, section, sectionDiv, sectionTitle, title, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
  base = element.create("div", {
    fontFamily: "Helvetica",
    padding: "20px"
  });
  title = element.create("h1");
  title.innerText = search;
  base.appendChild(title);
  _ref = tree.sections;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    section = _ref[_i];
    sectionDiv = element.create("div");
    base.appendChild(sectionDiv);
    sectionTitle = element.create("h2");
    sectionTitle.innerText = section.name;
    sectionDiv.appendChild(sectionTitle);
    defTable = element.create("table");
    sectionDiv.appendChild(defTable);
    _ref1 = section.definitions;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      definition = _ref1[_j];
      defRow = element.create("tr");
      defTable.appendChild(defRow);
      _ref2 = definition.langs;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        lang = _ref2[_k];
        cell = element.create("td");
        cell.innerText = lang.text;
        defRow.appendChild(cell);
      }
    }
  }
  return base;
};

module.exports = {
  create: function(search) {
    var div, height, url, width;
    width = 600;
    height = 800;
    div = element.create("div", {
      position: "fixed",
      left: "100px",
      top: "100px",
      bottom: "100px",
      right: "100px",
      background: "#73afb6",
      color: "#eefcff",
      overflowY: "auto",
      zIndex: 999,
      border: "solid #2b2301 2px",
      borderRadius: "20px"
    });
    url = "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=" + search;
    div.innerText = "LOADING...";
    this.replace(div);
    return request(url).then(function(res) {
      var spec, tree, xml;
      xml = res.responseText;
      spec = {
        name: "sections",
        selector: "section",
        attrs: {
          name: "sctTitle"
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
      tree = xmlToJson(xml, spec);
      div.innerHTML = "";
      return div.appendChild(build(search, tree));
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


},{"./element":1,"./query":4,"./request":5,"./xml_to_json.coffee":6}],4:[function(require,module,exports){
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


},{}],6:[function(require,module,exports){
var nodeToJSON,
  __hasProp = {}.hasOwnProperty;

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

module.exports = function(xml, spec) {
  var dom, parser;
  parser = new DOMParser;
  dom = parser.parseFromString(xml, "application/xml");
  return nodeToJSON(dom, spec);
};


},{}]},{},[2])