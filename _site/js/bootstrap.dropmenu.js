!function ($) {

    "use strict"; // jshint ;_;

    var DropMenu = function ($options, $element) {
        this.$options = this.getOptions($options, $element);
        this.$element = $element;

        return this;
    }

    var old = $.fn.dropmenu;

    $.fn.dropmenu = function (options) {
        return this.each(function () {
            var $options = $.extend({}, options || {});
            var $element = $(this);

            var plugin = new DropMenu($options, $element);

            $(window).on('resize.dropmenu.data-api', { options: $options, element: $element }, plugin.getDropMenu);
            $(document).on('ready.dropmenu.data-api', { options: $options, element: $element }, plugin.getDropMenu);
            $($element).bind('hidden.bs.dropdown', function () { });
        });
    }

    $.fn.dropmenu.Constructor = DropMenu;

    $.fn.dropmenu.noConflict = function () {
        $.fn.dropmenu = old
        return this
    }

    DropMenu.prototype = {
        getOptions: function (options, element) {
            var $options = $.extend({}, options, {});
            return $options;
        },
        getDropMenu: function (e) {
            var $this = e.data.element;
            $($this).removeClass('in').addClass('collapse');
            $($this).find('.dropdown').fadeIn(function () {
                $(this).removeClass('open');
                $(this).find('.dropdown').removeClass('open');
                $(this).find('.dropdown-menu').removeAttr('style');
                $(this).find('.dropdown-menu').css({ 'display': 'none', 'position': 'absolute' });
            });
            $($this).find('.dropdown').on('hide.bs.dropdown', function () {
                $(this).removeClass('open');
                $(this).find('.dropdown-menu').removeAttr('style');
                $(this).find('.dropdown-menu').css({ 'display': 'none', 'position': 'absolute' });
            });
            $($this).find('.dropdown').on('hidden.bs.dropdown', function () {
                $(this).removeClass('open');
                $(this).find('.dropdown-menu').removeAttr('style');
                $(this).find('.dropdown-menu').css({ 'display': 'none', 'position': 'absolute' });
            });
            
            if (window.innerWidth > 992) {
                $($this).find('.dropdown').hover(function () {
                    $(this).addClass('open');
                    if ($(this).has('.dropdown-menu').length > 0) {
                        $(this).children('.dropdown-menu').eq(0).stop().hide().slideDown({
                            duration: 0,
                            easing: 'linear'
                        });

                        $(this).children('.sub-menu.dropdown-menu').css({ 'left': '100%', 'margin-left': '0px' });
                        var menuOffsetPosition_left = $(this).children('.dropdown-menu').offset().left;
                        var menuOffsetWidth = $(this).children('.dropdown-menu').offset().left + $(this).children('.dropdown-menu').width();
                        if ($(window).width() < menuOffsetWidth) {
                            $(this).children('.dropdown-menu').css({ 'left': '-100%', 'right': '0%' });
                            $(this).children('.sub-menu.dropdown-menu').css({ 'left': 'auto', 'right': '100%', 'margin-left': '-2px' });
                        }
                    }
                }, function () {
                    if ($(this).has('.dropdown-menu').length > 0) {
                        $(this).children('.dropdown-menu').eq(0).slideUp({
                            duration: 0,
                            easing: 'linear'
                        });
                    }
                    if ($(this).parent().hasClass('nav')) {
                        $(this).removeClass('open').trigger('hidden.bs.dropdown');
                    }
                    else {
                        $(this).removeClass('open');
                    }
                });
            }
            else {
                $($this).find('.dropdown').unbind('hover mouseenter mouseleave').bind('click', function () {
                    var current = $(this).parent('.nav').children('li.dropdown').index($(this));
                    
                    $(this).parent('.nav').find('li.dropdown').each(function () {
                        var loopIndex = $(this).parent('.nav').children('li.dropdown').index($(this));
                        if (current != loopIndex) {
                            $(this).removeClass('tapped');
                            $(this).removeClass('open');
                            $(this).find('.dropdown-menu').removeAttr('style');
                            $(this).find('.dropdown-menu').css({ 'display': 'none', 'position': 'absolute' });
                        }
                    });
                    if ($(this).hasClass('tapped')) {
                        $(this).removeClass('tapped');
                    } else {
                        $(this).find('.dropdown-menu').removeAttr('style');
                        $(this).find('.dropdown-menu').css({ 'display': 'block', 'position': 'static' });
                        $(this).addClass('tapped');
                    }

                });
            }
        }
    }

}(window.jQuery);