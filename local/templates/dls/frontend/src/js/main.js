'use strict';

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
    },

    menu:function () {
        var menu      = $('.js-menu'),
            burger    = $('.js-burger'),
            slideshow = $('.slideshow');

        $('.js-burger').on('click', function() {
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
    }
};

$(function () {
    svgSprite();
    animate.init();
});
