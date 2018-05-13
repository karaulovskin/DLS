'use strict';

$(function () {
    svgSprite();
    animate.init();
});

var svgSprite = function () {
    ;( function( window, document )
    {
        'use strict';

        var file     = '/local/templates/dls/frontend/build/icons/svg/symbols.svg',
            revision = 1;

        if (location.host.indexOf('localhost') !== -1) {
            file = '../icons/svg/symbols.svg'
        }

        if( !document.createElementNS || !document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGRect )
            return true;

        var isLocalStorage = 'localStorage' in window && window[ 'localStorage' ] !== null,
            request,
            data,
            insertIT = function()
            {
                document.body.insertAdjacentHTML( 'afterbegin', data );
                svg4everybody({polyfill: true});
            },
            insert = function()
            {
                if( document.body ) insertIT();
                else document.addEventListener( 'DOMContentLoaded', insertIT );
            };

        // if( isLocalStorage )
        // {
        //     data = localStorage.getItem( 'inlineSVGdata' );
        //     if( data )
        //     {
        //         insert();
        //         return true;
        //     }
        // }

        try
        {
            request = new XMLHttpRequest();
            request.open( 'GET', file, true );
            request.onload = function()
            {
                if( request.status >= 200 && request.status < 400 )
                {
                    data = request.responseText;
                    insert();
                    if( isLocalStorage )
                    {
                        localStorage.setItem( 'inlineSVGdata',  data );
                        localStorage.setItem( 'inlineSVGrev',   revision );
                    }
                }
            }
            request.send();
        }
        catch( e ){}

    }( window, document ) );
};

var animate = {
    init:function () {
        this.menu();
        this.greet();
        this.carousel();
    },

    menu:function () {
        var menu      = $('.js-menu'),
            burger    = $('.js-burger'),
            slideshow = $('.slideshow');

        $('.js-burger').on('click', function (e) {
            e.preventDefault();

            if(!menu.hasClass('is-opend')) {
                menu.addClass('is-opend');
                burger.addClass('is-closed');
                slideshow.addClass('is-down');
            } else {
                menu.removeClass('is-opend');
                burger.removeClass('is-closed');
                slideshow.removeClass('is-down');
            }
        });
    },

    greet:function () {
        var animated = $('.is-animated'),
            greet    = $('.greet'),
            greetGo  = $('.greet-go'),
            logo     = $('.logo'),
            menu      = $('.js-menu'),
            burger    = $('.js-burger'),
            slideshow = $('.slideshow');

        $('.greet-go').on('click', function (e) {
            e.preventDefault();

            if(!greet.hasClass('step-3')) {
                greet.addClass('step-3');
                // greetGo.hide();
            }
        });

        $('.logo').on('click', function (e) {
            e.preventDefault();

            if(greet.hasClass('step-3')) {
                greet.removeClass('step-3');
                // greetGo.hide();
            }
            if(menu.hasClass('is-opend')) {
                menu.removeClass('is-opend');
                burger.removeClass('is-closed');
                slideshow.removeClass('is-down');
            }
        });
    },

    carousel:function () {
        var title       = $('.title'),
            titleItem   = title.find('.title__item'),
            titleWidth  = 0;

        titleItem.each(function () {
            titleWidth+=$(this).width();
        });
        title.width(titleWidth);


        $('.js-arrow').on('click', function (e) {
            e.preventDefault();

            var $this         = $(this),
                container     = $this.closest('.slideshow-over'),
                titleList     = container.find('.title__list'),
                title         = container.find('.title__item'),
                currentTitle = title.filter('.current'),
                nextTitle     = currentTitle.next(),
                prevTitle     = currentTitle.prev(),
                sliderOffset  = container.offset().left,
                reqPost       = 0;



            if($this.hasClass('s-arrow--next')) {
                console.log('next+');

                reqPost = nextTitle.offset().left - sliderOffset;
                nextTitle.addClass('current').siblings().removeClass('current');

            } else {
                console.log('prev+');

                reqPost = prevTitle.offset().left - sliderOffset;
                prevTitle.addClass('current').siblings().removeClass('current');
            }

            titleList.css('left', '-=' + reqPost + 'px');

        });

    }
};
