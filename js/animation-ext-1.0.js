$(document).ready(function() {
  if (window.isSearchBot == 1
    || t_animateParallax__checkOldIE()
    || $(".t-records").attr("data-tilda-mode") == "edit")
  {return;}

  t_animateFix__wrapEls();
  t_animateParallax__wrapEls();

  setTimeout(function() {
      t_animateParallax__initScroll();
      t_animateParallax__initMouse();
      var mouseElls = $("[data-animate-prx='mouse'],[data-animate-prx-res-960='mouse'],[data-animate-prx-res-640='mouse'],[data-animate-prx-res-480='mouse'],[data-animate-prx-res-320='mouse']");
      var fixedEls = $("[data-animate-fix]:not([data-animate-fix-alw='yes']), [data-animate-fix-res-960]:not([data-animate-fix-alw-res='yes']), [data-animate-fix-res-640]:not([data-animate-fix-alw='yes']),[data-animate-fix-res-480]:not([data-animate-fix-alw='yes']),[data-animate-fix-res-320]:not([data-animate-fix-alw='yes'])");
      if (mouseElls.length > 0 || fixedEls.length > 0) {
        var getClientRects = document.querySelector('body').getClientRects();
        if(getClientRects.length > 0) {
          var initHeight = getClientRects[0].height;
          var bodyHeightResizeObserver_animateParallax = new ResizeObserver(function(entries) {
            for (var index = 0; index < entries.length; index++) {
              /* body's height is changed */
              if (entries[index].contentRect.height !== initHeight) {
                getClientRects = document.querySelector('body').getClientRects();
                if(getClientRects.length > 0) {
                  initHeight = getClientRects[0].height;
                  for (var i = 0; i < mouseElls.length; i++) {
                    var el = mouseElls[i];
                    t_animateParallax__cashOffsets(el);
                  }
                  t_animateFix__cashElsInfo(fixedEls);
                }
              }
            }
          });
          bodyHeightResizeObserver_animateParallax.observe(document.querySelector('body'));
        }
      }
  }, 1000);

  if ($(window).scrollTop() == 0) {
      setTimeout(function() {
          t_animateFix__init();
      }, 1000);
  } else {
      setTimeout(function() {
          t_animateFix__init();
      }, 50);
  }
});

function t_animate__getAttrByRes($el, attr, res) {
  var width = res || $(window).width();
  var attrValue;

  if (width >= 1200) {
      attrValue = $el.attr('data-animate-'+attr);
      return attrValue;
  }

  if ($el.attr('data-animate-mobile')!='y') {
      $el.css('transition','none');
      return;
  }

  if (width >= 960) {
      attrValue = $el.attr('data-animate-'+attr+'-res-960');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr);
      return attrValue;
  }
  if (width >= 640) {
      attrValue = $el.attr('data-animate-'+attr+'-res-640');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-960');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr);
      return attrValue;
  }
  if (width >= 480) {
      attrValue = $el.attr('data-animate-'+attr+'-res-480');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-640');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-960');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr);
      return attrValue;
  }
  if (width >= 320) {
      attrValue = $el.attr('data-animate-'+attr+'-res-320');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-480');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-640');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr+'-res-960');
      if (typeof attrValue == 'undefined' && !res) attrValue = $el.attr('data-animate-'+attr);
      return attrValue;
  }
}

function t_animateFix__wrapEls() {
  var wrappingEls = $("[data-animate-fix], [data-animate-fix-res-960], [data-animate-fix-res-640], [data-animate-fix-res-480], [data-animate-fix-res-320]");
  wrappingEls.each(function(){
      if (typeof t_animate__getAttrByRes($(this), 'prx') != "undefined") {
          $(this).removeAttr("data-animate-prx");
          $(this).removeAttr("data-animate-prx-res-960");
          $(this).removeAttr("data-animate-prx-res-640");
          $(this).removeAttr("data-animate-prx-res-480");
          $(this).removeAttr("data-animate-prx-res-320");
      }

      el = $(this);
      el_atom = $(this).find(".tn-atom");
      el_atom.wrap( "<div class='tn-atom__sticky-wrapper' style='display:table; width:inherit; height:inherit;'></div>" );

      /* if elem has appearance animation, we need to move it to fixed wrapper,
      because position:fixed doesnt work inside element with transform */
      el_fixedWrapper = el.find(".tn-atom__sticky-wrapper");
      if (el.hasClass("t-animate")) {
          el.removeClass("t-animate");
          el_fixedWrapper.addClass("t-animate");
          el_fixedWrapper.attr({
              "data-animate-style":t_animate__getAttrByRes(el, "style", 1200),
              "data-animate-distance":t_animate__getAttrByRes(el, "distance", 1200),
              "data-animate-scale":t_animate__getAttrByRes(el, "scale", 1200),
              "data-animate-duration":t_animate__getAttrByRes(el, "duration", 1200),
              "data-animate-delay":t_animate__getAttrByRes(el, "delay", 1200),

              "data-animate-style-res-960":t_animate__getAttrByRes(el, "style", 960),
              "data-animate-distance-res-960":t_animate__getAttrByRes(el, "distance", 960),
              "data-animate-scale-res-960":t_animate__getAttrByRes(el, "scale", 960),
              "data-animate-duration-res-960":t_animate__getAttrByRes(el, "duration", 960),
              "data-animate-delay-res-960":t_animate__getAttrByRes(el, "delay", 960),

              "data-animate-style-res-640":t_animate__getAttrByRes(el, "style", 640),
              "data-animate-distance-res-640":t_animate__getAttrByRes(el, "distance", 640),
              "data-animate-scale-res-640":t_animate__getAttrByRes(el, "scale", 640),
              "data-animate-duration-res-640":t_animate__getAttrByRes(el, "duration", 640),
              "data-animate-delay-res-640":t_animate__getAttrByRes(el, "delay", 640),

              "data-animate-style-res-480":t_animate__getAttrByRes(el, "style", 480),
              "data-animate-distance-res-480":t_animate__getAttrByRes(el, "distance", 480),
              "data-animate-scale-res-480":t_animate__getAttrByRes(el, "scale", 480),
              "data-animate-duration-res-480":t_animate__getAttrByRes(el, "duration", 480),
              "data-animate-delay-res-480":t_animate__getAttrByRes(el, "delay", 480),

              "data-animate-style-res-320":t_animate__getAttrByRes(el, "style", 320),
              "data-animate-distance-res-320":t_animate__getAttrByRes(el, "distance", 320),
              "data-animate-scale-res-320":t_animate__getAttrByRes(el, "scale", 320),
              "data-animate-duration-res-320":t_animate__getAttrByRes(el, "duration", 320),
              "data-animate-delay-res-320":t_animate__getAttrByRes(el, "delay", 320),
          });
          el.removeAttr("data-animate-style data-animate-distance data-animate-scale data-animate-duration data-animate-delay");
          el.removeAttr("data-animate-style-res-960 data-animate-distance-res-960 data-animate-scale-res-960 data-animate-duration-res-960 data-animate-delay-res-960");
          el.removeAttr("data-animate-style-res-640 data-animate-distance-res-640 data-animate-scale-res-640 data-animate-duration-res-640 data-animate-delay-res-640");
          el.removeAttr("data-animate-style-res-480 data-animate-distance-res-480 data-animate-scale-res-480 data-animate-duration-res-480 data-animate-delay-res-480");
          el.removeAttr("data-animate-style-res-320 data-animate-distance-res-320 data-animate-scale-res-320 data-animate-duration-res-320 data-animate-delay-res-320");
      }
  });
}


function t_animateFix__init() {
  var fixedEls = $("[data-animate-fix]:not([data-animate-fix-alw='yes']), [data-animate-fix-res-960]:not([data-animate-fix-alw-res='yes']), [data-animate-fix-res-640]:not([data-animate-fix-alw='yes']),[data-animate-fix-res-480]:not([data-animate-fix-alw='yes']),[data-animate-fix-res-320]:not([data-animate-fix-alw='yes'])");
  var alwaysFixedEls = $("[data-animate-fix][data-animate-fix-alw='yes'], [data-animate-fix-res-960][data-animate-fix-alw='yes'], [data-animate-fix-res-640][data-animate-fix-alw='yes'],[data-animate-fix-res-480][data-animate-fix-alw='yes'],[data-animate-fix-res-320][data-animate-fix-alw='yes']");
  var stopFixing = false;

  if (fixedEls.length == 0) {
      return;
  }

  t_animateFix__cashElsInfo(fixedEls);
  t_animateFix__cashElsInfo(alwaysFixedEls);

  t_animateFix__updatePositions(fixedEls);
  t_animateFix__positionAlwaysFixed(alwaysFixedEls);
  if(window.lazy=='y'){t_lazyload_update();}

  $(window).resize(t_throttle(function(event) {
    t_animateFix__cashElsInfo(fixedEls);
    t_animateFix__cashElsInfo(alwaysFixedEls);
    t_animateFix__updatePositions(fixedEls,true);
    t_animateFix__positionAlwaysFixed(alwaysFixedEls);
  }, 100));

  /* 
  catch events of window height changes
  it may be caused by tabs or "show more" button
  */  
  $('.t396').bind('displayChanged', function(){
    if (stopFixing) {return;}
    setTimeout(function(){
      t_animateFix__cashElsInfo(fixedEls);
      t_animateFix__updatePositions(fixedEls,true);
    },10);
  });

  $(window).bind('scroll', t_throttle(function(){
      if (stopFixing) {return;}
      t_animateFix__updatePositions(fixedEls,false);
  },30));
}


function t_animateFix__positionAlwaysFixed(alwaysFixedEls) {
  for (var i = 0; i < alwaysFixedEls.length; i++) {
      var el = alwaysFixedEls[i];
      el.fixedWrapperEl.css({"position":"fixed","top":el.triggerOffset+"px"});
  }
}


function t_animateFix__updatePositions(fixedEls,isPageResized) {
  var scrollTop = $(window).scrollTop();

  for (var i = 0; i < fixedEls.length; i++) {
      var el = fixedEls[i];
      if (el.distance == 0) {return;}

      var trigger = scrollTop + el.triggerOffset;
      var isAfterStart = trigger >= el.topOffset;
      var isBeforeStart = trigger < el.topOffset;
      var isBeforeEnd = el.end > trigger;
      var isAfterEnd = el.end <= trigger;

      /* if element is located between start and end */
      if ((isAfterStart && isBeforeEnd && (el.fixedWrapperEl.hasClass("t-sticky_going") == false || isPageResized))
          || (isBeforeEnd && el.fixedWrapperEl.hasClass("t-sticky_ended"))) {
          $(el).css({"transform":""});
          el.fixedWrapperEl.css({"position":"fixed","top":el.triggerOffset+"px"});
          el.fixedWrapperEl.addClass("t-sticky_going");
          el.fixedWrapperEl.removeClass("t-sticky_ended");
      }
      /* if element is located under end */
      if (isAfterEnd && el.fixedWrapperEl.hasClass("t-sticky_ended") == false) {
          $(el).css({"transform":"translateY("+el.distance+"px)"});
          el.fixedWrapperEl.css({"top":"","position":""});
          el.fixedWrapperEl.removeClass("t-sticky_going");
          el.fixedWrapperEl.addClass("t-sticky_ended");
      }
      /* if element is located above start */
      if (isBeforeStart && el.fixedWrapperEl.hasClass("t-sticky_going")) {
          el.fixedWrapperEl.css({"top":"","position":""});
          el.fixedWrapperEl.removeClass("t-sticky_going");
      }
  }
}


function t_animateFix__cashElsInfo(fixedEls) {
  var winHeight = $(window).height();
  for (var i = 0; i < fixedEls.length; i++) {
      var el = fixedEls[i];
      var elTopPos = $(el).css("top").replace("px","")*1;
      var elRecParent = $(el).parents(".r");
      var recTopOffset = elRecParent.offset().top + elRecParent.css("padding-top").replace("px","")*1;
      el.topOffset = recTopOffset + elTopPos;
      el.trigger = t_animate__getAttrByRes($(el),'fix');
      el.distance = t_animate__getAttrByRes($(el),'fix-dist')*1;
      el.distance = (typeof el.distance == 'undefined') || (el.distance == 0) ? 0 : el.distance;
      el.end = el.topOffset + el.distance;
      el.fixedWrapperEl = $(el).find(".tn-atom__sticky-wrapper");
      t_animateFix__getElTrigger(el,winHeight);
  }
}


function t_animateFix__getElTrigger(el,winHeight) {
  el.triggerOffset = t_animate__getAttrByRes($(el),'fix-trgofst');
  el.triggerOffset = (typeof el.triggerOffset == 'undefined') || (el.triggerOffset == 0) ? 0 : el.triggerOffset*1;
  if (el.trigger == '0.5') {
      el.triggerOffset += winHeight/2;
      if (el.triggerOffset > el.topOffset && el.triggerOffset <= winHeight/2) {
          el.triggerOffset = el.topOffset;
      }
  }
  if (el.trigger == '1') {
      el.triggerOffset += winHeight;
      if (el.triggerOffset > el.topOffset && el.triggerOffset <= winHeight) {
          el.triggerOffset = el.topOffset;
      }
  }
}


function t_animateFix__reset(fixedEls) {
  for (var i = 0; i < fixedEls.length; i++) {
      var el = fixedEls[i];
      $(el).css("transform","");
      el.fixedWrapperEl.css("position","");
      el.fixedWrapperEl.removeClass("t-sticky_ended t-sticky_going");
  }
}


function t_animateParallax__wrapEls() {
var wrappingEls = $("[data-animate-prx='scroll'] .tn-atom, [data-animate-prx='mouse'] .tn-atom,[data-animate-prx-res-960='scroll'] .tn-atom, [data-animate-prx-res-960='mouse'] .tn-atom,[data-animate-prx-res-640='scroll'] .tn-atom, [data-animate-prx-res-640='mouse'] .tn-atom,[data-animate-prx-res-480='scroll'] .tn-atom, [data-animate-prx-res-480='mouse'] .tn-atom,[data-animate-prx-res-320='scroll'] .tn-atom, [data-animate-prx-res-320='mouse'] .tn-atom");
wrappingEls.each(function(){
   $(this).wrap( "<div class='tn-atom__prx-wrapper' style='display:table; width:inherit; height:inherit;'></div>" );
});
}


function t_animateParallax__initScroll() {
  var scrollEls = $("[data-animate-prx='scroll'],[data-animate-prx-res-960='scroll'],[data-animate-prx-res-640='scroll'],[data-animate-prx-res-480='scroll'],[data-animate-prx-res-320='scroll']");
  var scrollTop = $(window).scrollTop();

  if (scrollEls.length == 0) {return;}

  var hiddenEls = [];

  for (var i = 0; i < scrollEls.length; i++) {
      var el = scrollEls[i];
      el.topOffset = $(el).offset().top;
      el.bottomOffset = el.topOffset + $(el).height();
      /*remove the ones, which are under viewport*/
      if (el.bottomOffset < scrollTop) {
          scrollEls.splice(i,1);
          i--;
          if (scrollEls.length == 0) {break;}
          continue;
      }
      /*
      if elements are hidden, we add parallax, when they become visible
      why? because hidden elements return incorrect offset().top (always 0) and Rellax starts to add transform too early
      */
      if ($(el).is(":hidden")) {
          scrollEls.splice(i,1);
          i--;
          hiddenEls.push(el);
          continue;
      }
      /*add speed*/
      var elSpeed = t_animate__getAttrByRes($(el), "prx-s");
      $(el).find(".tn-atom__prx-wrapper").attr("data-rellax-speed", Math.round((elSpeed - 100) / 10));
  }

  if (scrollEls.length > 0) {
      Rellax("[data-rellax-speed]", {
          round: true,
          onscroll: true
      });
  }

  /*
  onscroll - custom parameter, just for Tilda animation, not from original library

  at the moment 27.12.2017 Rellax have two modes:
  1. it centeres elements when you scroll to them (and adds transform onready, before any scroll start,
  so elements jump and are not at their original positions);
  2. without centering it moves elements for too long distance;
  */

   $(window).bind('scroll', t_throttle(function(){
       var visibleEls = [];
       for (var i = 0; i < hiddenEls.length; i++) {
           var el = $(hiddenEls[i]);
           if (el.is(":visible")) {
               hiddenEls.splice(i,1);
               i--;
               visibleEls.push(el);
           }
       }
       if (visibleEls.length == 0) {return;}
       var elSpeed = t_animate__getAttrByRes($(el), "prx-s");
       var curSelector = 'rellax' + Date.now();
       $(visibleEls).each(function(){
           $(this).find(".tn-atom__prx-wrapper").attr("data-rellax-speed", Math.round((elSpeed - 100) / 10));
           $(this).addClass(curSelector);
       });
       Rellax("."+curSelector, {
           round: true,
           onscroll: true
       });
   },50));
}


function t_animateParallax__initMouse() {
  var mouseElls = $("[data-animate-prx='mouse'],[data-animate-prx-res-960='mouse'],[data-animate-prx-res-640='mouse'],[data-animate-prx-res-480='mouse'],[data-animate-prx-res-320='mouse']");

  if (mouseElls.length == 0) {return;}

  /*cash some information*/
  var winHeight = $(window).height();
  var winWidth = $(window).width();
  for (var i = 0; i < mouseElls.length; i++) {
      var el = mouseElls[i];

      el.pathX = t_animate__getAttrByRes($(el), "prx-dx");
      el.pathY = t_animate__getAttrByRes($(el), "prx-dy");
      el.animEl = $(el).find(".tn-atom__prx-wrapper");
      t_animateParallax__cashOffsets(el);
      /* cash offsets for images with lazyload, which are loaded later */
      var elType = $(el).attr('data-elem-type');
      if (elType === 'image') {
          t_animateParallax__cashOffsets__OnImgLoad(el);
      }
  }

  $(window).resize(t_throttle(function(event) {
      winHeight = $(window).height();
      winWidth = $(window).width();
      for (var i = 0; i < mouseElls.length; i++) {
          var el = mouseElls[i];
          t_animateParallax__cashOffsets(el);
      }
  }, 50));

  /*do some magic on mousemove*/
  for (var i = 0; i < mouseElls.length; i++) {
      t_animateParallax__moveEl(mouseElls[i],winHeight,winWidth);
  }
}


function t_animateParallax__cashOffsets(el) {
  el.topOffset = $(el).offset().top;
  el.bottomOffset = el.topOffset + $(el).height();
  /*cash parent offset, if element is larger*/
  var parent = $(el).parents(".r");
  var parentOffsetTop = parent.offset().top;
  var parentOffsetBottom = parent.offset().top + parent.height();
  if (parentOffsetTop > el.topOffset) {
      el.parentTopOffset = parentOffsetTop;
  }
  if (parentOffsetBottom < el.bottomOffset) {
      el.parentBottomOffset = parentOffsetBottom;
  }
}


function t_animateParallax__cashOffsets__OnImgLoad(el) {
  /* we need to catch load event for images, if lazylode is active */
  if (window.lazy) {
      var el_img = $(el).find('img');
      el_img.on("load", function(){
          t_animateParallax__cashOffsets(el);
      });
  };
}


function t_animateParallax__moveEl(el,winHeight,winWidth) {
  var pathX = el.pathX;
  var pathY = el.pathY;
  var moveX = 0;
  var moveY = 0;
  var frameMoveX = 0;
  var frameMoveY = 0;
  var stop = false;


  $("body").on("mousemove", t_throttle(function(e) {
      if (typeof e == "undefined") {return;}
      var topActiveArea = e.pageY - e.clientY - 100;
      var bottomActiveArea = e.pageY + winHeight + 100;
      if (el.bottomOffset < topActiveArea || el.topOffset > bottomActiveArea) {return;}
      if (el.parentTopOffset > e.pageY || el.parentBottomOffset < e.pageY) { return;}
      /*for large background image, which is larger than record (".r") height*/

      if (typeof pathX != "undefined") {
          var winHalfX = winWidth/2;
          var mouseCenterOffsetX = winHalfX - e.clientX;
          var moveIntensityX = mouseCenterOffsetX / winHalfX;
          moveX = Math.round(pathX * moveIntensityX);
      }
      if (typeof pathY != "undefined") {
          var winHalfY = winHeight/2;
          var mouseCenterOffsetY = winHalfY - e.clientY;
          var moveIntensityY = mouseCenterOffsetY / winHalfY;
          moveY = Math.round(pathY * moveIntensityY);
      }

      stop = false;
      t_animateParallax__moveEl__drawFrame();
  }, 50));


  function t_animateParallax__moveEl__drawFrame() {
      if (stop) {return;}

      requestAnimationFrame(t_animateParallax__moveEl__drawFrame);

      if (moveX != 0) {
          frameMoveX += (moveX - frameMoveX)*0.02;
      }
      if (moveY != 0) {
          frameMoveY += (moveY - frameMoveY)*0.02;
      }
      if (Math.abs(frameMoveX - moveX) < 1 && Math.abs(frameMoveY - moveY) < 1) {
          stop = true;
          return;
      }

      $(el.animEl).css('transform', 'translate3d(' + frameMoveX + 'px, ' + frameMoveY + 'px, 0px)');
  }
}


function t_animateParallax__checkOldIE() {
  var sAgent = window.navigator.userAgent,
      Idx = sAgent.indexOf("MSIE"),
      ieVersion = "",
      oldIE = false;
  if (Idx > 0) {
      ieVersion = parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
      if (ieVersion == 8 || ieVersion == 9 || ieVersion == 10) {
          oldIE = true;
      }
  }
  return oldIE;
}




// ------------------------------------------
// Rellax.js - v1.0.0
// Buttery smooth parallax library
// Copyright (c) 2016 Moe Amaya (@moeamaya)
// MIT license
//
// Thanks to Paraxify.js and Jaime Cabllero
// for parallax concepts
// ------------------------------------------

(function (root, factory) {
if (typeof define === 'function' && define.amd) {
  // AMD. Register as an anonymous module.
  define([], factory);
} else if (typeof module === 'object' && module.exports) {
  // Node. Does not work with strict CommonJS, but
  // only CommonJS-like environments that support module.exports,
  // like Node.
  module.exports = factory();
} else {
  // Browser globals (root is window)
  root.Rellax = factory();
}
}(this, function () {
var Rellax = function(el, options){
  "use strict";

  var self = Object.create(Rellax.prototype);

  var posY = 0; // set it to -1 so the animate function gets called at least once
  var screenY = 0;
  var posX = 0;
  var screenX = 0;
  var blocks = [];
  var pause = false;

  // check what requestAnimationFrame to use, and if
  // it's not supported, use the onscroll event
  var loop = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    function(callback){ setTimeout(callback, 1000 / 60); };

  // check which transform property to use
  var transformProp = window.transformProp || (function(){
      var testEl = document.createElement('div');
      if (testEl.style.transform === null) {
        var vendors = ['Webkit', 'Moz', 'ms'];
        for (var vendor in vendors) {
          if (testEl.style[ vendors[vendor] + 'Transform' ] !== undefined) {
            return vendors[vendor] + 'Transform';
          }
        }
      }
      return 'transform';
    })();

  // limit the given number in the range [min, max]
  var clamp = function(num, min, max) {
    return (num <= min) ? min : ((num >= max) ? max : num);
  };

  // Default Settings
  self.options = {
    speed: -2,
    center: false,
    round: true,
    vertical: true,
    horizontal: false,
    callback: function() {},
  };

  // User defined options (might have more in the future)
  if (options){
    Object.keys(options).forEach(function(key){
      self.options[key] = options[key];
    });
  }

  // If some clown tries to crank speed, limit them to +-10
  self.options.speed = clamp(self.options.speed, -10, 10);

  // By default, rellax class
  if (!el) {
    el = '.rellax';
  }

  // check if el is a className or a node
  var elements = typeof el === 'string' ? document.querySelectorAll(el) : [el];

  // Now query selector
  if (elements.length > 0) {
    self.elems = elements;
  }

  // The elements don't exist
  else {
    throw new Error("The elements you're trying to select don't exist.");
  }


  // Let's kick this script off
  // Build array for cached element values
  // Bind scroll and resize to animate method
  var init = function() {
    screenY = window.innerHeight;
    screenX = window.innerWidth;
    setPosition();

    // Get and cache initial position of all elements
    for (var i = 0; i < self.elems.length; i++){
      var block = createBlock(self.elems[i]);
      /*Tilda custom parameter to fix too long moving distance*/
      if (self.options.onscroll) {
          block.inViewport = false;
      }
      blocks.push(block);
    }

    window.addEventListener('resize', function(){
      animate();
    });

    // Start the loop
    update();

    // The loop does nothing if the scrollPosition did not change
    // so call animate to make sure every element has their transforms
    animate();
  };


  // We want to cache the parallax blocks'
  // values: base, top, height, speed
  // el: is dom object, return: el cache values
  var createBlock = function(el) {
    var dataPercentage = el.getAttribute( 'data-rellax-percentage' );
    var dataSpeed = el.getAttribute( 'data-rellax-speed' );
    var dataZindex = el.getAttribute( 'data-rellax-zindex' ) || 0;

    // initializing at scrollY = 0 (top of browser), scrollX = 0 (left of browser)
    // ensures elements are positioned based on HTML layout.
    //
    // If the element has the percentage attribute, the posY and posX needs to be
    // the current scroll position's value, so that the elements are still positioned based on HTML layout
    var posY = self.options.vertical ? ( dataPercentage || self.options.center ? (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop) : 0 ) : 0;
    var posX = self.options.horizontal ? ( dataPercentage || self.options.center ? (window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft) : 0 ) : 0;

    /*Tilda custom parameter*/
    if (self.options.onscroll) {
        posY = window.pageYOffset;
    }

    var blockTop = posY + el.getBoundingClientRect().top;
    var blockHeight = el.clientHeight || el.offsetHeight || el.scrollHeight;

    var blockLeft = posX + el.getBoundingClientRect().left;
    var blockWidth = el.clientWidth || el.offsetWidth || el.scrollWidth;

    // apparently parallax equation everyone uses
    var percentageY = dataPercentage ? dataPercentage : (posY - blockTop + screenY) / (blockHeight + screenY);
    var percentageX = dataPercentage ? dataPercentage : (posX - blockLeft + screenX) / (blockWidth + screenX);
    if(self.options.center){ percentageX = 0.5; percentageY = 0.5; }

    // Optional individual block speed as data attr, otherwise global speed
    // Check if has percentage attr, and limit speed to 5, else limit it to 10
    var speed = dataSpeed ? clamp(dataSpeed, -10, 10) : self.options.speed;
    if (dataPercentage || self.options.center) {
      speed = clamp(dataSpeed || self.options.speed, -5, 5);
    }

    var bases = updatePosition(percentageX, percentageY, speed);

    // ~~Store non-translate3d transforms~~
    // Store inline styles and extract transforms
    var style = el.style.cssText;
    var transform = '';

    // Check if there's an inline styled transform
    if (style.indexOf('transform') >= 0) {
      // Get the index of the transform
      var index = style.indexOf('transform');

      // Trim the style to the transform point and get the following semi-colon index
      var trimmedStyle = style.slice(index);
      var delimiter = trimmedStyle.indexOf(';');

      // Remove "transform" string and save the attribute
      if (delimiter) {
        transform = " " + trimmedStyle.slice(11, delimiter).replace(/\s/g,'');
      } else {
        transform = " " + trimmedStyle.slice(11).replace(/\s/g,'');
      }
    }

    return {
      baseX: bases.x,
      baseY: bases.y,
      top: blockTop,
      left: blockLeft,
      height: blockHeight,
      width: blockWidth,
      speed: speed,
      style: style,
      transform: transform,
      zindex: dataZindex
    };
  };

  // set scroll position (posY, posX)
  // side effect method is not ideal, but okay for now
  // returns true if the scroll changed, false if nothing happened
  var setPosition = function() {
    var oldY = posY;
    var oldX = posX;

    if (window.pageYOffset !== undefined) {
      posY = window.pageYOffset;
    } else {
      posY = (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    if (window.pageXOffset !== undefined) {
      posX = window.pageXOffset;
    } else {
      posX = (document.documentElement || document.body.parentNode || document.body).scrollLeft;
    }

    if (oldY != posY && self.options.vertical) {
      // scroll changed, return true
      return true;
    }

    if (oldX != posX && self.options.horizontal) {
      // scroll changed, return true
      return true;
    }

    // scroll did not change
    return false;
  };


  // Ahh a pure function, gets new transform value
  // based on scrollPosition and speed
  // Allow for decimal pixel values
  var updatePosition = function(percentageX, percentageY, speed) {
    var result = {};
    var valueX = (speed * (100 * (1 - percentageX)));
    var valueY = (speed * (100 * (1 - percentageY)));

    result.x = self.options.round ? Math.round(valueX) : Math.round(valueX * 100) / 100;
    result.y = self.options.round ? Math.round(valueY) : Math.round(valueY * 100) / 100;

    return result;
  };


  //
  var update = function() {
    if (setPosition() && pause === false) {
      animate();
    }

    // loop again
    loop(update);
  };

  // Transform3d on parallax element
  var animate = function() {
    for (var i = 0; i < self.elems.length; i++){
      if (self.options.onscroll && blocks[i].top > (posY + screenY)) {
          continue;
      }

      var percentageY = ((posY - blocks[i].top + screenY) / (blocks[i].height + screenY));
      var percentageX = ((posX - blocks[i].left + screenX) / (blocks[i].width + screenX));

      // Subtracting initialize value, so element stays in same spot as HTML
      var positions = updatePosition(percentageX, percentageY, blocks[i].speed);// - blocks[i].baseX;
      if (blocks[i].inViewport == false) {
          blocks[i].baseY = positions.y;
          blocks[i].baseX = positions.x;
      }
      blocks[i].inViewport = true;
      var positionY = positions.y - blocks[i].baseY;
      var positionX = positions.x - blocks[i].baseX;

      var zindex = blocks[i].zindex;

      // Move that element
      // (Set the new translation and append initial inline transforms.)
      var translate = 'translate3d(' + (self.options.horizontal ? positionX : '0') + 'px,' + (self.options.vertical ? positionY : '0') + 'px,' + zindex + 'px) ' + blocks[i].transform;
      self.elems[i].style[transformProp] = translate;
    }
    self.options.callback(positions);
  };


  self.destroy = function() {
    for (var i = 0; i < self.elems.length; i++){
      self.elems[i].style.cssText = blocks[i].style;
    }
    pause = true;
  };


  init();
  return self;
};
return Rellax;
}));