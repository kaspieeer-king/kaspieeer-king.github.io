
/* eslint-disable-next-line no-unused-vars */
function t_sldsInit(rec, sliderOptions) {
    window.t_userAgentParser = {
        userAgent: window.navigator.userAgent,
        getIOSMajorVersion: function() {
            var key = 'iPhone OS';
            try {
                var keyIndex = this.userAgent.search(key);
                if(keyIndex !== -1) {
                    var keyValueIndex = keyIndex + key.length + 1;
                    var partUaAfterKey = this.userAgent.slice(keyValueIndex);
                    var keyValue = partUaAfterKey.match(/(\d{1,3}_\d{1,3}(_\d{1,3})?)/);
                    var majorVersionInt = parseInt(keyValue[0]);
                    return majorVersionInt;
                } else {
                    return null;
                }
            } catch(e) {
                console.log('error in userAgentParser > getIOSMajorVersion' + e.message);
            }
        },
        isIOSMobileChrome: function() {
            return navigator.userAgent.match('CriOS') ? true : false;
        }
    };

    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    if (el.length === 0) {
        return !1;
    }
    var sliderItem = el.find('.t-slds__item'),
        totalSlides = sliderItem.length,
        firstSlide = sliderItem.filter(':first'),
        lastSlide = sliderItem.filter(':last'),
        windowWidth = $(window).width(),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        itemsInRow = sliderWrapper.attr('data-slider-items-in-row'),
        sliderWithCycle = sliderWrapper.attr('data-slider-with-cycle'),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider == 'true') {
        return !1;
    }

    var defaultCountItemsInRow = itemsInRow;
    t_slds_setItemsInRow(rec);
    t_slds_changeImageUrl(rec);
    var sAgent = window.navigator.userAgent,
        Idx = sAgent.indexOf("MSIE"),
        ieVersion = "",
        oldIE = !1;
    if (Idx > 0) {
        ieVersion = parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
        if (ieVersion == 8 || ieVersion == 9) {
            oldIE = !0;
        }
    }
    if (oldIE == !0) {
        sliderWrapper.removeClass('t-slds_animated-fast').removeClass('t-slds_animated-slow').addClass('t-slds_animated-none t-slds_ie').attr('data-slider-correct-height', 'true');
        sliderWrapper.attr('data-slider-items-in-row', 1);
    }
    if (window.$isMobile && sliderWrapper.hasClass('t-slds_animated-none') == !0) {
        sliderWrapper.removeClass('t-slds_animated-none').addClass('t-slds_animated-fast');
    }
    if (sliderWrapper.attr('data-slider-initialized') == 'true') {
        totalSlides = totalSlides - 2;
    }
    sliderWrapper.attr('data-slider-initialized', 'true');
    sliderWrapper.attr('data-slider-totalslides', totalSlides);
    sliderWrapper.attr('data-slider-pos', 1);
    sliderWrapper.attr('data-slider-curr-pos', 1);
    sliderWrapper.attr('data-slider-cycle', '');
    sliderWrapper.attr('data-slider-animated', '');
    var pos = 1;

    if (el.find('.t-slds__item[data-slide-index=0]').length == 0) {
        firstSlide.before(lastSlide.clone(!0).attr('data-slide-index', '0'));
        el.find('.t-slds__item[data-slide-index=0]').find('.t-zoomable').removeClass("t-zoomable");
    }
    if (el.find('.t-slds__item[data-slide-index=' + (totalSlides + 1) + ']').length == 0) {
        lastSlide.after(firstSlide.clone(!0).attr('data-slide-index', totalSlides + 1).removeClass('t-slds__item_active')).addClass('t-slds__item-loaded');
        if (itemsInRow && itemsInRow > 0 && sliderWithCycle == 'true') {
            var beginningSlide = firstSlide;
            var endSlide = lastSlide;
            for (var i = 0; i < itemsInRow - 1; i++) {
                var newSlide = beginningSlide
                    .next()
                    .clone(!0)
                    .attr('data-slide-index', totalSlides + i + 1);
                endSlide.next().after(newSlide);
                endSlide = endSlide.next();
                beginningSlide = beginningSlide.next();
            }
        }
        el.find('.t-slds__item[data-slide-index=' + (totalSlides + 1) + ']').find('.t-zoomable').removeClass("t-zoomable");
    }
    t_slds_SliderWidth(rec);
    if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
        t_slds_SliderHeight(rec);
    }
    t_slds_SliderArrowsHeight(rec);
    t_slds_ActiveSlide(rec, pos, totalSlides, sliderOptions);
    t_slds_initSliderControls(rec, sliderOptions);
    t_slds_ActiveCaption(rec, pos, totalSlides);
    if (sliderWrapper.attr('data-slider-timeout') > 0) {
        /* Fix for hide block with autoplay */
        if (!(el.attr('data-screen-min') && el.css('display') == 'none')) {
            t_slds_initAutoPlay(rec, pos, totalSlides, sliderOptions);
        }
    }
    if (el.find('.t-slds__item-loaded').length < totalSlides + 2) {
        t_slds_UpdateImages(rec, pos);
    }
    if (sliderWrapper.attr('data-slider-arrows-nearpic') == 'yes') {
        t_slds_positionArrows(rec);
    }

    if (oldIE !== !0) {
        t_slds_initSliderSwipe(rec, totalSlides, windowWidth);
    }

    /* 
        IOS13 have bug - CSS transition doesn't work with transform
        so we can remove buggy animation

        right now we emulate CSS transition on JS with func t_ slide_MoveAnimation below

        if (window.t_userAgentParser.getIOSMajorVersion() >= 13 && window.t_userAgentParser.isIOSMobileChrome()) {
            sliderWrapper.removeClass('t-slds_animated-fast').removeClass('t-slds_animated-slow').addClass('t-slds_animated-none').attr('data-slider-correct-height', 'true')
            sliderWrapper.attr('data-slider-items-in-row', 1);
        }
    */

    
    el.find('.t-slds').css('visibility', '');
    $(window).bind('resize', t_throttle(function() {
        setTimeout(function() {
            t_slds_setItemsInRow(rec, defaultCountItemsInRow);
            t_slds_updateSlider(rec);
            /* t_slideMove(rec, false, sliderOptions); */
            t_slds_positionArrows(rec);
        }, 100);
    }, 200));
    $(window).load(function() {
        if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
            t_slds_UpdateSliderHeight(rec);
        }
        t_slds_UpdateSliderArrowsHeight(rec);
    });
}

function t_slds_setItemsInRow(rec, defaultCountItemsInRow) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    var sliderWrapper = el.find('.t-slds__items-wrapper');
    var itemsInRow = sliderWrapper.attr('data-slider-items-in-row');
    var updatedItemsInRow;

    if (itemsInRow) {
        if (window.innerWidth <= 960) {
            updatedItemsInRow = 2;
        }
        if (window.innerWidth <= 640) {
            updatedItemsInRow = 1;
        } 
        if (window.innerWidth > 960) {
            updatedItemsInRow = defaultCountItemsInRow;
        }
    } 

    if (updatedItemsInRow) {
        sliderWrapper.attr('data-slider-items-in-row', updatedItemsInRow);
    }
}

function t_slds_initSliderControls(rec, sliderOptions) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        itemsInRow = sliderWrapper.attr('data-slider-items-in-row'),
        sliderWidth = itemsInRow && itemsInRow > 0 ? el.find('.t-slds__container .t-slds__item').width() : el.find('.t-slds__container').width(),
        stopSlider = sliderWrapper.attr('data-slider-stop');
    if (stopSlider == 'true') {
        return !1;
    }

    sliderWrapper.css({
        transform: 'translateX(-' + (sliderWidth) + 'px)'
    });

    el.find('.t-slds__arrow_wrapper').click(function() {
        var currentTranslate = t_slds_getCurrentTranslate(el);
        var animated = sliderWrapper.attr('data-slider-animated');
        var pos = parseFloat(sliderWrapper.attr('data-slider-pos'), 10);
        var totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides'), 10);
        var cycle = '';
        if (animated == '') {
            sliderWrapper.attr('data-slider-animated', 'yes');
            var direction = $(this).attr('data-slide-direction');
            if (direction === 'left') {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                    pos = 1;
                } else {
                    pos--;
                }
            } else {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
                    pos = totalSlides;
                } else {
                    pos++;
                }
            }
            sliderWrapper.attr('data-slider-pos', pos);
            if ((pos == (totalSlides + 1)) || (pos == 0)) {
                cycle = 'yes';
            }
            sliderWrapper.attr('data-slider-cycle', cycle);
            t_slideMove(rec, false, sliderOptions, currentTranslate);
        }
        el.trigger('updateSlider');
    });
    el.find('.t-slds__bullet').click(function() {
        var currentTranslate = t_slds_getCurrentTranslate(el);
        var pos = parseFloat($(this).attr('data-slide-bullet-for'));
        sliderWrapper.attr('data-slider-pos', pos);
        t_slideMove(rec, false, sliderOptions, currentTranslate);
        el.trigger('updateSlider');
    });
}

function t_slds_animate(timing, draw, duration) {

    var start = performance.now();

    requestAnimationFrame(function t_slds_animate(time) {
        /* timeFraction is changing from 0 to 1 */
        var timeFraction = (time - start) / duration;

        if (timeFraction > 1) timeFraction = 1;

        /* calc current animation state */
        var progress = timing(timeFraction);

        /* paint it */
        draw(progress);

        if (timeFraction < 1) {
            requestAnimationFrame(t_slds_animate);
        } else {
            if (window.lazy == 'y') {
                t_lazyload_update();
            }
        }

    });
}

function t_slide_MoveAnimation(sliderWrapper, pos, sliderWidth, animateDuration) {
    if (!sliderWrapper[0]) {
        return;
    }
    sliderWrapper[0].style.transition = 'height ease-in-out .5s, transform ease-in-out 0s';

    var translateValue = -Math.abs(pos * sliderWidth);
    var currentTranslate = -parseInt(sliderWrapper[0].style.transform.match(/\d+/)[0]);
    var nextTransformValue = currentTranslate - translateValue;

    if (nextTransformValue === 0) {
        return;
    }

    t_slds_animate(
        function (t) { return t; },
        function (progress) {
            sliderWrapper[0].style.transform = 'translateX(' + (currentTranslate - (nextTransformValue * progress)) + 'px)';
        },
        animateDuration
    );
}

function t_slideMove(rec, withoutNewInterval, sliderOptions) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        itemsInRow = sliderWrapper.attr('data-slider-items-in-row'),
        sliderWidth = itemsInRow && itemsInRow > 0 ? el.find('.t-slds__container .t-slds__item').width() : el.find('.t-slds__container').width(),
        sliderTransition = parseFloat(sliderWrapper.attr('data-slider-transition'), 10),
        pos = parseFloat(sliderWrapper.attr('data-slider-pos'), 10),
        totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides'), 10),
        cycle = sliderWrapper.attr('data-slider-cycle'),
        sliderNotAnimated = el.find('.t-slds__items-wrapper').hasClass('t-slds_animated-none'),
        sliderAutoPlay = sliderWrapper.attr('data-slider-timeout') > 0,
        stopSlider = sliderWrapper.attr('data-slider-stop');

    if (pos > totalSlides+1) {
        pos = 1;
        sliderWrapper.attr('data-slider-pos', 1);
    }

    if (stopSlider == 'true') {
        return !1;
    }
    if (sliderWrapper.attr('data-slider-with-cycle') == 'false'
      && (pos == totalSlides || (itemsInRow && itemsInRow > 1 && pos == totalSlides - itemsInRow + 1))) {
        el.find('.t-slds__arrow_wrapper-right').fadeOut(300);
    } else {
        el.find('.t-slds__arrow_wrapper-right').fadeIn(300);
    }
    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
        el.find('.t-slds__arrow_wrapper-left').fadeOut(300);
    } else {
        el.find('.t-slds__arrow_wrapper-left').fadeIn(300);
    }
    sliderWrapper.addClass('t-slds_animated');


    if (window.t_userAgentParser.getIOSMajorVersion() >= 13 && window.t_userAgentParser.isIOSMobileChrome()) {
        t_slide_MoveAnimation(sliderWrapper, pos, sliderWidth, sliderTransition);
    } else {
        sliderWrapper.css({
            transform: 'translateX(-' + (sliderWidth * pos) + 'px)'
        });
    }
    
    setTimeout(function() {
        sliderWrapper.removeClass('t-slds_animated');
        sliderWrapper.attr('data-slider-animated', '');
        cycle = sliderWrapper.attr('data-slider-cycle');
        if (cycle == 'yes') {
            if (pos == (totalSlides + 1)) {
                pos = 1;
            }
            if (pos == 0) {
                pos = totalSlides;
            }

            if (window.t_userAgentParser.getIOSMajorVersion() >= 13 && window.t_userAgentParser.isIOSMobileChrome()) {
                t_slide_MoveAnimation(sliderWrapper, pos, sliderWidth, 0);
            } else {
                sliderWrapper.css({
                    transform: 'translateX(-' + (sliderWidth * pos) + 'px)'
                });
            }
            if (sliderNotAnimated !== !0) {
                t_slds_ActiveSlide(rec, pos, totalSlides, sliderOptions);
            }
            sliderWrapper.attr('data-slider-pos', pos);
        }
        if (window.lazy == 'y') {
            t_lazyload_update();
        }
        if (!withoutNewInterval && sliderAutoPlay) {
            t_slds_initAutoPlay(rec, pos, totalSlides, sliderOptions);
        }
    }, sliderTransition);
    
    t_slds_ActiveBullet(rec, pos, totalSlides, sliderOptions);
    t_slds_ActiveSlide(rec, pos, totalSlides);
    if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
        t_slds_SliderHeight(rec);
    }
    t_slds_SliderArrowsHeight(rec);
    t_slds_ActiveCaption(rec, pos, totalSlides);
    if (el.find('.t-slds__item-loaded').length < totalSlides + 2) {
        t_slds_UpdateImages(rec, pos);
    }
    sliderWrapper.attr('data-slider-curr-pos', pos);
}

function t_slds_updateSlider(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    t_slds_SliderWidth(rec);
    var sliderWrapper = el.find('.t-slds__items-wrapper');
    var itemsInRow = sliderWrapper.attr('data-slider-items-in-row');
    var sliderWidth = itemsInRow && itemsInRow > 0 ? el.find('.t-slds__container .t-slds__item').width() : el.find('.t-slds__container').width();
    var pos = parseFloat(sliderWrapper.attr('data-slider-pos'), 10);
    var totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides'), 10);

    if (pos > totalSlides+1) {
        pos = 1;
        sliderWrapper.attr('data-slider-pos', 1);
    }

    sliderWrapper.css({
        transform: 'translateX(-' + (sliderWidth * pos) + 'px)'
    });
    if (sliderWrapper.attr('data-slider-correct-height') == 'true') {
        t_slds_UpdateSliderHeight(rec);
    }
    t_slds_UpdateSliderArrowsHeight(rec);
}

function t_slds_UpdateImages(rec, pos) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        item = el.find('.t-slds__item[data-slide-index="' + pos + '"]');
    item.addClass('t-slds__item-loaded');
    item.next().addClass('t-slds__item-loaded');
    item.prev().addClass('t-slds__item-loaded');
}

function t_slds_ActiveCaption(rec, pos, totalSlides) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        caption = el.find('.t-slds__caption'),
        captionActive = el.find('.t-slds__caption[data-slide-caption="' + pos + '"]');
    caption.removeClass('t-slds__caption-active');
    if (pos == 0) {
        captionActive = el.find('.t-slds__caption[data-slide-caption="' + totalSlides + '"]');
    } else if (pos == totalSlides + 1) {
        captionActive = el.find('.t-slds__caption[data-slide-caption="1"]');
    }
    captionActive.addClass('t-slds__caption-active');
}

function t_slds_scrollImages(rec, distance) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        value = (distance < 0 ? "" : "-") + Math.abs(distance).toString();
    el.find(".t-slds__items-wrapper").css("transform", "translateX(" + value + "px)");
}

function t_slds_ActiveBullet(rec, pos, totalSlides, sliderOptions) {
    var maxThumbsCount;

    if (sliderOptions && sliderOptions.thumbsbulletGallery) {
        var columnSizeForMainImage = parseInt(sliderOptions.storeOptions.popup_opts.columns);
        var galleryImageAspectRatio = +sliderOptions.storeOptions.slider_slidesOpts.ratio;
        maxThumbsCount = t_store_prodPopup_gallery_calcMaxThumbsCount(columnSizeForMainImage, galleryImageAspectRatio, 60, 10);
    }
    
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        bullet = el.find('.t-slds__bullet'),
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="' + pos + '"]');
    bullet.removeClass('t-slds__bullet_active');
    if ((sliderOptions && sliderOptions.thumbsbulletGallery) && (pos >=maxThumbsCount && pos !=totalSlides + 1) || (totalSlides >=maxThumbsCount && pos == 0)) {
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="' + maxThumbsCount + '"]');
    } else if (pos == 0) {
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="' + totalSlides + '"]');
    } else if (pos == totalSlides + 1) {
        bulletActive = el.find('.t-slds__bullet[data-slide-bullet-for="1"]');
    }
    bulletActive.addClass('t-slds__bullet_active');
}

function t_slds_ActiveSlide(rec, pos, totalSlides) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        slide = el.find('.t-slds__item'),
        slideActive = el.find('.t-slds__item[data-slide-index="' + pos + '"]'),
        sliderNotAnimated = el.find('.t-slds__items-wrapper').hasClass('t-slds_animated-none');
    slide.removeClass('t-slds__item_active');
    if (pos == 0 && sliderNotAnimated == !1) {
        el.find('.t-slds__item[data-slide-index="' + totalSlides + '"]').addClass('t-slds__item_active');
    } else if (pos == 0 && sliderNotAnimated == !0) {
        slideActive = el.find('.t-slds__item[data-slide-index="' + totalSlides + '"]');
    } else if (pos == totalSlides + 1 && sliderNotAnimated == !1) {
        el.find('.t-slds__item[data-slide-index="' + 1 + '"]').addClass('t-slds__item_active');
    } else if (pos == totalSlides + 1 && sliderNotAnimated == !0) {
        slideActive = el.find('.t-slds__item[data-slide-index="1"]');
    }
    slideActive.addClass('t-slds__item_active');
}

function t_slds_SliderWidth(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        sliderContainerWidth = el.find('.t-slds__container').width(),
        totalSlides = el.find('.t-slds__item').length,
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        stopSlider = sliderWrapper.attr('data-slider-stop'),
        itemsInRow = sliderWrapper.attr('data-slider-items-in-row');
    if (stopSlider == 'true') {
        return !1;
    }
    el.find('.t-slds__items-wrapper').width(sliderContainerWidth * totalSlides);
    if (window.innerWidth <= 640) {
        itemsInRow = 1;
    } else if (window.innerWidth <= 960 && itemsInRow > 1) {
        itemsInRow = 2;
    }
    var itemWidth = itemsInRow && itemsInRow > 1
        ? sliderContainerWidth / itemsInRow
        : sliderContainerWidth;
    el.find('.t-slds__item').width(itemWidth);
}

function t_slds_SliderHeight(rec) {
    
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    var sliderWrapper = el.find('.t-slds__items-wrapper').not('[data-slider-correct-height="false"]');
    // correct height only for items with data-slider-correct-height attibute
    sliderWrapper.css('height', el.find('.t-slds__item_active').height());
}
function t_slds_UpdateSliderHeight(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    
    var sliderWrapper = el.find('.t-slds__items-wrapper').not('[data-slider-correct-height="false"]');
    sliderWrapper.css('height', el.find('.t-slds__item_active').height());
}

function t_slds_SliderArrowsHeight(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    el.find('.t-slds__arrow_wrapper').css('height', el.find('.t-slds__item_active').height());
}

function t_slds_UpdateSliderArrowsHeight(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    el.find('.t-slds__arrow_wrapper').css('height', el.find('.t-slds__item_active').height());
}

function t_slds_initAutoPlay(rec, pos, totalSlides, sliderOptions) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
        sliderContainer = el.find('.t-slds'),
        sliderWrapper = el.find('.t-slds__items-wrapper'),
        sliderTimeOut = parseFloat(sliderWrapper.attr('data-slider-timeout')),
        cycle = '',
        stopSlider = sliderWrapper.attr('data-slider-stop'),
        galleryIntervalIdAttr = sliderWrapper.attr('data-slider-interval-id');

    if (galleryIntervalIdAttr) {
        clearInterval(galleryIntervalIdAttr);
    }

    if (stopSlider == 'true') {
        return !1;
    }

    if (!window.isMobile) {
        sliderContainer.hover(function() {
            sliderWrapper.attr('data-slider-stopped', 'yes');
        }, function() {
            sliderWrapper.attr('data-slider-stopped', '');
        });
    }

    $(window).bind("scroll", t_throttle(function() {
        var elementTop = el.offset().top;
        var elementBottom = elementTop + el.outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();
        if(elementBottom > viewportTop && elementTop < viewportBottom) {
            sliderWrapper.attr("data-slider-stopped", "");
        } else {
            sliderWrapper.attr("data-slider-stopped", "yes");
        }
    }, 200));

    var galleryIntervalId = setInterval(function() {
        var wst = $(window).scrollTop();
        var wh = $(window).height();
        var eot = el.offset().top;
        var eih = el.innerHeight();
        var stopped = sliderWrapper.attr('data-slider-stopped');
        var ignorehover = sliderWrapper.attr('data-slider-autoplay-ignore-hover');
        var isSliderTouch = sliderWrapper.attr('data-slider-touch');

        var currentTranslate = t_slds_getCurrentTranslate(el);

        if (((wst + wh) > eot) && ((eot + eih) > wst) && stopped != 'yes' && ignorehover != 'yes' && isSliderTouch != 'yes') {
            if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == totalSlides) {
                pos = totalSlides;
            } else {
                pos++;
            }

            sliderWrapper.attr('data-slider-pos', pos);
            if ((pos == (totalSlides + 1)) || (pos == 0)) {
                cycle = 'yes';
            }
            t_slideMove(rec, true, sliderOptions, currentTranslate);
            if (cycle == 'yes') {
                if (pos == (totalSlides + 1)) {
                    pos = 1;
                }
                if (pos == 0) {
                    pos = totalSlides;
                }
                sliderWrapper.attr('data-slider-pos', pos);
            }
            sliderWrapper.attr('data-slider-cycle', cycle);
        }
    }, sliderTimeOut);
    sliderWrapper.attr('data-slider-interval-id', galleryIntervalId);
}

function t_slds_positionArrows(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec),
    container = el.find(".t-slds__arrow_container-outside"), inner = el.find(".t-slds__item").width(), arrowleft = el.find(".t-slds__arrow-left").width(), arrowright = el.find(".t-slds__arrow-right").width();
    container.css({
        'max-width': (arrowleft + arrowright + inner + 120 + 'px')
    });
}

function t_slds_initSliderSwipe(rec, totalSlides, windowWidth, sliderOptions) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    var sliderWrapper = el.find('.t-slds__items-wrapper'),
        stopSlider = sliderWrapper.attr('data-slider-stop');

    var timeout;
    var isScrolling = !1;
    if (stopSlider == 'true') {
        return !1;
    }

    delete Hammer.defaults.cssProps.userSelect;

    hammer = new Hammer(el.find('.t-slds__items-wrapper')[0], {
        domEvents: true,
        inputClass: Hammer.TouchInput,
        recognizers: [
            [Hammer.Pan, {
                direction: Hammer.DIRECTION_HORIZONTAL
            }]
        ]
    });

    $(window).bind('scroll', function() {
        isScrolling = !0;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            isScrolling = !1;
        }, 250);
    });

    if (totalSlides == 1) {
        return !1;
    }

    hammer.on('pan', function(event) {
        if (isScrolling) {
            return !1;
        }
        var sliderWrapper = el.find('.t-slds__items-wrapper'),
            itemsInRow = sliderWrapper.attr('data-slider-items-in-row'),
            withSingleMove = itemsInRow && itemsInRow > 1,
            sliderWidth = withSingleMove ? el.find('.t-slds__container .t-slds__item').width() : el.find('.t-slds__container').width(),
            pos = parseFloat(sliderWrapper.attr('data-slider-pos')),
            totalSlides = parseFloat(sliderWrapper.attr('data-slider-totalslides')),
            cycle = '',
            distance = event.deltaX,
            percentage = 100 / totalSlides * event.deltaX / $(window).innerWidth(),
            sensitivity = 20,
            stopSlider = sliderWrapper.attr('data-slider-stop');
        if (stopSlider == 'true') {
            return !1;
        }
        sliderWrapper.attr('data-slider-touch', 'yes');
        t_slds_scrollImages(rec, (sliderWidth * pos) - distance);
        if (event.isFinal) {
            if (event.velocityX > 1) {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                    pos = 1;
                } else {
                    pos--;
                }
                sliderWrapper.attr('data-slider-pos', pos);
                if (pos == 0) {
                    cycle = 'yes';
                }
                sliderWrapper.attr('data-slider-cycle', cycle);
                t_slideMove(rec, false, sliderOptions);
            } else if (event.velocityX < -1) {
                if (sliderWrapper.attr('data-slider-with-cycle') == 'false'
                    && (pos == totalSlides || withSingleMove && pos == totalSlides - itemsInRow + 1)) {
                    pos = withSingleMove ? totalSlides - itemsInRow : totalSlides;
                } else {
                    pos++;
                }
                sliderWrapper.attr('data-slider-pos', pos);
                if (pos == (totalSlides + 1)) {
                    cycle = 'yes';
                }
                sliderWrapper.attr('data-slider-cycle', cycle);
                t_slideMove(rec, false, sliderOptions);
            } else {
                if (percentage <= -(sensitivity / totalSlides)) {
                    if (sliderWrapper.attr('data-slider-with-cycle') == 'false'
                        && (pos == totalSlides || withSingleMove && pos == totalSlides - itemsInRow + 1)) {
                            pos = withSingleMove ? totalSlides - itemsInRow : totalSlides;
                    } else {
                        pos++;
                    }
                    sliderWrapper.attr('data-slider-pos', pos);
                    if (pos == (totalSlides + 1)) {
                        cycle = 'yes';
                    }
                    sliderWrapper.attr('data-slider-cycle', cycle);
                    t_slideMove(rec, false, sliderOptions);
                } else if (percentage >= (sensitivity / totalSlides)) {
                    if (sliderWrapper.attr('data-slider-with-cycle') == 'false' && pos == 1) {
                        pos = 1;
                    } else {
                        pos--;
                    }
                    sliderWrapper.attr('data-slider-pos', pos);
                    if (pos == 0) {
                        cycle = 'yes';
                    }
                    sliderWrapper.attr('data-slider-cycle', cycle);
                    t_slideMove(rec, false, sliderOptions);
                } else {
                    t_slideMove(rec, false, sliderOptions);
                }
            }
            sliderWrapper.attr('data-slider-touch', '');
        }
    });

    hammer.on('panend', function() {
        t_slideMove(rec, false, sliderOptions);
    });
}

function t_slds_getCurrentTranslate(el) {
    var sliderWrapper = el.find('.t-slds__items-wrapper');
    var transform = sliderWrapper[0].style.transform;
    if (sliderWrapper && transform !== undefined && transform !== '') {
        var match = transform.match(/\d+/g);
        if (match !== null) {
            return parseInt(match[0], 10);
        }
    }
}

function t_slds_changeImageUrl(rec) {
    var el = typeof rec === 'object' ? rec : $('#rec' + rec);
    el.find('.t-slds__img').each(function() {
        var $this = $(this);
        if ($this.attr('data-src') !== undefined) {
            $this = $(this);
            $this.attr('src', $this.attr('data-src'));
            $this.removeAttr('data-src');
        }
    });
}
