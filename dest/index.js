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
  var $, currentPopover, popover, removePopover;

  $ = function(selector) {
    return document.querySelectorAll(selector);
  };

  currentPopover = null;

  removePopover = function() {
    if (currentPopover) {
      currentPopover.remove();
    }
    return currentPopover = null;
  };

  popover = function(x, y, search) {
    var body, div, height, iframe, url, width;
    div = document.createElement("div");
    body = $("body")[0];
    iframe = document.createElement("iframe");
    width = 600;
    height = 800;
    url = "http://dict.leo.org/#/search=" + search + "&searchLoc=0&resultOrder=basic&multiwordShowSingle=on";
    iframe.setAttribute("src", url);
    iframe.width = width;
    iframe.height = height;
    div.style.width = width + "px";
    div.style.height = height + "px";
    div.style.position = "absolute";
    div.style.left = x.toString() + "px";
    div.style.top = y.toString() + "px";
    body.appendChild(div);
    div.appendChild(iframe);
    removePopover();
    return currentPopover = div;
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
      return removePopover();
    }
  });

}).call(this);
