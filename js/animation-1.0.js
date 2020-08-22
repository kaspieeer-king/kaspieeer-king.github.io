$(document).ready(function() {
    t_animate__init();
});

function t_animate__getAttrByRes($el, attr) {
    var width = $(window).width();
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
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr);
        return attrValue;
    }
    if (width >= 640) {
        attrValue = $el.attr('data-animate-'+attr+'-res-640');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-960');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr);
        return attrValue;
    }
    if (width >= 480) {
        attrValue = $el.attr('data-animate-'+attr+'-res-480');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-640');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-960');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr);
        return attrValue;
    }
    if (width >= 320) {
        attrValue = $el.attr('data-animate-'+attr+'-res-320');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-480');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-640');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr+'-res-960');
        if (!attrValue) attrValue = $el.attr('data-animate-'+attr);
        return attrValue;
    }
}

function t_animate__init() {
    if (window.isSearchBot == 1 ||
        $(".t-records").attr("data-blocks-animationoff") == 'yes' ||
        t_animate__checkIE() ||
        $(".t-records").attr("data-tilda-mode") == "edit") {
        $(".t-animate").removeClass("t-animate");
        return;
    }
    t_animate__wrapTextWithOpacity();
    t_animate__addNoHoverClassToBtns();
    /*prevent page from horizontal scroll*/
    if ($('[data-animate-style=fadeinleft]:not(.t396__elem)').length > 0) {
        $('.t-records#allrecords').css('overflow-x', 'hidden');
        setTimeout(function() {
            var style = $('.t-records#allrecords').attr('style');
            if(style.indexOf('overflow-x') !== -1) {
                $('.t-records#allrecords').css('overflow-x', '');
            }
        }, 5000);
    }
    var animElemsNumber = $(".t-animate[data-animate-style='animatednumber']");
    if ($(window).width() >= 1200 ) t_animate__parseNumberText(animElemsNumber);
    setTimeout(function() {
        t_animate__startAnimation();
    }, 1500);
}

function t_animate__checkMobile(elems) {
    elems.filter(function () {
        if ($(this).attr('data-animate-mobile')!=='y') {
            $(this).removeClass('t-animate');
            return false;
        }
        return true;
    });
    return elems;
}


function t_animate__startAnimation() {
    /* animGroupsBlocks contains connected elements, which animation starts at the same time */
    var animGroupsBlocks = $(".r").has(".t-animate[data-animate-group=yes]");
    /* animChainsBlocks contains elements, which are animated as a chain, row by row */
    var animChainsBlocks = $(".r").has(".t-animate[data-animate-chain=yes]");
    /* animElems contains independent single elements */
    var animElems = $(".t-animate:not([data-animate-group=yes]):not([data-animate-chain=yes])");
    if ($(window).width() < 1200) {
        animGroupsBlocks = t_animate__checkMobile(animGroupsBlocks);
        animChainsBlocks = t_animate__checkMobile(animChainsBlocks);
        animElems = t_animate__checkMobile(animElems);
    }
    if ((typeof animGroupsBlocks == "undefined" || animGroupsBlocks.length == 0) && (typeof animElems == "undefined" || animElems.length == 0) && (typeof animChainsBlocks == "undefined" || animChainsBlocks.length == 0)) {
        return;
    }
    t_animate__setAnimationState(animGroupsBlocks, animChainsBlocks, animElems);
    animGroupsBlocks = animGroupsBlocks.filter(".r:has(.t-animate_wait)");
    animElems = animElems.filter(".t-animate_wait");
    animChainsBlocks = animChainsBlocks.filter(".r:has(.t-animate_wait)");
    /* cash offsets */
    function getOffsets() {
        t_animate__getGroupsOffsets(animGroupsBlocks);
        t_animate__getChainOffsets(animChainsBlocks);
        t_animate__getElemsOffsets(animElems);
    }
    getOffsets();
    $(window).bind('resize', t_throttle(getOffsets, 200));
    setInterval(getOffsets, 5000);
    /* end of cash offsets */
    $(window).bind('scroll', t_throttle(function() {
        t_animate__animateOnScroll(animGroupsBlocks, animChainsBlocks, animElems);
    }, 200));
}


/* ---------- functions, which do all animation work on scroll ---------- */


function t_animate__animateOnScroll(animGroupsBlocks, animChainsBlocks, animElems) {
    if (animGroupsBlocks.length == 0 && animChainsBlocks.length == 0 && animElems.length == 0) {
        return;
    }
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).height();
    /* smooth scroll check, dont't animate items, which stay above viewport */
    if ($("body").is(":animated")) {
        for (var s = 0; s < animGroupsBlocks.length; s++) {
            if (animGroupsBlocks[s].curTopOffset <= viewTop) {
                $(animGroupsBlocks[s]).find(".t-animate").removeClass("t-animate t-animate_wait t-animate_no-hover");
            }
        }
        for (var s = 0; s < animElems.length; s++) {
            if (animElems[s].curTopOffset <= viewTop) {
                $(animElems[s]).removeClass("t-animate t-animate_no-hover");
            }
        }
    }
    t_animate__animateGroups(animGroupsBlocks, viewBottom);
    t_animate__animateChainsBlocks(animChainsBlocks, viewBottom);
    t_animate__animateElems(animElems, viewBottom);
}


function t_animate__animateGroups(animGroupsBlocks, viewBottom) {
    if (animGroupsBlocks.length) {
        for (var s = 0; s < animGroupsBlocks.length; s++) {
            if (animGroupsBlocks[s].curTopOffset < viewBottom) {
                var curBlock = $(animGroupsBlocks[s]);
                var curBlockElems = curBlock.find(".t-animate:not([data-animate-chain=yes])");
                t_animate__makeSectionButtonWait(curBlock);
                curBlockElems = curBlockElems.filter(".t-animate:not(.t-animate__btn-wait-chain)");
                t_animate__saveSectionHeaderStartTime(curBlock);
                curBlockElems.removeClass("t-animate_wait");
                t_animate__removeNoHoverClassFromBtns(curBlockElems);
                curBlockElems.addClass("t-animate_started");
                animGroupsBlocks.splice(s, 1);
                s--;
            }
        }
    }
}


function t_animate__animateChainsBlocks(animChainsBlocks, viewBottom) {
    for (var j = 0; j < animChainsBlocks.length; j++) {
        var curBlock = $(animChainsBlocks[j]);
        if (animChainsBlocks[j].itemsOffsets[0] > viewBottom || curBlock.find(".t-animate_wait").length == 0) {
            continue;
        }
        /* t_animate__animateChainItemsOnScroll animates chain items, which are in viewport on current scroll event */
        t_animate__animateChainItemsOnScroll(animChainsBlocks, j, viewBottom);
        /* remove animated blocks from array */
        if (animChainsBlocks[j].itemsOffsets.length == 0) {
            animChainsBlocks.splice(j, 1);
            j--;
        }
        t_animate__checkSectionButtonAnimation__outOfTurn(curBlock);
    }
}


function t_animate__animateChainItemsOnScroll(animChainsBlocks, j, viewBottom) {
    var curBlock = $(animChainsBlocks[j]);
    var waitingChainItems = curBlock.find(".t-animate_wait[data-animate-chain=yes]");
    var itemOrder = 0;
    var rowOrder = 0;
    var rowOffset = animChainsBlocks[j].itemsOffsets[0];
    var chainDelay = 0.16;
    var delayFromPrevScroll = t_animate__getDelayFromPreviousScrollEvent(curBlock, waitingChainItems, chainDelay);
    var sectionHeadDelay = t_animate__getSectionHeadDealy(curBlock);
    /* we add class t-animate__chain_first-in-row to items, to let the new row be animated as soon,
    as the first element in previous row is animated*/
    $(waitingChainItems[0]).addClass("t-animate__chain_first-in-row");
    for (var s = 0; s < waitingChainItems.length; s++) {
        var item = $(waitingChainItems[s]);
        var itemTopOffset = animChainsBlocks[j].itemsOffsets[s];
        if (itemTopOffset < viewBottom) {
            if (itemTopOffset != rowOffset) {
                /* if we check next row at the same scroll event */
                item.addClass("t-animate__chain_first-in-row");
                rowOrder++;
                /* itemOrder = rowOrder - next row animation starts earlier, right after first item in prevoius one */
                itemOrder = rowOrder;
                rowOffset = itemTopOffset;
            }
            /*start item animation, set delay*/
            var curItemDelay = itemOrder * chainDelay + delayFromPrevScroll + sectionHeadDelay;
            item.css("transition-delay", curItemDelay + "s");
            item.removeClass("t-animate_wait");
            item.addClass("t-animate_started");
            item.attr("data-animate-start-time", (Date.now() + curItemDelay * 1000));
            if (item[0] == waitingChainItems.last()[0]) {
                t_animate__checkSectionButtonAnimation(curBlock, curItemDelay);
            }
            if (itemTopOffset == rowOffset) {
                itemOrder++;
            }
            /* remove animated cashed chain items and offsets */
            waitingChainItems.splice(s, 1);
            animChainsBlocks[j].itemsOffsets.splice(s, 1);
            s--;
        } else {
            break;
        }
    }
    t_animate__catchTransitionEndEvent(curBlock);
}


function t_animate__getSectionHeadDealy(curBlock) {
    var sectionTitle = curBlock.find(".t-section__title.t-animate");
    var sectionDescr = curBlock.find(".t-section__descr.t-animate");
    var sectionHeadDelay = 0;
    if (sectionTitle.length) {
        if ((Date.now() - sectionTitle.attr("data-animate-start-time")) <= 160) {
            sectionHeadDelay = 0.16;
            return sectionHeadDelay;
        }
    }
    if (sectionDescr.length) {
        if ((Date.now() - sectionDescr.attr("data-animate-start-time")) <= 160) {
            sectionHeadDelay = 0.16;
            return sectionHeadDelay;
        }
    }
    return sectionHeadDelay;
}


function t_animate__getDelayFromPreviousScrollEvent(curBlock, waitingChainItems, chainDelay) {
    /* In this function we count delay, if chain items from this block on previous scroll event didn't finish it's transition */
    var isFirstRow = (curBlock.find(".t-animate_started").length == 0);
    var notAnimated = curBlock.find(".t-animate__chain_first-in-row.t-animate_started:not(.t-animate__chain_showed)");
    /*return, if it is the first element in chain or all the items are already animated*/
    if (isFirstRow || notAnimated.length == 0) {
        return 0;
    }
    var lastNotAnimated = notAnimated.last();
    var lastNotAnimatedStart = lastNotAnimated.attr("data-animate-start-time");
    var timeGap = lastNotAnimatedStart - Date.now();
    if (timeGap <= 0) {
        return chainDelay;
    } else {
        return (timeGap / 1000 + chainDelay * 1);
    }
}


function t_animate__catchTransitionEndEvent(curBlock) {
    curBlock.find(".t-animate__chain_first-in-row.t-animate_started:not(.t-animate__chain_showed)").each(
        function() {
            $(this).on("TransitionEnd webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {
                $(this).addClass("t-animate__chain_showed");
                $(this).off(e);
            });
        }
    )
}


function t_animate__animateElems(animElems, viewBottom) {
    if (animElems.length) {
        for (var s = 0; s < animElems.length; s++) {
            var curElemTrigger = t_animate__detectElemTriggerOffset($(animElems[s]), viewBottom);
            if (animElems[s].curTopOffset < curElemTrigger) {
                $(animElems[s]).removeClass("t-animate_wait");
                t_animate__removeNoHoverClassFromBtns($(animElems[s]));
                $(animElems[s]).addClass("t-animate_started");
                if (t_animate__getAttrByRes($(animElems[s]), 'style')=='animatednumber') {
                    t_animate__animateNumbers($(animElems[s]));
                }
                animElems.splice(s, 1);
                s--;
            }
        }
    }
}


function t_animate__parseNumberText(curElem) {
    var viewTop = $(window).scrollTop();

    curElem.each(function() {
        var $this = $(this);
        var text = '';
        if ($this.find('div[data-customstyle="yes"]').length !== 0) {
            var style = '';
            $this.find('span').each(function() {
                style += $(this).attr('style');
                $(this).removeAttr('style');
                $(this).removeAttr('data-redactor-style');
            });

            text = $this.find('div[data-customstyle="yes"]').html();
            var newStyle = $this.attr('style');
            newStyle += $this.find('div[data-customstyle]').attr('style');
            $this.attr('style', newStyle);
        } else {
            var style = '';
            $this.find('span').each(function() {
                style += $(this).attr('style');
                $(this).removeAttr('style');
                $(this).removeAttr('data-redactor-style');
            });
            text = $this.html();
        }

        /* don't parse elems, who is above viewport and wont be animated */
        if ($(this).offset().top < (viewTop - 500)) {
            return;
        }

        if (text.length > 0) {
            var numberDotOrComma = text.replace(/[^\d\.\,\ ]+/g, '').match(/\d+\.\d+|\d+\,\d+/g);
            var removeNumberSpace = text.replace(/[^\d\.\,\ ]+/g, '').replace(/(\d)(?= \d) /g, '$1');
            var number = [];

            var numberWithoutLetter = removeNumberSpace.split(' ');
            numberWithoutLetter.forEach(function (item, i) {               
                if (!isNaN(parseInt(item.replace(/[^\d\.\,\ ]+/g, '')))) {
                    number.push(item.replace(/[^\d\.\,\ ]+/g, ''));
                }
            });

            number.forEach(function (item) {
                var symbolIndex = removeNumberSpace.indexOf(item);
                var num = removeNumberSpace.substr(symbolIndex, item.length);
                removeNumberSpace = removeNumberSpace.replace(num, 'num');
            });

            if (number) {
                number.forEach(function(item, i) {
                    if (numberDotOrComma !== null) {
                        var itemSplitArr;
                        if (item.indexOf(',') !== -1) {
                            itemSplitArr = item.split(',');
                        }
                        if (item.indexOf('.') !== -1) {
                            itemSplitArr = item.split('.');
                        }
                        if (item.indexOf(',') !== -1 || item.indexOf('.') !== -1) {
                            var lengthToFix = itemSplitArr[1].length;
                            number[i] = +itemSplitArr.join('.');
                            number[i] = number[i].toFixed(lengthToFix);
                        }
                    }
                });
                
                $this.attr('data-animate-number-count', text);

                number.forEach(function() {
                    t_animate__changeNumberOnZero($this, removeNumberSpace);
                });

                $this.find('span:not(.t-animate__number):first').each(function() {
                    $(this).attr('style', style);
                });
            }
        }
    });
}


function t_animate__changeNumberOnZero(el, removeNumberSpace) {
    var el;
    var textWithoutNumber;
    textWithoutNumber = removeNumberSpace.replace(/num/g, '<span class="t-animate__number">' + 0 + '</span>');

    el.html(textWithoutNumber);
}


function t_animate__animateNumbers(curElem) {
    curElem.each(function() {
        var $this = $(this);
        var text = $this.attr('data-animate-number-count');

        var style = [];
        $this.find('span:not(.t-animate__number):first').each(function() {
            style = $(this).attr('style');
        });

        if (text) {
            var numberDotOrComma = text.match(/\d+\.\d+|\d+\,\d+/g);
            var numberWithSpace = text.match(/\d+/g);
            var removeNumberSpace = text.replace(/(\d)(?= \d) /g, '$1');
            
            var numberWithoutLetter = removeNumberSpace.split(' ');
            var number = [];

            numberWithoutLetter.forEach(function (item, i) {               
                if (!isNaN(parseInt(item.replace(/[^\d\.\,\ ]+/g, '')))) {
                    number.push(item.replace(/[^\d\.\,\ ]+/g, ''));
                }
            });

            var decimalLength = 0;
            var isFloat = false;
            var isComma = false;
            $this.removeAttr('data-animate-number-count');

            if (numberDotOrComma != null) {
                isComma = numberDotOrComma[0].indexOf(',') == -1 ? false : true;
            }

            number.forEach(function (item, i) {
                if (numberDotOrComma !== null) {
                    var itemSplitArr;
                    if (item.indexOf(',') !== -1) {
                        itemSplitArr = item.split(',');
                    }
                    if (item.indexOf('.') !== -1) {
                        itemSplitArr = item.split('.');
                    }
                    if (item.indexOf(',') !== -1 || item.indexOf('.') !== -1) {
                        decimalLength = itemSplitArr[1].length;
                        number[i] = +itemSplitArr.join('.');
                        isFloat = true;
                    }
                }
            });

            var numberWrapper = [];
            $this.find('.t-animate__number').each(function() {
                numberWrapper.push($(this).text());
            });

            number.forEach(function (item, i) {
                $({
                    animateCounter: numberWrapper[i]
                }).animate({
                    animateCounter: item
                }, {
                    duration: 1500,
                    easing: 'swing',
                    step: function(isFloat) {
                        var animateNumberSpan = $this.find('.t-animate__number')[i];
                        var round = Math.pow(10, decimalLength);
                        var animationStep = isFloat ? (Math.round(this.animateCounter * round) / round).toFixed(decimalLength) + '' : Math.floor(this.animateCounter) + '';
                        animationStep = numberWithSpace.length > 1 ? animationStep.replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ') : animationStep;
                        isComma ? $(animateNumberSpan).text(animationStep.replace(/\./g, ',')) : $(animateNumberSpan).text(animationStep);
                    },
                    complete: function() {
                        $this.html(text);
                        $this.find('span').each(function() {
                            $(this).attr('style', style);
                        });
                    }
                });
            });
        }
    });
}


/* ---------- functions, which set animation state after $(document).ready() ---------- */


function t_animate__setAnimationState(animGroupsBlocks, animChainsBlocks, animElems) {
    var viewTop = $(window).scrollTop();
    var viewBottom = viewTop + $(window).height();
    animGroupsBlocks.each(function() {
        var curBlock = $(this);
        var curBlockAnimElems = curBlock.find(".t-animate:not([data-animate-chain=yes])");
        var curBlockOffset = curBlockAnimElems.first().offset().top;
        t_animate__removeAnimFromHiddenSlides(curBlock);
        var sectionHeadDelay = t_animate__assignSectionDelay(curBlock);
        t_animate__assignGroupDelay(curBlock, sectionHeadDelay);
        if (curBlockOffset <= (viewTop - 100)) {
            t_animate__saveSectionHeaderStartTime(curBlock);
            curBlockAnimElems.removeClass("t-animate t-animate_no-hover");
            curBlockAnimElems.css("transition-delay", "");
            return true;
        }
        if (curBlockOffset < viewBottom && curBlockOffset > (viewTop - 100)) {
            /* if button is part of section with chain animation, it should wait till the end of chain animation */
            t_animate__makeSectionButtonWait(curBlock);
            curBlockAnimElems = curBlockAnimElems.filter(".t-animate:not(.t-animate__btn-wait-chain)");
            t_animate__removeNoHoverClassFromBtns(curBlockAnimElems);
            curBlockAnimElems.addClass("t-animate_started");
        }
        if (curBlockOffset >= viewBottom) {
            curBlockAnimElems.addClass("t-animate_wait");
        }
    });
    animChainsBlocks.each(function() {
        var curBlock = $(this);
        t_animate__assignChainDelay(curBlock, viewBottom, viewTop);
        t_animate__checkSectionButtonAnimation__outOfTurn(curBlock);
    });

    animElems.each(function() {
        var curElem = $(this);
        var curElemOffsetTop = curElem.offset().top;
        if (curElemOffsetTop < (viewTop - 500)) {
            curElem.removeClass("t-animate t-animate_no-hover");

            /* fix for numbers with anchor link */
            if (t_animate__getAttrByRes(curElem, 'style')=='animatednumber') {
                t_animate__animateNumbers(curElem);
            }

            return true;
        }
        var curElemTrigger = t_animate__detectElemTriggerOffset(curElem, viewBottom);
        t_animate__setCustomAnimSettings(curElem, curElemOffsetTop, viewBottom);
        if (curElemOffsetTop < curElemTrigger) {
            t_animate__removeNoHoverClassFromBtns(curElem);
            curElem.addClass("t-animate_started");
            if (t_animate__getAttrByRes(curElem,'style')=='animatednumber') {
                t_animate__animateNumbers(curElem);
            }
        }
        if (curElemOffsetTop >= curElemTrigger) {
            curElem.addClass("t-animate_wait");
        }
    });
    $(window).bind('resize', t_throttle(t_animate__removeInlineAnimStyles, 200));
}


function t_animate__assignSectionDelay(curBlock) {
    var sectionHeadDelay = 0;
    var sectionTitle = curBlock.find(".t-section__title.t-animate"),
        sectionDescr = curBlock.find(".t-section__descr.t-animate"),
        sectionBtn = curBlock.find(".t-section__bottomwrapper .t-btn.t-animate");
    if (sectionTitle.length) {
        sectionHeadDelay = 0.16;
    }
    if (sectionDescr.length) {
        sectionDescr.css("transition-delay", sectionHeadDelay + "s");
        sectionHeadDelay = sectionHeadDelay + 0.16;
    }
    return sectionHeadDelay;
}


function t_animate__assignGroupDelay(curBlock, sectionHeadDelay) {
    var animDelay = 0;
    if (curBlock.find("[data-animate-order]").length) {
        t_animate__assignOrderedElemsDelay(curBlock, sectionHeadDelay);
    } else {
        var elemImg = curBlock.find(".t-img.t-animate"),
            elemSubtitle = curBlock.find(".t-uptitle.t-animate"),
            elemTitle = curBlock.find(".t-title.t-animate:not(.t-section__title)"),
            elemDescr = curBlock.find(".t-descr.t-animate:not(.t-section__descr)"),
            elemBtn = curBlock.find(".t-btn.t-animate:not(.t-section__bottomwrapper .t-btn)"),
            elemTimer = curBlock.find(".t-timer.t-animate"),
            elemForm = curBlock.find("form.t-animate");
        if (elemImg.length != 0) {
            animDelay = 0.5;
        }
        if (elemTitle.length != 0) {
            elemTitle.css("transition-delay", animDelay + "s");
        }
        if (elemTitle.length != 0) {
            animDelay = animDelay + 0.3;
        }
        if (elemDescr.length != 0) {
            elemDescr.css("transition-delay", animDelay + "s");
        }
        if (elemDescr.length != 0) {
            animDelay = animDelay + 0.3;
        }
        if (elemSubtitle.length != 0) {
            elemSubtitle.css("transition-delay", animDelay + "s");
        }
        if (elemSubtitle.length != 0) {
            animDelay = animDelay + 0.3;
        }
        if (elemSubtitle.length != 0 || elemTitle.length != 0 || elemDescr.length != 0) {
            animDelay = animDelay + 0.2;
        }
        if (elemTimer.length != 0) {
            elemTimer.css("transition-delay", animDelay + "s");
        }
        if (elemTimer.length != 0) {
            animDelay = animDelay + 0.5;
        }
        if (elemBtn.length != 0) {
            $(elemBtn.get(0)).css("transition-delay", animDelay + "s");
        }
        if (elemBtn.length == 2) {
            animDelay = animDelay + 0.4;
        }
        if (elemBtn.length == 2) {
            $(elemBtn.get(1)).css("transition-delay", animDelay + "s");
        }
        if (elemForm.length != 0) {
            elemForm.css("transition-delay", animDelay + "s");
        }
    }
}


function t_animate__assignOrderedElemsDelay(curBlock, sectionHeadDelay) {
    var animDelay = 0;
    if (typeof sectionHeadDelay != 'undefined' && sectionHeadDelay) {
        animDelay = sectionHeadDelay;
    }
    var elem1 = curBlock.find(".t-animate[data-animate-order=1]"),
        elem2 = curBlock.find(".t-animate[data-animate-order=2]"),
        elem3 = curBlock.find(".t-animate[data-animate-order=3]"),
        elem4 = curBlock.find(".t-animate[data-animate-order=4]"),
        elem5 = curBlock.find(".t-animate[data-animate-order=5]");
    elem6 = curBlock.find(".t-animate[data-animate-order=6]"),
        elem7 = curBlock.find(".t-animate[data-animate-order=7]"),
        elem8 = curBlock.find(".t-animate[data-animate-order=8]"),
        elem9 = curBlock.find(".t-animate[data-animate-order=9]");
    if (elem1.length) {
        elem1.css("transition-delay", animDelay + "s");
    }
    if (elem1.length && elem2.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem2, 'delay') * 1;
        elem2.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length) && elem3.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem3, 'delay') * 1;
        elem3.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length) && elem4.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem4, 'delay') * 1;
        elem4.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length || elem4.length) && elem5.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem5, 'delay') * 1;
        elem5.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length || elem4.length || elem5.length) && elem6.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem6, 'delay') * 1;
        elem6.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length || elem4.length || elem5.length || elem6.length) && elem7.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem7, 'delay') * 1;
        elem7.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length || elem4.length || elem5.length || elem6.length || elem7.length) && elem8.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem8, 'delay') * 1;
        elem8.css("transition-delay", animDelay + "s");
    }
    if ((elem1.length || elem2.length || elem3.length || elem4.length || elem5.length || elem6.length || elem7.length || elem8.length) && elem9.length) {
        animDelay = animDelay + t_animate__getAttrByRes(elem9, 'delay') * 1;
        elem9.css("transition-delay", animDelay + "s");
    }
}


function t_animate__assignChainDelay(curBlock, viewBottom, viewTop) {
    var chain = curBlock.find(".t-animate[data-animate-chain=yes]"),
        itemOrder = 0;
    if (chain.length != 0) {
        var rowOffset = $(chain[0]).offset().top;
        $(chain[0]).addClass("t-animate__chain_first-in-row");
        var sectionHeadDelay = t_animate__getCurBlockSectionHeadDelay(curBlock);
        chain.each(function() {
            var curItem = $(this);
            var curItemOffset = curItem.offset().top;
            if (curItemOffset < viewTop) {
                curItem.removeClass('t-animate');
                return true;
            }
            if (curItemOffset < viewBottom) {
                if (curItemOffset != rowOffset) {
                    curItem.addClass("t-animate__chain_first-in-row");
                    rowOffset = curItemOffset;
                }
                var curItemDelay = itemOrder * 0.16 + sectionHeadDelay;
                curItem.css("transition-delay", curItemDelay + "s");
                curItem.addClass("t-animate_started");
                curItem.attr("data-animate-start-time", (Date.now() + curItemDelay * 1000));
                if (curItem[0] == chain.last()[0]) {
                    t_animate__checkSectionButtonAnimation(curBlock, curItemDelay);
                }
                itemOrder++;
                curItem.on("TransitionEnd webkitTransitionEnd oTransitionEnd MSTransitionEnd", function(e) {
                    $(this).addClass("t-animate__chain_showed");
                    $(this).off(e);
                });
            } else {
                curItem.addClass("t-animate_wait");
            }
        });
    }
}


/* ---------- some helper functions ---------- */


function t_animate__setCustomAnimSettings(curElem, curElemOffsetTop, viewBottom) {
    /*check element custom distance*/
    var curElemStyle = t_animate__getAttrByRes(curElem, 'style');
    var curElemDistance = t_animate__getAttrByRes(curElem, 'distance');
    if (typeof curElemDistance != "undefined" && curElemDistance != "") {
        curElemDistance = curElemDistance.replace("px", "");
        /*to add new position fast, without transition duration, we need set it to 0s*/
        curElem.css({
            "transition-duration": "0s",
            "transition-delay": "0s"
        });
        if (curElemStyle == "fadeinup") {
            curElem.css("transform", "translate3d(0," + curElemDistance + "px,0)");
        }
        if (curElemStyle == "fadeindown") {
            curElem.css("transform", "translate3d(0,-" + curElemDistance + "px,0)");
        }
        if (curElemStyle == "fadeinleft") {
            curElem.css("transform", "translate3d(" + curElemDistance + "px,0,0)");
        }
        if (curElemStyle == "fadeinright") {
            curElem.css("transform", "translate3d(-" + curElemDistance + "px,0,0)");
        }
        t_animate__forceElemInViewPortRepaint(curElem, curElemOffsetTop, viewBottom);
        /*remove 0s transition duration*/
        curElem.css({
            "transition-duration": "",
            "transition-delay": ""
        });
    }
    /*check element custom scale*/
    var curElemScale = t_animate__getAttrByRes(curElem, 'scale');
    if (typeof curElemScale != "undefined" && curElemScale != "") {
        /*to add new position fast, without transition duration, we need set it to 0s*/
        curElem.css({
            "transition-duration": "0s",
            "transition-delay": "0s"
        });
        curElem.css("transform", "scale(" + curElemScale + ")");
        t_animate__forceElemInViewPortRepaint(curElem, curElemOffsetTop, viewBottom);
        /*remove 0s transition duration*/
        curElem.css({
            "transition-duration": "",
            "transition-delay": ""
        });
    }
    /*detect element delay*/
    var curElemDelay = t_animate__getAttrByRes(curElem, 'delay');
    if (typeof curElemDelay != "undefined" && curElemDelay != "") {
        curElem.css("transition-delay", curElemDelay + "s");
    }
    /*detect element transirtion duration*/
    var curElemDuration = t_animate__getAttrByRes(curElem, 'duration');
    if (typeof curElemDuration != "undefined" && curElemDuration != "") {
        curElem.css("transition-duration", curElemDuration + "s");
    }
}


function t_animate__removeInlineAnimStyles() {
    if ($(window).width() < 980) {
        $(".t396__elem.t-animate").css({
            "transform": "",
            "transition-duration": "",
            "transition-delay": ""
        });
    }
}


function t_animate__forceElemInViewPortRepaint(curElem, curElemOffsetTop, viewBottom) {
    if (curElemOffsetTop < (viewBottom + 500)) {
        curElem[0].offsetHeight;
    }
}


function t_animate__detectElemTriggerOffset(curElem, viewBottom) {
    var curElemTriggerOffset = t_animate__getAttrByRes(curElem, 'trigger-offset');
    var curElemTrigger = viewBottom;
    if (typeof curElemTriggerOffset != "undefined" && curElemTriggerOffset != "") {
        curElemTriggerOffset = curElemTriggerOffset.replace("px", "");
        curElemTrigger = viewBottom - curElemTriggerOffset * 1;
    }
    return curElemTrigger;
}


function t_animate__saveSectionHeaderStartTime(curBlock) {
    /*we save animation start time, to set right delay for chain items*/
    var sectionTitle = curBlock.find(".t-section__title.t-animate");
    var sectionDescr = curBlock.find(".t-section__descr.t-animate");
    if (sectionTitle.length) {
        sectionTitle.attr("data-animate-start-time", Date.now());
    }
    if (sectionDescr.length) {
        sectionDescr.attr("data-animate-start-time", (Date.now() + 160));
    }
}


function t_animate__getCurBlockSectionHeadDelay(curBlock) {
    var sectionHeadDelay = 0;
    if (curBlock.find(".t-section__title.t-animate").length != 0) {
        sectionHeadDelay += 0.16;
    }
    if (curBlock.find(".t-section__descr.t-animate").length != 0) {
        sectionHeadDelay += 0.16;
    }
    return sectionHeadDelay;
}


function t_animate__makeSectionButtonWait(curBlock) {
    var chainLength = curBlock.find(".t-animate[data-animate-chain=yes]").length;
    var sectionBtn = curBlock.find(".t-section__bottomwrapper .t-btn.t-animate");
    if (chainLength && sectionBtn) {
        sectionBtn.addClass("t-animate__btn-wait-chain");
    }
}


function t_animate__checkSectionButtonAnimation(curBlock, curItemDelay) {
    var chainBtn = curBlock.find(".t-animate__btn-wait-chain");
    if (chainBtn.length) {
        chainBtn.css("transition-delay", (curItemDelay + 0.16) + "s");
        t_animate__removeNoHoverClassFromBtns(chainBtn);
        chainBtn.removeClass("t-animate__btn-wait-chain");
        chainBtn.addClass("t-animate_started");
    }
}


function t_animate__checkSectionButtonAnimation__outOfTurn(curBlock) {
    var waitingChainItems = curBlock.find('.t-animate[data-animate-chain=yes]:not(.t-animate_started)');
    if (waitingChainItems.length === 0) {
        var chainDelay = 0.16;
        t_animate__checkSectionButtonAnimation(curBlock, chainDelay);
    }
}


function t_animate__addNoHoverClassToBtns() {
    $(".t-btn.t-animate").addClass('t-animate_no-hover');
}


function t_animate__removeNoHoverClassFromBtns(curBlockAnimElems) {
    curBlockAnimElems.filter('.t-btn').each(function() {
        var curBtn = $(this);
        curBtn.get(0).addEventListener("transitionend", function(e) {
            if (e.propertyName == "opacity" || e.propertyName == "transform") {
                $(this).removeClass("t-animate_no-hover");
                $(this).css("transition-delay", "");
                $(this).css("transition-duration", "");
                $(this).off(e);
            }
        });
    });
}


function t_animate__getGroupsOffsets(animGroupsBlocks) {
    for (var b = 0; b < animGroupsBlocks.length; b++) {
        if ($(animGroupsBlocks[b]).find(".t-animate").length > 0) {
            animGroupsBlocks[b].curTopOffset = $(animGroupsBlocks[b].querySelector(".t-animate")).offset().top;
        }
    }
}


function t_animate__getChainOffsets(animChainsBlocks) {
    for (var i = 0; i < animChainsBlocks.length; i++) {
        var curchain = $(animChainsBlocks[i]).find(".t-animate_wait[data-animate-chain=yes]");
        animChainsBlocks[i].itemsOffsets = [];
        for (var j = 0; j < curchain.length; j++) {
            if ($(curchain[j]).length > 0) {
                animChainsBlocks[i].itemsOffsets[j] = $(curchain[j]).offset().top;
            }
        }
    }
}


function t_animate__getElemsOffsets(animElems) {
    for (var b = 0; b < animElems.length; b++) {
        animElems[b].curTopOffset = $(animElems[b]).offset().top;
    }
}


function t_animate__removeAnimFromHiddenSlides(curBlock) {
    if (curBlock.find(".t-slides").length) {
        var hiddenSlides = curBlock.find(".t-slides__item:not(.t-slides__item_active) .t-animate");
        hiddenSlides.removeClass("t-animate t-animate_no-hover");
    }
}


function t_animate__wrapTextWithOpacity() {
    var textElements = $(".t-title.t-animate,.t-descr.t-animate,.t-uptitle.t-animate,.t-text.t-animate");
    textElements.each(function (i, el) {
        var style = $(this).attr("style");
        if (style !== undefined && style.indexOf("opacity") >= 0) {
            var opacity = $(el).css('opacity');
            if (opacity !== undefined && opacity > 0) {
                $(el).css("opacity", "");
                $(el).wrapInner('<div style="opacity: ' + opacity + '"></div>');
            }
        }
    });
}


function t_animate__checkIE() {
    var sAgent = window.navigator.userAgent,
        Idx = sAgent.indexOf("MSIE"),
        ieVersion = "",
        oldIE = false;
    if (Idx > 0) {
        ieVersion = parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
        if (ieVersion == 8 || ieVersion == 9) {
            oldIE = true;
        }
    }
    return oldIE;
}