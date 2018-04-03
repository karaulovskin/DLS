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

var adaptive = {
    breakpointsArray: ['mobile', 'tablet', 'desktop'],
    current: null,
    mobile: function(width) {return width < 750},
    tablet: function(width) {return width > 750 && width < 1024},
    desktop: function(width) {return width > 1024},

    init: function () {
        this.checkCurrent();
        this.events();
    },

    events: function () {
        var self = this;
        $(window).on('resize', this.checkCurrent.bind(this));
    },

    checkCurrent: function () {
        var self = this;
        this.breakpointsArray.forEach(function (item) {
            self[item](window.innerWidth) ? self.current = item : null
        });
    }
};

var utils = {
    init: function () {
        this.classToggle.init();
    },
    fixScroll: {
        isFixed: false,
        elemToFix: 'body',
        fixedClass: 'is-fixed',

        fix: function () {
            $(this.elemToFix).addClass(this.fixedClass);
            this.isFixed = true;
        },

        unfix: function () {
            $(this.elemToFix).removeClass(this.fixedClass);
            this.isFixed = false;
        }
    },
    classToggle: {
        initer: '[data-class-toggle-initer]',
        closable: '[data-class-toggle-initer-closable]',
        block: '[data-class-toggle]',

        init: function () {
            this.events();
        },

        events: function () {
            var self = this;
            $(document).on('click', self.initer, function () {
                self.toggle($(this));
            });

            $(document).on('click', function (e) {
                if ($(self.closable)) {
                    if (!$(e.target).closest(self.closable).length) {
                        self.close($(self.closable));
                    }
                }
            });
        },
        toggle: function ($item) {
            var self = this;
            var classString = self.initer.substring(1,self.initer.length - 1);
            var blockString = self.block.substring(1,self.block.length - 1);
            var classToToggle = $item.attr(classString);

            if (!$item[0].hasAttribute(blockString)) {
                $item
                    .toggleClass(classToToggle)
                    .closest(self.block)
                    .toggleClass(classToToggle)
                ;
            } else {
                $item.toggleClass(classToToggle);
            }
            $item.trigger('toggle::change')
        },
        close: function ($item) {
            var self = this;
            var classString = self.initer.substring(1,self.initer.length - 1);
            var classToToggle = $item.attr(classString);

            $item
                .removeClass(classToToggle)
                .closest(self.block)
                .removeClass(classToToggle)
            ;
        }
    },
    scrollTop: function (newTop, callback) {
        $("html, body").animate({ scrollTop: newTop }, 600);
    },
    triggerResize: function () {
        // $(window).trigger('resize');
    },
    loader: {
        elem: '.loader',
        shownClass: 'is-shown',

        show: function () {
            $(this.elem).addClass(this.shownClass)
            utils.fixScroll.fix();
        },
        hide: function () {
            $(this.elem).removeClass(this.shownClass)
            utils.fixScroll.unfix();
        }
    },
    declOfNum: function(number, titles) {
        var cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }
};

var formValidation = {
    form: '.js-form',
    formInput: '[data-input-required]',
    formInputPlaceholder: '[data-input-placeholder]',
    termsInput: '[data-input-required-terms]',
    emptyMsg: 'Поле не заполнено',
    formTermsInput: function () {
        return this.termsInput.substring(1,this.termsInput.length - 1)
    },
    formInputSelector: function () {
        return this.formInput.substring(1,this.formInput.length - 1)
    },
    formInputPlaceholderSelector: function () {
        return this.formInputPlaceholder.substring(1,this.formInputPlaceholder.length - 1)
    },

    init: function () {
        this.events();
    },

    events: function () {
        var self = this;
        $(document).on('submit', this.form, function () {
            self.validate($(this));

            return false;
        });

        $(this.formInput).on('focus click', function () {
            $(this).attr('placeholder', $(this).attr(self.formInputPlaceholderSelector()))
        });

        $(this.termsInput).on('change', function () {
            self.termsToggle($(this));
        });
    },

    termsToggle: function (input, btnToToggle) {
        var btn = btnToToggle || input.closest('.js-form').find('[type="submit"]');

        if (!input.is(':checked')) {
            btn.attr('disabled', '');
        } else {
            btn.removeAttr('disabled');
        }
    },

    validate: function ($form) {
        var self = this;
        var $inputs = $form.find(this.formInput);
        var valid = [];

        $inputs.each(function () {
            var type = $(this).attr(self.formInputSelector()) || 'text';
            var val = $(this).val();

            $(this).removeClass('invalid');

            if (!val.length) {
                valid.push(self.invalid($(this), true));
            } else {
                switch (type) {
                    case 'email':
                        valid.push(self.validateEmail(val) ? true : self.invalid($(this), false));

                        break;
                    case 'phone':
                        valid.push(self.validatePhone(val) ? true : self.invalid($(this), false));

                        break;
                    case 'checkbox':
                        valid.push(self.validateCheckbox($(this)) ? true : self.invalid($(this), false));

                        break;
                }
            }
        });

        var validCount = 0;

        valid.forEach(function (item) {
            item ? validCount++ : null
        });

        if (valid.length === validCount) $form.trigger('form::valid');

        return valid.length === validCount;
    },
    validateEmail: function (email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validatePhone: function (phone) {
        var cleanPhone = phone.replace(/\s/g, "");
        var re = /^[+]7*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
        return re.test(cleanPhone);
    },
    validateCheckbox: function ($elem) {
       return $elem.prop('checked')
    },
    invalid: function (elem, showPlaceholder) {
        elem.addClass('invalid');
        showPlaceholder ? elem.attr('placeholder', this.emptyMsg) : null;

        return false;
    }
};

var count = {
    count: '[data-count]',
    action: '[data-count-action]',
    input: '[data-count-input]',

    init: function () {
        this.events();
    },

    changeInput: function(button) {
        var buttonType = button.attr('data-count-action');
        var input = button.closest(this.count).find(this.input);

        var currentValue = parseInt(input.val());
        var closestCartItem = input.closest('.cart-item');
        var cartInputs = closestCartItem.find(this.input);

        if (buttonType === 'minus' && currentValue > 1) {
            var value = currentValue - 1;

            cartInputs.val(value)

        }
        else if (buttonType === 'plus') {
            var value = currentValue + 1;

            cartInputs.val(value)
        }
    },

    validateInput: function(input) {
        var inputValue = Number(input.val());
        var closestCartItem = input.closest('.cart-item');
        var cartInputs = closestCartItem.find(this.input);

        if (isNaN(inputValue) || inputValue < 1) {
            cartInputs.val(1);
        } else {
            cartInputs.val(inputValue);
        }
    },

    events: function () {
        var self = this;
        $(this.action).on('click', function (e) {
            e.stopPropagation();
            self.changeInput($(this));
        });
        $(this.input).on('change', function () {
            self.validateInput($(this));
        });
    }
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
    adaptive.init();
    utils.init();
    formValidation.init();
    count.init();
    animate.init();
});
