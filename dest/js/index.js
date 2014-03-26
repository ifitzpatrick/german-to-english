(function() {
  window.Dict = angular.module("Dict", []);

}).call(this);

(function() {
  Dict.factory("chromeMessage", function($rootScope) {
    return {
      listen: function(fn) {
        return chrome.extension.onMessage.addListener(function(message, sender, callback) {
          if (message.action === "open-german-english-dictionary") {
            return $rootScope.$apply(function() {
              return fn();
            });
          }
        });
      }
    };
  });

}).call(this);

(function() {
  Dict.factory("getSelection", function() {
    return function() {
      var _ref;
      return (_ref = document.getSelection()) != null ? _ref.toString() : void 0;
    };
  });

}).call(this);

(function() {
  Dict.factory("keydown", function($rootScope) {
    return {
      listen: function(fn) {
        return document.addEventListener("keydown", function(event) {
          return $rootScope.$apply(function() {
            return fn(event);
          });
        });
      }
    };
  });

}).call(this);

(function() {
  Dict.factory("search", function($http, xmlToJson) {
    return function(searchTerm) {
      var url;
      url = "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=" + searchTerm;
      return $http.get(url).then((function(_this) {
        return function(res) {
          var spec, xml;
          xml = res.data;
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
          return xmlToJson(xml, spec);
        };
      })(this));
    };
  });

}).call(this);

(function() {
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

  Dict.factory("xmlToJson", function() {
    return function(xml, spec) {
      var dom, parser;
      parser = new DOMParser;
      dom = parser.parseFromString(xml, "application/xml");
      return nodeToJSON(dom, spec);
    };
  });

}).call(this);

(function() {
  Dict.controller("OptionsCtrl", function($scope) {
    return $scope.lol = "OMG";
  });

}).call(this);

(function() {
  Dict.controller("RootCtrl", function($scope, chromeMessage, keydown, getSelection, search) {
    $scope.reset = function() {
      $scope.searchTerm = "";
      $scope.nextSearchTerm = "";
      $scope.previous = [];
      $scope.marker = 0;
      $scope.tree = {
        sections: []
      };
      $scope.popoverIsVisible = false;
      return $scope.loading = false;
    };
    $scope.reset();
    $scope.refresh = function() {
      var previousItem;
      if ($scope.previous.length < 0) {
        return previousItem = {
          searchTerm: "",
          tree: {
            sections: []
          }
        };
      } else {
        previousItem = $scope.previous[$scope.marker];
        $scope.searchTerm = previousItem.searchTerm;
        return $scope.tree = previousItem.tree;
      }
    };
    $scope.showPopover = function(isVisible) {
      var searchTerm;
      $scope.popoverIsVisible = isVisible;
      if (isVisible) {
        searchTerm = getSelection();
        if (searchTerm) {
          return $scope.search(searchTerm);
        }
      }
    };
    $scope.hasDefinitions = function() {
      var _ref, _ref1;
      return ((_ref = $scope.tree) != null ? (_ref1 = _ref.sections) != null ? _ref1.length : void 0 : void 0) > 0;
    };
    $scope.search = function(searchTerm) {
      $scope.loading = true;
      $scope.searchTerm = searchTerm;
      return search(searchTerm).then(function(tree) {
        $scope.previous.unshift({
          searchTerm: searchTerm,
          tree: tree
        });
        $scope.tree = tree;
        $scope.loading = false;
        return $scope.marker = 0;
      }, function(error) {
        return $scope.loading = false;
      });
    };
    $scope.searchInput = function(searchInputText) {
      $scope.nextSearchTerm = "";
      return $scope.search(searchInputText);
    };
    $scope.canForward = function() {
      return $scope.marker > 0;
    };
    $scope.forward = function() {
      if ($scope.canForward()) {
        $scope.marker--;
        return $scope.refresh();
      }
    };
    $scope.canBack = function() {
      return $scope.marker < $scope.previous.length - 1;
    };
    $scope.back = function() {
      if ($scope.canBack()) {
        $scope.marker++;
        return $scope.refresh();
      }
    };
    $scope.close = function() {
      return $scope.showPopover(false);
    };
    chromeMessage.listen(function() {
      return $scope.showPopover(true);
    });
    return keydown.listen(function(event) {
      if (event.which === 71 && event.altKey) {
        return $scope.showPopover(true);
      } else if (event.which === 27) {
        return $scope.showPopover(false);
      }
    });
  });

}).call(this);

(function() {
  Dict.directive("arrow", function() {
    return {
      restrict: "EA",
      replace: true,
      scope: {
        reverse: "=reverse",
        active: "=active"
      },
      template: "<canvas width=\"20\" height=\"20\"></canvas>",
      link: function($scope, element, attrs) {
        var activeColor, ctx, draw, getColor, inactiveColor, width;
        activeColor = "white";
        inactiveColor = "#bbb";
        width = 20;
        ctx = element[0].getContext("2d");
        getColor = function() {
          if ($scope.active) {
            return activeColor;
          } else {
            return inactiveColor;
          }
        };
        draw = function() {
          var color, scale;
          color = getColor();
          ctx.clearRect(0, 0, width, width);
          ctx.save();
          scale = function(value) {
            return width * (value / 10);
          };
          if ($scope.reverse) {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
          }
          ctx.fillStyle = color;
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
          ctx.fill();
          return ctx.restore();
        };
        $scope.$watch("active", function() {
          return draw();
        });
        return draw();
      }
    };
  });

}).call(this);

(function() {
  var $, e;

  $ = function(query) {
    return document.querySelectorAll(query);
  };

  try {
    $("body")[0].insertAdjacentHTML("beforeend", template());
    angular.bootstrap($(".ged-popover")[0], ["Dict"]);
  } catch (_error) {
    e = _error;
    debugger;
  }

}).call(this);
