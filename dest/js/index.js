(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  buildElement: function(width, afterDraw) {
    if (width == null) {
      width = 20;
    }
    return {
      tag: "canvas",
      attrs: (function(width) {
        return {
          width: width,
          height: width
        };
      })(width),
      onCreate: function(ele) {
        var ctx;
        ctx = ele.getContext("2d");
        this.drawArrow(ctx, width);
        return typeof afterDraw === "function" ? afterDraw(ctx, width) : void 0;
      }
    };
  },
  drawArrow: function(ctx, width) {
    var scale;
    scale = function(value) {
      return width * (value / 10);
    };
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(scale(9), scale(0));
    ctx.lineTo(scale(4), scale(5));
    ctx.lineTo(scale(9), scale(10));
    ctx.lineTo(scale(10), scale(10));
    ctx.lineTo(scale(10), scale(9));
    ctx.lineTo(scale(6), scale(5));
    ctx.lineTo(scale(10), scale(1));
    ctx.lineTo(scale(10), scale(0));
    ctx.lineTo(scale(9), scale(0));
    return ctx.fill();
  },
  flip: function(ctx, width) {
    return ctx.scale(1, -1);
  },
  left: function(width) {
    return this.buildElement(width);
  },
  right: function(width) {
    return this.buildElement(width, this.flip);
  }
};


},{}],2:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty;

module.exports = {
  create: function(options) {
    var child, ele, event, key, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;
    if (options == null) {
      options = {};
    }
    if (options.tag == null) {
      options.tag = "div";
    }
    ele = document.createElement(options.tag);
    _ref = (options != null ? options.attrs : void 0) || {};
    for (key in _ref) {
      if (!__hasProp.call(_ref, key)) continue;
      value = _ref[key];
      ele.setAttribute(key, value);
    }
    if (options.text != null) {
      ele.innerText = options.text;
    }
    if (options.html != null) {
      ele.innerHTML = options.html;
    }
    _ref1 = options.events || [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      event = _ref1[_i];
      ele.addEventListener(event.type, event.handler);
    }
    _ref2 = options.children || [];
    for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
      child = _ref2[_j];
      ele.appendChild(this.create(child));
    }
    if (typeof options.onCreate === "function") {
      options.onCreate(ele);
    }
    return ele;
  }
};


},{}],3:[function(require,module,exports){
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


},{"./popover":4}],4:[function(require,module,exports){
var $, arrow, build, element, popover, request, xmlToJson;

$ = require("./query");

element = require("./element");

request = require("./request");

xmlToJson = require("./xml_to_json");

arrow = require("./components/arrow");

build = function(search, tree) {
  var base, section;
  base = element.create({
    attrs: {
      "class": "ged-popover-content"
    },
    children: [
      {
        tag: "form",
        children: [
          {
            tag: "input"
          }, {
            tag: "button",
            text: "Search",
            attrs: {
              type: "submit"
            }
          }
        ],
        events: [
          {
            type: "submit",
            handler: function(event) {
              popover.create(searchBar.value);
              if (typeof event.preventDefault === "function") {
                event.preventDefault();
              }
              return false;
            }
          }
        ]
      }, {
        attrs: {
          "class": "ged-popover-close"
        },
        html: "&times;",
        events: [
          {
            type: "click",
            handler: function() {
              return popover.replace();
            }
          }
        ]
      }, {
        tag: "h1",
        text: search
      }, {
        children: (function() {
          var _i, _len, _ref, _results;
          _ref = tree.sections;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            section = _ref[_i];
            _results.push((function(section) {
              var definition;
              return {
                children: [
                  {
                    tag: "h2",
                    text: section.name
                  }, {
                    tag: "table",
                    children: (function() {
                      var _j, _len1, _ref1, _results1;
                      _ref1 = section.definitions;
                      _results1 = [];
                      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                        definition = _ref1[_j];
                        _results1.push((function(definition) {
                          var lang;
                          return {
                            tag: "tr",
                            children: (function() {
                              var _k, _len2, _ref2, _results2;
                              _ref2 = definition.langs;
                              _results2 = [];
                              for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                                lang = _ref2[_k];
                                _results2.push((function(lang) {
                                  return {
                                    tag: "td",
                                    text: lang.text
                                  };
                                })(lang));
                              }
                              return _results2;
                            })()
                          };
                        })(definition));
                      }
                      return _results1;
                    })()
                  }
                ]
              };
            })(section));
          }
          return _results;
        })()
      }
    ]
  });
  return base;
};

module.exports = popover = {
  create: function(search) {
    var div, height, url, width;
    width = 600;
    height = 800;
    div = element.create({
      attrs: {
        "class": "ged-popover"
      },
      text: "LOADING..."
    });
    url = "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=" + search;
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


},{"./components/arrow":1,"./element":2,"./query":5,"./request":6,"./xml_to_json":7}],5:[function(require,module,exports){
module.exports = function(selector) {
  return document.querySelectorAll(selector);
};


},{}],6:[function(require,module,exports){
module.exports = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr;
    xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onload = function() {
      return resolve(xhr);
    };
    xhr.onerror = function(error) {
      return reject(error);
    };
    return xhr.send();
  });
};


},{}],7:[function(require,module,exports){
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


},{}]},{},[3])