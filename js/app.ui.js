!function ($) {

    "use strict"; // jshint ;_;

    $(window).load(function () {
        blog_masonry();
    });

    var resizer = (function () {
        blog_masonry();
        stickyHeader();
        postGalleryGrid();
        init_gmaps();
        init_scrollToTop();
    });

    $(document).ready(function () {
        if (window.addEventListener) {
            window.addEventListener('scroll', scroller, false);
            window.addEventListener('resize', resizer, false);
        } else if (window.attachEvent) {
            window.attachEvent('onscroll', scroller);
            window.attachEvent('onresize', resizer);
        }
        stickyHeader();
        postGalleryGrid();
        init_gmaps();
        init_scrollToTop();

        if (!$.browser.mobile) {
            if (inafx_theme.niceScroll != 0) {
                $("html").niceScroll({ scrollspeed: 200, horizrailenabled: false });
            }
            $(window).scroll(function () {
                if (inafx_theme.niceScroll != 0) {
                    $("html").getNiceScroll().resize();
                }
            });
        }
        $('.author-social a').tooltip();
        $('#nav-dropdown-menu1').dropmenu();
        $('#header .navbar-toggle').click(function () {
            if ($('#nav-dropdown-menu1').hasClass('in')) {
                $('#nav-dropdown-menu1').slideUp({
                    duration: 800,
                    easing: 'swing'
                });
            }
            else {
                $('#nav-dropdown-menu1').slideDown({
                    duration: 800,
                    easing: 'swing'
                });
            }
        });
        $('#lnk-show-search').click(function () {
            var searchbox = $('#search-box');
            if (searchbox.hasClass('visible')) {
                searchbox.removeClass('visible');
                $('#lnk-hide-search').hide();
                searchbox.animate({ 'width': 'toggle', 'display': 'none' }).fadeOut({
                    duration: 800,
                    easing: 'swing'
                });
            }
            else {
                searchbox.addClass('visible');
                $('#lnk-hide-search').hide();
                searchbox.animate({ 'width': 'toggle', 'display': 'block' }, function () {
                    $('#lnk-hide-search').show();
                }).fadeIn({
                    duration: 800,
                    easing: 'swing'
                });
            }
        });
        $('#lnk-hide-search').click(function () {
            var searchbox = $('#search-box');
            searchbox.removeClass('visible');
            $('#lnk-hide-search').hide();
            searchbox.animate({ 'width': 'toggle', 'display': 'none' }).fadeOut({
                duration: 800,
                easing: 'swing'
            });
        });
    });

    function stickyHeader() {
        if (window.innerWidth > 992) {
            $('#nav-dropdown-menu1').removeClass('mobile');
        } else {
            $('#nav-dropdown-menu1').addClass('mobile');
        }

        $('#header').removeClass('header-fixed');
        $('#header-wrapper').removeClass('wrapper-fixed');
        $('#main').css({ 'padding-top': '0px' });
    }

    var scroller = (function () {
        if (!$.browser.mobile) {
            if (inafx_theme.stickyHeader != 0) {
                var scrollTop = $(window).scrollTop();
                resizeHeader(scrollTop);
            }
        }
    });

    function resizeHeader(scrollTop) {
        if (scrollTop < 1) {
            if ($('#header').hasClass('header-fixed')) {
                $('#header').removeClass('header-fixed');
                $('#header-wrapper').removeClass('wrapper-fixed');
            }
            if ($('#main').css('padding-top') != '0px') {
                $('#main').css({ 'padding-top': '0px' });
            }
        } else {
            if (!$('#header').hasClass('header-fixed')) {
                $('#header').addClass('header-fixed');
                $('#header-wrapper').addClass('wrapper-fixed');
            }
            if ($('#main').css('padding-top') == '0px') {
                $('#main').css({ 'padding-top': $('#header-wrapper').outerHeight(true) });
            }
        }
    }

    function postGalleryGrid() {
        $('.zoom-box .zoom > a.zoom-link').swipebox();
        $('.zoom-box .zoom > a.zoom-photo').swipebox();
    }

    function blog_masonry() {
        if (window.innerWidth < 600) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-3col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else if (window.innerWidth < 768) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-3col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 2;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else if (window.innerWidth < 992) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-3col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 2;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-3col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 3;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }

        if (window.innerWidth < 600) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-2col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else if (window.innerWidth < 768) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-2col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 2;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else if (window.innerWidth < 992) {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-2col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 2;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
        else {
            if ($.isFunction($.fn.masonry)) {
                $('#primary.blog-masonry-2col').masonry({
                    itemSelector: '.post-masonry',
                    columnWidth: function (containerWidth) {
                        return containerWidth / 2;
                    },
                    gutterWidth: 0,
                    isResizable: true,
                    isRTL: $('body').is('.rtl')
                });
            }
        }
    }

    function init_scrollToTop() {
        $('body').append('<a href="#top" class="scrollup"><span class="fa fa-chevron-up"></span></a>');

        $(window).scroll(function () {
            var scroll = 600;
            if ($(this).scrollTop() > scroll) {
                $('.scrollup').fadeIn();
            } else {
                $('.scrollup').fadeOut();
            }
        });

        $('.scrollup').click(function () {
            $("html, body").animate({ scrollTop: 0 }, 1000);
            return false;
        });
    }

    function init_gmaps() {
        $('.map-canvas').each(function () {
            var $this = $(this);
            var gmapId = 'gmap_' + $.now() + 1;
            $this.attr('id', gmapId);
            var lat = $this.data('latitude');
            var lng = $this.data('longitude');
            var zoom = $this.data('zoom');
            var shade = $this.data('shade');
            var saturation = $this.data('saturation');
            var icon = $this.data('marker');
            var map_info = $this.parent().find('.map-info').html();

            var myLatlng = new google.maps.LatLng(lat, lng);
            var mapOptions = {
                zoom: zoom,
                center: myLatlng,
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                },
                scrollwheel: false,
                disableDefaultUI: true,
                draggable: true
            };

            var styles = [
            {
                stylers: [
                    { hue: shade },
                    { saturation: saturation }
                ]
            }, {
                featureType: "road",
                elementType: "geometry",
                stylers: [
                    { lightness: 100 },
                    { visibility: "on" }
                ]
            }, {
                featureType: "road",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];

            var marker = new google.maps.Marker({
                position: myLatlng,
                animation: google.maps.Animation.DROP,
                icon: icon
            });

            var contentString = '<div class="map-info-content">' +
                            map_info +
                            '</div>';

            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            var map = new google.maps.Map(document.getElementById(gmapId), mapOptions);
            map.setOptions({ styles: styles });

            marker.setMap(map);
            google.maps.event.addListener(marker, 'click', function () {
                infowindow.open(map, marker);
            });

            document.getElementById(gmapId).addEventListener("touchstart", thisTouchStart, true);
            document.getElementById(gmapId).addEventListener("touchend", thisTouchEnd, true);
            document.getElementById(gmapId).addEventListener("touchmove", thisTouchMove, true);
        });
    }

    var dragFlag = false;
    var start = 0, end = 0;

    function thisTouchStart(e) {
        dragFlag = true;
        start = e.touches[0].pageY;
    }

    function thisTouchEnd() {
        dragFlag = false;
    }

    function thisTouchMove(e) {
        if (!dragFlag) return;
        end = e.touches[0].pageY;
        window.scrollBy(0, (start - end));
    }

} (window.jQuery);