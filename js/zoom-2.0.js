function t_initZoom() {
    var fullZoomActiveClass = $isMobile ? '' : 'showed';

    if ($('[data-zoomable="yes"]').length) {
        window.tzoominited = true;
        $('[data-zoomable="yes"]:not(.t-slds__thumbs_gallery)').addClass("t-zoomable");
        $("body").append('<div class="t-zoomer__wrapper">\
      <div class="t-zoomer__container">\
      </div>\
      <div class="t-zoomer__bg"></div>\
      <div class="t-zoomer__close">\
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">\
            <path d="M1.41421 -0.000151038L0 1.41406L21.2132 22.6273L22.6274 21.2131L1.41421 -0.000151038Z" fill="black"/>\
            <path d="M22.6291 1.41421L21.2148 0L0.00164068 21.2132L1.41585 22.6274L22.6291 1.41421Z" fill="black"/>\
        </svg>\
      </div>\
      <div class="t-zoomer__scale '+ fullZoomActiveClass +'">\
        <svg class="icon-increase" width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">\
            <path d="M22.832 22L17.8592 17.0273" stroke="black" stroke-width="2" stroke-linecap="square"/>\
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.58591 3.7511C0.917768 7.41924 0.917768 13.367 4.58591 17.0352C8.25405 20.7033 14.2019 20.7033 17.87 17.0352C21.5381 13.367 21.5381 7.41924 17.87 3.7511C14.2019 0.0829653 8.25405 0.0829653 4.58591 3.7511Z" stroke="black" stroke-width="2"/>\
            <path d="M6.25781 10.3931H16.2035" stroke="black" stroke-width="2"/>\
            <path d="M11.2305 15.3662V5.42053" stroke="black" stroke-width="2"/>\
        </svg>\
        <svg class="icon-decrease" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\
            <path d="M21.9961 22L17.0233 17.0273" stroke="black" stroke-width="2" stroke-linecap="square"/>\
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.74997 3.7511C0.0818308 7.41924 0.0818308 13.367 3.74997 17.0352C7.41811 20.7033 13.3659 20.7033 17.0341 17.0352C20.7022 13.367 20.7022 7.41924 17.0341 3.7511C13.3659 0.0829653 7.41811 0.0829653 3.74997 3.7511Z" stroke="black" stroke-width="2"/>\
            <path d="M5.41797 10.3931H15.3637" stroke="black" stroke-width="2"/>\
        </svg>\
      </div>\
    </div>');
        t_showZoom();
        $('.t-zoomer__close, .t-zoomer__bg').click(function () {
            // console.log('unbind');
            t_zoom_unscale();
            $('.t-zoomer__scale').unbind();
            $('body').removeClass("t-zoomer__show");
            $('body').removeClass("t-zoomer__show_fixed");
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
            $(document).unbind('keydown');
            var isPopupShown = $(document).find('.t-popup_show').length != 0;
            if (isPopupShown) {
                $(document).keydown(function (e) {
                    if (e.keyCode == 27) {
                        $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
                        t_store_closePopup(false);
                    }
                });
            }

        });
    }
}

function t_showZoom() {
    $('.t-records').on('click', '.t-zoomable', t_zoomHandler);
    $('.t-records').on('click', '.t-slds__thumbs_gallery', t_zoomHandler);
}

function t_zoomHandler() {
    $(document).unbind('keydown');
    $("body").addClass("t-zoomer__show");
    $(".t-zoomer__container").html('<div class="t-carousel__zoomed">\
      <div class="t-carousel__zoomer__slides">\
        <div class="t-carousel__zoomer__inner">\
        </div>\
        <div class="t-carousel__zoomer__control t-carousel__zoomer__control_left" data-zoomer-slide="prev">\
          <div class="t-carousel__zoomer__arrow__wrapper t-carousel__zoomer__arrow__wrapper_left">\
            <div class="t-carousel__zoomer__arrow t-carousel__zoomer__arrow_left t-carousel__zoomer__arrow_small"></div>\
          </div>\
        </div>\
        <div class="t-carousel__zoomer__control t-carousel__zoomer__control_right" data-zoomer-slide="next">\
          <div class="t-carousel__zoomer__arrow__wrapper t-carousel__zoomer__arrow__wrapper_right">\
            <div class="t-carousel__zoomer__arrow t-carousel__zoomer__arrow_right t-carousel__zoomer__arrow_small"></div>\
          </div>\
        </div>\
      </div>\
    </div>');

    var id = $(this).closest(".r").attr("id"),
        images = $("#" + id + "").find(".t-zoomable:not(.t-slds__thumbs_gallery)");
    if ($("#" + id + "").find(".t-slds").length) {
        var slider = $(this).closest(".t-slds");
        if (slider.length) {
            images = slider.find(".t-zoomable:not(.t-slds__thumbs_gallery)");
        }
    }

    images.each(function () {
        var imgtitle, imgdescr, titlebody, descrbody;
        var images_urls = $(this).attr('data-img-zoom-url').split(',');
        if ($(this).is("img")) {
            imgtitle = $(this).attr('title');
            imgdescr = $(this).attr('data-img-zoom-descr');
        }
        if ($(this).is("div")) {
            imgtitle = $(this).attr('title');
            imgdescr = $(this).attr('data-img-zoom-descr');
        }
        if (typeof imgtitle !== "undefined" && imgtitle !== !1) {
            titlebody = "<div class=\"t-zoomer__title t-name t-descr_xxs\">" + imgtitle + "</div>";
        } else {
            titlebody = "";
        }
        if (typeof imgdescr !== "undefined" && imgdescr !== !1) {
            descrbody = "<div class=\"t-zoomer__descr t-descr t-descr_xxs\">" + imgdescr + "</div>";
        } else {
            descrbody = "";
        }
        $(".t-carousel__zoomer__inner").append("<div class=\"t-carousel__zoomer__item\"><div class=\"t-carousel__zoomer__wrapper\"><img class=\"t-carousel__zoomer__img\" src=\"" + images_urls + "\"></div><div class=\"t-zoomer__comments\">" + titlebody + descrbody + "</div></div>");
    });
    var image_descr = $(".t-carousel__zoomer__item");
    image_descr.each(function () {
        $(this).css("display", "block");
        var zoomercomments = $(this).find(".t-zoomer__comments");
        var zoomertitle = zoomercomments.find('.t-zoomer__title');
        var zoomerdescr = zoomercomments.find('.t-zoomer__descr');
        if (!zoomertitle.length && !zoomerdescr.length) {
            zoomercomments.css('padding', '0');
        }
        var height = zoomercomments.innerHeight();
        $(this).css("display", "");
        var image_active = $(this).find(".t-carousel__zoomer__wrapper");
        image_active.css("bottom", height);
    });
    var target_url = $(this).attr("data-img-zoom-url"),
        target_img = $(".t-carousel__zoomer__img[src=\"" + target_url + "\"]"),
        slideItem = $(".t-carousel__zoomer__item"),
        target = target_img.closest(slideItem);
    target.show(0).addClass('active');
    slideItem.each(function () {
        $(this).attr("data-zoomer-slide-number", $(this).index());
    });
    var pos = parseFloat($(".t-carousel__zoomer__item:visible").attr("data-zoomer-slide-number"));
    $('.t-carousel__zoomer__control_right').click(function () {
        t_zoom_unscale();
        $('.t-zoomer__scale').unbind();
        $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
        
        pos = (pos + 1) % slideItem.length;
        slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
        t_zoom_checkForScale();
    });
    $('.t-carousel__zoomer__control_left').click(function () {
        t_zoom_unscale();
        $('.t-zoomer__scale').unbind();
        $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
        
        pos = (pos - 1) % slideItem.length;
        slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
        t_zoom_checkForScale();
    });
    $(document).keydown(function (e) {
        if (e.keyCode == 37) {
            t_zoom_unscale();
            $('.t-zoomer__scale').unbind();
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
            pos = (pos - 1) % slideItem.length;
            slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
            t_zoom_checkForScale();
        }
        if (e.keyCode == 39) {
            t_zoom_unscale();
            $('.t-zoomer__scale').unbind();
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
            pos = (pos + 1) % slideItem.length;
            slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
            t_zoom_checkForScale();
        }
        if (e.keyCode == 27) {
            $('body').removeClass("t-zoomer__show");
            $('body').removeClass("t-zoomer__show_fixed");
            $('.t-zoomer__scale').unbind();
            t_zoom_unscale();
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
            $(document).unbind('keydown');
            var isPopupShown = $(document).find('.t-popup_show').length != 0;
            if (isPopupShown) {
                $(document).keydown(function (e) {
                    if (e.keyCode == 27) {
                        $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
                        t_store_closePopup(false);
                    }
                });
            }
        }
    });
    var defaultSwipe;
    $(".t-carousel__zoomer__inner").bind('touchstart', function (e) {
        defaultSwipe = e.originalEvent.touches[0].clientX;
    });
    $(".t-carousel__zoomer__inner").bind('touchend', function (e) {
        var swiped = e.originalEvent.changedTouches[0].clientX;
        if (defaultSwipe > swiped + 50) {
            pos = (pos - 1) % slideItem.length;
            slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
        } else if (defaultSwipe < swiped - 50) {
            pos = (pos + 1) % slideItem.length;
            slideItem.hide(0).removeClass('active').eq(pos).show(0).addClass('active');
        }
    });
    var slides_count = $(".t-carousel__zoomer__item").size();
    if (slides_count > 1) {
        $('body').addClass("t-zoomer__show_fixed");
    } else {
        $(".t-carousel__zoomer__control").css("display", "none");
    }
    $('.t-carousel__zoomer__inner').click(function () {
        if ($(this).hasClass('scale-active')) {
            t_zoom_unscale();
        } else {
            $('.t-zoomer__scale').unbind();
            $('body').removeClass("t-zoomer__show");
            $('body').removeClass("t-zoomer__show_fixed");
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'none');
            t_zoom_unscale();
            $(document).unbind('keydown');
        }        
    });


    
    var lastScrollTop = 0;

    $(window).scroll(function () {
        var st = $(this).scrollTop();
        if (st > lastScrollTop) {
            $('body').not('.t-zoomer__show_fixed').removeClass("t-zoomer__show");
            $(document).unbind('keydown');
        }
        lastScrollTop = st;
    });  

    t_zoom_checkForScale();
}

function t_zoom_checkForScale() {
    var eventAdded = false;
    var zoomedImage = $('.t-carousel__zoomer__item.active .t-carousel__zoomer__img');

    if (!zoomedImage.length) {
        return;
    }
    // on first gallery open wait image load
    zoomedImage.load(function() {
        if (eventAdded) {
            return;
        }
        if ($(window).width() < zoomedImage[0].naturalWidth || $(window).height() < zoomedImage[0].naturalHeight ) {
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'block');
            t_zoom_scale_init();
            return; 
        }
    });   
    // on second gallery open 
    if (zoomedImage[0].complete && !eventAdded) {
        eventAdded = true;
        if ($(window).width() < zoomedImage[0].naturalWidth || $(window).height() < zoomedImage[0].naturalHeight) {
            $('.t-zoomer__wrapper .t-zoomer__scale').css('display', 'block');
            t_zoom_scale_init();
            return; 
        }
    }
    
}

function t_zoom_scale_init() {

    $('.t-zoomer__scale').click(function (e) {

        var zoomedImage = $('.t-carousel__zoomer__item.active .t-carousel__zoomer__img');
        var zoomedWrapper = $('.t-zoomer__wrapper');
        var zoomerInner = $('.t-carousel__zoomer__inner');

        if (zoomedWrapper.hasClass('scale-active')) {
            t_zoom_unscale();
        } else {
            var axis = [];
            if ($(window).width() < zoomedImage[0].naturalWidth) {
                axis.push('x');
            }
            if ($(window).height() < zoomedImage[0].naturalHeight) {
                axis.push('y');
            }
            axis = axis.join('');
            
            if (axis.length === 0) {
                return;
            }

            zoomedWrapper.addClass('scale-active');
            zoomerInner.addClass('scale-active');
            
            var leftCoordinate = ($(window).width() - zoomedImage.width()) / 2;
            var topCoordinate = ($(window).height() - zoomedImage.height()) / 2;

            zoomedImage.css("left", leftCoordinate);
            zoomedImage.css("top", topCoordinate);

            var clientYpercent;
            var imageYpx;
            var clientXpercent;
            var imageXpx;
            switch (axis) {
                case 'x':
                    clientXpercent = (e.clientX * 100) / $(window).width();
                    imageXpx = -(clientXpercent * (zoomedImage.width() - $(window).width())) / 100;
                    zoomedImage.css("left", imageXpx + 'px');
                    zoomedImage.mousemove(function (e) {
                        clientXpercent = (e.clientX * 100) / $(window).width();
                        imageXpx = -(clientXpercent * (zoomedImage.width() - $(window).width())) / 100;
                        zoomedImage.css("left", imageXpx + 'px');
                    });
                    break;
                case 'y':
                    clientYpercent = (e.clientY * 100) / $(window).height();
                    imageYpx = -(clientYpercent * (zoomedImage.height() - $(window).height())) / 100;
                    zoomedImage.css("top", imageYpx + 'px');
                    zoomedImage.mousemove(function (e) {
                        clientYpercent = (e.clientY * 100) / $(window).height();
                        imageYpx = -(clientYpercent * (zoomedImage.height() - $(window).height())) / 100;
                        zoomedImage.css("top", imageYpx + 'px');
                    });
                    break;
                case 'xy':
                    clientYpercent = (e.clientY * 100) / $(window).height();
                    imageYpx = -(clientYpercent * (zoomedImage.height() - $(window).height())) / 100;
                    clientXpercent = (e.clientX * 100) / $(window).width();
                    imageXpx = -(clientXpercent * (zoomedImage.width() - $(window).width())) / 100;
                    zoomedImage.css("top", imageYpx + 'px');
                    zoomedImage.css("left", imageXpx + 'px');
                    zoomedImage.mousemove(function (e) {
                        clientYpercent = (e.clientY * 100) / $(window).height();
                        imageYpx = -(clientYpercent * (zoomedImage.height() - $(window).height())) / 100;
                        clientXpercent = (e.clientX * 100) / $(window).width();
                        imageXpx = -(clientXpercent * (zoomedImage.width() - $(window).width())) / 100;
                        zoomedImage.css("top", imageYpx + 'px');
                        zoomedImage.css("left", imageXpx + 'px');
                    });
                    break;

                default:
                    break;
            }
        }
    });
}


function t_zoom_unscale() {
    // console.log('deactivate');
    // $('.t-zoomer__scale').unbind();
    var zoomedImage = $('.t-carousel__zoomer__item.active .t-carousel__zoomer__img');
    var zoomedWrapper = $('.t-zoomer__wrapper.scale-active');
    var zoomerInner = $('.t-carousel__zoomer__inner');
    zoomedImage.unbind();
    zoomedWrapper.removeClass('scale-active');
    zoomerInner.removeClass('scale-active');
    zoomedImage.css("left", "0");
    zoomedImage.css("top", "0");
}

$(document).ready(function () {
    t_initZoom();
});
