(function ($) {

    $(document).click(function () {
        $(".ect-dropdown-dropdown-content").each(function () {
            if ($(this).css('display') === 'block') {
                $(this).css('display', 'none');
                $(this).parent().data('$meta_events').onClose()
            }
        });
    });

    $.EctDropDown = function (element) {
        this.element = (element instanceof $) ? element : $(element);
        this.element.css("position", "relative");
        this.element.css("display", "inline-block");
        this.element.find('.ect-dropdown-dropdown-content').css('display', 'none');
        this.element.find('.ect-dropdown-dropdown-content').css('position', 'absolute');
        this.element.find('.ect-dropdown-dropdown-content').css('box-shadow', '0px 8px 16px 0px rgba(0, 0, 0, 0.2)');
    };
    $.EctDropDown.prototype = {
        start: function (listener) {
            var that = this;
            var _selfId = this.element.attr('id');
            this.element.data('$meta_events', {
                onClose: function () {
                    if (listener !== null && listener !== undefined) {
                        if (listener.onClose && typeof listener.onClose === 'function') {
                            try {
                                listener.onClose();
                            } catch (e) {
                                console.warn('error while invoking listener.onClose');
                            }
                        }
                    }

                },
                onOpen: function () {
                    if (listener !== null && listener !== undefined) {
                        if (listener.onOpen && typeof listener.onOpen === 'function') {
                            try {
                                listener.onOpen();
                            } catch (e) {
                                console.warn('error while invoking listener.onOpen');
                            }
                        }
                    }
                }
            });
            this.element.find('.ect-dropdown-dropbtn').click(function (event) {
                event.stopPropagation();
                $(".ect-dropdown-dropdown-content").each(function (dropdownContent) {
                    if (_selfId === $(this).get(0).parentNode.getAttribute('id')) {
                        $(this).css('display', 'block');
                        $(this).parent().data('$meta_events').onOpen();
                    } else {
                        if ($(this).css('display') === 'block') {
                            $(this).css('display', 'none');
                            $(this).parent().data('$meta_events').onClose()
                        }
                    }
                });
            });
        },
        moveRight: function () {
            this.element.css("left", '+=' + 10);
        },
        moveLeft: function () {
            this.element.css("left", '-=' + 10);
        },
        openDropDown: function () {
            var _selfId = this.element.attr('id');
            $(".ect-dropdown-dropdown-content").each(function (dropdownContent) {
                if (_selfId === $(this).get(0).parentNode.getAttribute('id')) {
                    $(this).css('display', 'block');
                    $(this).parent().data('$meta_events').onOpen();
                } else {
                    if ($(this).css('display') === 'block') {
                        $(this).css('display', 'none');
                        $(this).parent().data('$meta_events').onClose()
                    }
                }
            });
        },
        closeDropDown: function () {
            var _selfId = this.element.attr('id');
            $(".ect-dropdown-dropdown-content").each(function (dropdownContent) {
                if (_selfId === $(this).get(0).parentNode.getAttribute('id')) {
                    $(this).css('display', 'none');
                    $(this).parent().data('$meta_events').onClose();
                }
            });
        }
    };


    /*
     $.EctDropDown.defaultOptions = {
     playerX: 0,
     playerY: 0
     };
     */

}(jQuery));
