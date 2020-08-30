function t_menusub_init(recid) {
    $('#rec' + recid + ' .t-menusub').each(function () {
        var hook = $(this).attr('data-submenu-hook');
        if (typeof hook == 'undefined' || hook == '') {
            return;
        }

        var hookLinks = '';
        var newVersion = false;

        $('#rec' + recid + ' a.t-menu__link-item').each(function () {
            if ($(this).attr('data-menu-submenu-hook')) {
                newVersion = true;
            }
        });

        if (newVersion) {
            hookLinks = $('a[data-menu-submenu-hook="' + hook + '"]');
        } else {
            hookLinks = $('a[href="' + hook + '"]');
        }

        hookLinks.addClass('t-menusub__target-link');
        hookLinks.attr('data-tooltip-menu-id', recid);
        t_menusub_add_arrow(recid, hookLinks, hook);
        t_menusub_set_up_menu(recid, hookLinks, hook);
        t_menusub_highlight();
    });


    $(window).bind('resize', function () {
        if (!isMobile) {
            $('#rec' + recid + ' .t-menusub').each(function () {
                t_menusub_hide_submenu($(this).find('.t-menusub__menu'));
            });
        }
    });

    $(window).bind('orientationchange', function () {
        if (isMobile) {
            $('#rec' + recid + ' .t-menusub').each(function () {
                t_menusub_hide_submenu($(this).find('.t-menusub__menu'));
            });
        }
    });
}

function t_menusub_set_up_menu(recid, hookLinks, hook) {
    var submenu = $('#rec' + recid + ' .t-menusub[data-submenu-hook="' + hook + '"] .t-menusub__menu');
    var content = submenu.find('.t-menusub__content');

    if (isMobile) {
        t_menusub_set_up_menu_mobile(recid, hookLinks, submenu);
    } else {
        t_menusub_set_up_menu_desktop(recid, hookLinks, submenu, hook);
    }

    $(window).bind('scroll', t_throttle(function () {
        content.hover(function() {
            /* to do nothing */
        }, function(){
            if (!isMobile) {
                if (submenu.hasClass('t-menusub__menu_show')) {
                    t_menusub_hide_submenu(submenu);
                }
            }
        });
    }, 300));
}

function t_menusub_open_inME401(wrapME401) {
    var submenuParentWrapper = wrapME401.find('.t280__menu__wrapper');
    if (!submenuParentWrapper.hasClass('t280__menu_static')) {
        wrapME401.find('.t280__menu').css('transition', 'none');
        wrapME401.find('.t280__bottom').css('transition', 'none');
        wrapME401.find('.t280__menu__wrapper').addClass('t280__menu_static');
    }
}

function t_menusub_close_inME401(wrapME401) {
    var submenuParentWrapper = wrapME401.find('.t280__menu__wrapper');
    if (submenuParentWrapper.hasClass('t280__menu_static')) {
        wrapME401.find('.t280__menu__wrapper').removeClass('t280__menu_static');
    }
}

function t_menusub_set_up_menu_mobile(recid, hookLinks, submenu) {
    var vIndent = $('#rec' + recid + ' .t-menusub').attr('data-submenu-margin');

    hookLinks.on('click', function (e) {
        if ($(window).width() > 980) {
            $('#rec' + recid + ' .t-menusub__menu').each(function () {
                t_menusub_hide_submenu($(this));
            });
        }
        if (submenu.hasClass('t-menusub__menu_show')) {
            t_menusub_hide_submenu(submenu);
        } else {
            var curAnchor = $(this);
            t_menusub_show(curAnchor, submenu, vIndent);

            var wrapME401 = $(this).parents('.t280');
            var isMobileHeight = t_menusub_is_mobile_ME401(wrapME401);
            t_menusub_is_static_ME401(wrapME401);
            var isStaticME401 = wrapME401.find('.t280__menu__wrapper').attr('data-submenu-static');

            if (isStaticME401 == 'n' && wrapME401.length > 0 && isMobileHeight) {
                t_menusub_open_inME401(wrapME401);
            }
        }
        e.preventDefault();
    });

    $(document).click(function (e) {
        var isInsideSubmenu =
            $(e.target).hasClass('t-menusub__menu') ||
            $(e.target).parents('.t-menusub__menu').length > 0;
        var isAnchor =
            $(e.target).hasClass('t-menusub__target-link') ||
            $(e.target).parents('.t-menusub__target-link').length > 0;
        if (isAnchor) {
            var curAnchor;
            if ($(e.target).hasClass('t-menusub__target-link')) {
                curAnchor = $(e.target);
            } else {
                curAnchor = $(e.target).parents('.t-menusub__target-link');
            }
            if (curAnchor.attr('data-tooltip-menu-id') != recid && submenu.hasClass('t-menusub__menu_show')) {
                t_menusub_hide_submenu(submenu);
            }
        }
        if (!isInsideSubmenu && !isAnchor && submenu.hasClass('t-menusub__menu_show')) {
            t_menusub_hide_submenu(submenu);
        }
    });
}

function t_menusub_set_up_menu_desktop(recid, hookLinks, submenu, hook) {
    var vIndent = $('#rec' + recid + ' .t-menusub').attr('data-submenu-margin');
    var timer;

    hookLinks.add(submenu).on('mouseover', function () {
        /*if submenu is hovered while disappearing*/
        if (
            $(this).hasClass('t-menusub__menu') &&
            !$(this).hasClass('t-menusub__menu_show')
        ) {
            return;
        }
        clearTimeout(timer);
        /*if link is already hoverd and now hover is on submenu element*/
        if (
            $(this).hasClass('t-menusub__menu') &&
            submenu.hasClass('t-menusub__menu_show')
        ) {
            return;
        }
        var curAnchor = $(this);
        t_menusub_show(curAnchor, submenu, vIndent);
    });

    hookLinks.add(submenu).on('mouseout', function () {
        timer = setTimeout(function () {
            t_menusub_hide_submenu(submenu);
        }, 300);
    });

    hookLinks.on('click auxclick', function (e) {
        e.preventDefault();
    });
}

function t_menusub_show(curAnchor, submenu, vIndent) {
    var submenuHeight = submenu.outerHeight();
    var submenuWidth = submenu.outerWidth();
    var anchorHeight = curAnchor.height();
    var anchorWidth = curAnchor.outerWidth();
    var anchorMarginLeft = parseInt(curAnchor.css('margin-left'));

    var winHeight = $(window).height();
    var winWidth = $(window).width();
    var scrollTop = $(window).scrollTop();
    var anchorLeft = curAnchor.position().left;

    if (typeof vIndent != 'undefined' && vIndent != '') {
        vIndent = vIndent.replace('px', '') * 1;
        vIndent = vIndent + 10;
    }

    var posy = curAnchor.position().top + anchorHeight + vIndent;
    var posx = anchorLeft;

    /*detect posy, show on the top or bottom?*/
    if (posy + submenuHeight > scrollTop + winHeight) {
        posy = Math.max(
            posy - submenuHeight - anchorHeight - vIndent * 2,
            scrollTop
        );
        submenu
            .removeClass('t-menusub__menu_bottom')
            .addClass('t-menusub__menu_top');
    } else {
        submenu
            .removeClass('t-menusub__menu_top')
            .addClass('t-menusub__menu_bottom');
    }

    if ($(window).width() <= 980) {
        posy = 0;
    }

    if (posx + submenuWidth / 2 < winWidth) {
        /*show in the center of anchor*/
        posx = posx + (anchorWidth - submenuWidth) / 2 + anchorMarginLeft;
        /*show near left window border*/
        if (posx < 0) {
            posx = 10;
        }
    } else {
        /*show near right window border*/
        posx = winWidth - submenuWidth - 10;
    }

    submenu.css({
        display: 'block',
        left: posx,
        top: posy
    });

    submenu.offsetHeight;
    submenu.addClass('t-menusub__menu_show');
    curAnchor.addClass('t-menusub__target-link_active');
}

function t_menusub_hide_submenu(submenu) {
    var wrapME401 = submenu.parents('.t280');
    var isMobileHeight = t_menusub_is_mobile_ME401(wrapME401);

    submenu.css({
        display: '',
        left: '',
        top: ''
    });

    submenu.removeClass('t-menusub__menu_show');
    $('.t-menusub__target-link_active').removeClass(
        't-menusub__target-link_active'
    );

    var isStaticME401 = wrapME401.find('.t280__menu__wrapper').attr('data-submenu-static');
    if (isStaticME401 == 'n' && isMobile && isMobileHeight) {
        t_menusub_close_inME401(wrapME401);
    }
}

function t_menusub_add_arrow(recid, hookLinks, hook) {
    var arrow = $(
        '#rec' + recid + ' .t-menusub[data-submenu-hook="' + hook + '"]'
    ).attr('data-add-submenu-arrow');

    if (typeof arrow == 'undefined' || arrow == '') {
        return;
    }

    hookLinks.each(function () {
        $(this).append(
            '<div class="t-menusub__arrow"></div>'
        );
    });
}

function t_menusub_highlight() {
    var url = window.location.href;
    var pathname = window.location.pathname;

    if (url.substr(url.length - 1) == '/') {
        url = url.slice(0, -1);
    }

    if (pathname.substr(pathname.length - 1) == '/') {
        pathname = pathname.slice(0, -1);
    }

    if (pathname.charAt(0) == '/') {
        pathname = pathname.slice(1);
    }

    if (pathname == '') {
        pathname = '/';
    }

    $('.t-menusub__list-item a[href="' + url + '"]').addClass('t-active');
    $('.t-menusub__list-item a[href="' + url + '/"]').addClass('t-active');
    $('.t-menusub__list-item a[href="' + pathname + '"]').addClass('t-active');
    $('.t-menusub__list-item a[href="/' + pathname + '"]').addClass('t-active');
    $('.t-menusub__list-item a[href="' + pathname + '/"]').addClass('t-active');
    $('.t-menusub__list-item a[href="/' + pathname + '/"]').addClass(
        't-active'
    );
}

function t_menusub_is_static_ME401(wrapME401) {
    if (!wrapME401.find('.t280__menu__wrapper').hasClass('t280__menu_static')) {
        wrapME401.find('.t280__menu__wrapper').attr('data-submenu-static', 'n');
    }
}

function t_menusub_is_mobile_ME401(wrapME401) {
    var menuHeight = wrapME401.find('.t280__menu').height();
    var menuBottomHeight = wrapME401.find('.t280__bottom').height();
    var menuHeaderHeight = wrapME401.find('.t280__container').height();
    var wrapperHeight = $(window).height() - menuBottomHeight - menuHeaderHeight - 40;
    if (menuHeight > wrapperHeight) {
        return true;
    }
    return false;
}
