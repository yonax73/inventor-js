/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 27/02/2015
@ Date update: 27/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: state
**/
var State = (function () {
    function State(old, current) {
        this.old = null;
        this.current = null;
        if (old)
            this.old = old;
        if (current)
            this.current = current;
    }
    State.prototype.exchange = function (value) {
        this.old = this.current;
        this.current = value;
    };
    return State;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 18/02/2015
@ Date update: 18/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: XmlHttpRequest
**/
var XHR = (function () {
    function XHR(method, action) {
        this.method = method;
        this.action = action;
        this.xhr = new XMLHttpRequest();
    }
    XHR.prototype.setContentType = function (contenType) {
        this.contentType = contenType;
    };
    XHR.prototype.onBeforeSend = function (beforeSend) {
        this.beforeSend = beforeSend;
    };
    XHR.prototype.onReady = function (ready) {
        this.ready = ready;
    };
    XHR.prototype.onError = function (error) {
        this.error = error;
    };
    XHR.prototype.send = function (data) {
        this.data = data;
        var _self = this;
        this.xhr.onreadystatechange = function () {
            if (_self.beforeSend)
                _self.beforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (_self.ready)
                        _self.ready(this);
                }
                else {
                    if (_self.error)
                        _self.error(this);
                }
            }
        };
        this.xhr.open(this.method, this.action);
        if (this.contentType)
            this.xhr.setRequestHeader('Content-Type', this.contentType);
        if (this.data)
            this.xhr.send(data);
        else
            this.xhr.send();
    };
    /*
    * ContentType by default is application/x-www-form-urlencoded;charset=UTF-8
    */
    XHR.byGet = function (action, onBeforeSend, onReady, onError, _conteType) {
        var xhr = new XMLHttpRequest();
        var conteType = _conteType ? _conteType : 'application/x-www-form-urlencoded;charset=UTF-8';
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                }
                else {
                    if (onerror)
                        onError();
                }
            }
        };
        xhr.open('GET', action);
        xhr.setRequestHeader('Content-Type', conteType);
        xhr.send();
    };
    /*
     * ContentType by default is application/x-www-form-urlencoded;charset=UTF-8
     */
    XHR.byPost = function (data, action, onBeforeSend, onReady, onError, _conteType) {
        var xhr = new XMLHttpRequest();
        var conteType = _conteType ? _conteType : 'application/x-www-form-urlencoded;charset=UTF-8';
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                }
                else {
                    if (onerror)
                        onError(this);
                }
            }
        };
        xhr.open('POST', action);
        xhr.setRequestHeader('Content-Type', conteType);
        xhr.send(data);
    };
    XHR.byJSON = function (data, action, onBeforeSend, onReady, onError) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (onBeforeSend)
                onBeforeSend();
            if (this.readyState === 4 /* COMPLETED */) {
                if (this.status === 200 /* OK */) {
                    if (onReady)
                        onReady(this);
                }
                else {
                    if (onerror)
                        onError();
                }
            }
        };
        xhr.open('POST', action);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
    };
    return XHR;
})();
var EHttpStatus;
(function (EHttpStatus) {
    EHttpStatus[EHttpStatus["OK"] = 200] = "OK";
    EHttpStatus[EHttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    EHttpStatus[EHttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    EHttpStatus[EHttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    EHttpStatus[EHttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    EHttpStatus[EHttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(EHttpStatus || (EHttpStatus = {}));
var EReadyStateStatus;
(function (EReadyStateStatus) {
    EReadyStateStatus[EReadyStateStatus["UNINITIALIZED"] = 0] = "UNINITIALIZED";
    EReadyStateStatus[EReadyStateStatus["LOADING"] = 1] = "LOADING";
    EReadyStateStatus[EReadyStateStatus["LOADED"] = 2] = "LOADED";
    EReadyStateStatus[EReadyStateStatus["INTERACTIVE"] = 3] = "INTERACTIVE";
    EReadyStateStatus[EReadyStateStatus["COMPLETED"] = 4] = "COMPLETED";
})(EReadyStateStatus || (EReadyStateStatus = {}));
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 18/02/2015
@ Date update: 18/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: Utils
**/
var Utils = (function () {
    function Utils() {
    }
    Utils.getWindowMaxHeight = function () {
        var body = document.body, html = document.documentElement;
        return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
    };
    return Utils;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 16/02/2015
@ Date update: 16/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: Popup
**/
var Popup = (function () {
    function Popup(element) {
        this.element = element;
        this.mask = null;
        this.closeBtn = null;
        this.animationShow = new Animation('i-ease', 'i-bounce-in-down', 'i-2s', 2000);
        this.animationClose = new Animation('i-ease', 'i-fade-out', 'i-1s', 1000);
        this.maskClass = 'i-popup-mask';
        this.closeClass = 'i-popup-close';
        this.init();
    }
    Popup.prototype.init = function () {
        var _this = this;
        this.closeBtn = this.element.getElementsByClassName('i-popup-close')[0];
        if (this.closeBtn != null) {
            this.closeBtn.onclick = function (e) {
                e.preventDefault();
                _this.closeAll();
            };
        }
    };
    Popup.prototype.show = function () {
        this.getMask();
        if (this.mask != null) {
            if (this.element.classList.contains('hidden')) {
                this.mask.classList.remove('hidden');
                this.mask.classList.add('show');
                this.element.classList.remove('hidden');
                this.element.classList.add('show');
                this.animationShow.run(this.element);
            }
        }
    };
    Popup.prototype.closeAll = function () {
        var _this = this;
        this.getMask();
        if (this.element.classList.contains('show')) {
            this.animationClose.run(this.element, function () {
                _this.mask.classList.remove('show');
                _this.mask.classList.add('hidden');
                _this.element.classList.remove('show');
                _this.element.classList.add('hidden');
            });
        }
    };
    Popup.prototype.close = function () {
        if (this.element.classList.contains('show')) {
            this.element.classList.remove('show');
            this.element.classList.add('hidden');
        }
    };
    Popup.prototype.getMask = function () {
        if (this.mask === null) {
            this.mask = document.getElementsByClassName(this.maskClass)[0];
        }
        if (this.mask !== null) {
            this.mask.style.height = Utils.getWindowMaxHeight() + 'px';
        }
    };
    return Popup;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 16/02/2015
@ Date update: 16/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: Animations
**/
var Animation = (function () {
    /**
    * constructor
    * @param type
    * @param fn
    * @param time
    * @param ms
    */
    function Animation(type, fn, time, ms) {
        this.type = type;
        this.fn = fn;
        this.time = time;
        this.ms = ms;
    }
    /**
   * Run animation
   * @param element
   * @param callback
   * @method run
   */
    Animation.prototype.run = function (element, callBack) {
        var _this = this;
        element.classList.add(this.type);
        element.classList.add(this.fn);
        element.classList.add(this.time);
        this.timeOut = setTimeout(function () {
            element.classList.remove(_this.type);
            element.classList.remove(_this.fn);
            element.classList.remove(_this.time);
            if (callBack)
                callBack();
        }, this.ms);
    };
    /**
    * Stop animation
    * @method stop
    */
    Animation.prototype.stop = function () {
        if (this.timeOut)
            clearTimeout(this.timeOut);
    };
    return Animation;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 13/02/2015
@ Date update: 13/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: BaseForm
**/
var BaseForm = (function () {
    function BaseForm(element) {
        this.element = element;
        this.inputs = this.element.querySelectorAll('input,textarea');
        this.result = true;
        this.hasSuccessClass = 'has-success';
        this.hasErrorClass = 'has-error';
        this.hasFeedBackClass = 'has-feedback';
        this.iFormErrorMsgClass = 'i-form-error-msg';
        this.iGroupChecboxClass = 'i-group-checkbox';
        this.formControlFeedBackClass = 'form-control-feedback';
        this.successIconClass = 'fa fa-check';
        this.errorIconClass = 'fa fa-times';
    }
    BaseForm.prototype.isValid = function () {
        var n = this.inputs.length;
        var i = 0;
        var multiples = new Array();
        var totalMultiple = 1;
        while (i < n) {
            this.validate(this.inputs[i]);
            multiples.push(this.result ? 1 : 0);
            i++;
        }
        this.validateGroupCheckBox();
        i = 0;
        n = this.inputs.length;
        while (i < n) {
            totalMultiple *= multiples[i++];
        }
        console.log(n);
        console.log(totalMultiple);
        return totalMultiple > 0;
    };
    BaseForm.prototype.validate = function (input) {
        switch (input.type) {
            case 'text':
            case 'search':
            case 'email':
            case 'url':
            case 'tel':
            case 'number':
            case 'range':
            case 'date':
            case 'month':
            case 'week':
            case 'time':
            case 'datetime':
            case 'datetime-local':
            case 'color':
            case 'textarea':
            case 'password':
                if (input.dataset.required) {
                    if (input.dataset.option) {
                        if (BaseForm.isValidOption(input, input.dataset.option)) {
                            //input hidden containt the element name
                            var inputHidden = input.previousElementSibling;
                            this.result = this.success(inputHidden);
                        }
                        else {
                            //input hidden containt the element name
                            var inputHidden = input.previousElementSibling;
                            this.result = this.error(inputHidden);
                        }
                    }
                    else {
                        this.result = BaseForm.isEmpty(input.value) ? this.error(input) : this.success(input); //Check required
                        if (this.result) {
                            this.generalValidations(input);
                        }
                    }
                }
                else {
                    this.generalValidations(input);
                }
                break;
            default:
                this.result = true; //The other inputs by default are valid
                break;
        }
    };
    BaseForm.prototype.validateGroupCheckBox = function () {
        var groups = this.element.getElementsByClassName(this.iGroupChecboxClass);
        var n = groups ? groups.length : 0;
        if (n > 0) {
            for (var g = 0; g < n; g++) {
                var group = groups[g];
                if (group.dataset.checkmin) {
                    var min = group.dataset.checkmin;
                    if (this.countChecks(group) < min) {
                        this.result = this.error(group);
                    }
                    else {
                        this.result = this.success(group);
                    }
                }
                else if (group.dataset.checkmax) {
                    var max = group.dataset.checkmax;
                    if (this.countChecks(group) > max) {
                        this.result = this.error(group);
                    }
                    else {
                        this.result = this.success(group);
                    }
                }
                else if (group.dataset.checkrange) {
                    var range = group.dataset.checkrange.split('-');
                    var min = range[0];
                    var max = range[1];
                    var checks = this.countChecks(group);
                    if (checks >= min && checks <= max) {
                        this.result = this.success(group);
                    }
                    else {
                        this.result = this.error(group);
                    }
                }
            }
        }
    };
    BaseForm.prototype.countChecks = function (group) {
        var checkboxes = group.querySelectorAll('input[type="checkbox"]');
        var k = checkboxes.length;
        var checks = 0;
        for (var c = 0; c < k; c++) {
            var checkbox = checkboxes[c];
            if (checkbox.checked)
                checks++;
        }
        return checks;
    };
    BaseForm.prototype.generalValidations = function (input) {
        if (input.dataset.name) {
            this.result = BaseForm.isFullName(input.value) ? this.success(input) : this.error(input); //Check name
        }
        else if (input.dataset.email) {
            this.result = BaseForm.isEmail(input.value) ? this.success(input) : this.error(input); //Check email
        }
        else if (input.dataset.equalsto) {
            var tmpInp = document.getElementsByName(input.dataset.equalsto)[0]; //Check equals to
            if (BaseForm.isEqualsTo(tmpInp.value, input.value)) {
                var tmpBool1 = this.success(input);
                var tmpBool2 = this.success(tmpInp);
                this.result = tmpBool1 && tmpBool2;
            }
            else {
                var tmpBool1 = this.error(input);
                var tmpBool2 = this.error(tmpInp);
                this.result = tmpBool1 && tmpBool2;
            }
            if (this.result) {
                this.generalValidations(tmpInp);
            }
        }
        else if (input.dataset.money) {
            this.result = BaseForm.isMoney(input.value) ? this.success(input) : this.error(input); //Check money
        }
        else if (input.dataset.maxlength) {
            var length = input.dataset.maxlength;
            this.result = BaseForm.maxLength(input.value, length) ? this.success(input) : this.error(input);
        }
        else if (input.dataset.minlength) {
            var length = input.dataset.minlength;
            this.result = BaseForm.minLength(input.value, length) ? this.success(input) : this.error(input); //Check min length
        }
        else if (input.dataset.rangelength) {
            var data = input.dataset.rangelength.split("-");
            var min = data[0];
            var max = data[1];
            this.result = BaseForm.rangeLength(input.value, min, max) ? this.success(input) : this.error(input); //Check range length
        }
        else if (input.dataset.max) {
            var max = input.dataset.max;
            this.result = BaseForm.max(input.value, max) ? this.success(input) : this.error(input); //Check max number
        }
        else if (input.dataset.min) {
            var min = input.dataset.min;
            this.result = BaseForm.min(input.value, min) ? this.success(input) : this.error(input); //Check min number
        }
        else if (input.dataset.range) {
            var data = input.dataset.range.split("-");
            var min = data[0];
            var max = data[1];
            this.result = BaseForm.range(input.value, min, max) ? this.success(input) : this.error(input); //Check range number
        }
        else if (input.dataset.url) {
            this.result = BaseForm.isURL(input.value) ? this.success(input) : this.error(input); //Check URL
        }
        else if (input.dataset.date) {
            this.result = BaseForm.isDate(input.value) ? this.success(input) : this.error(input); //Check date
        }
        else if (input.dataset.number) {
            this.result = BaseForm.isNumber(input.value) ? this.success(input) : this.error(input); //Check number
        }
        else if (input.dataset.creditcard) {
            this.result = BaseForm.isCreditCard(input.value) ? this.success(input) : this.error(input); //Check credit card
        }
        else {
            this.success(input);
        }
    };
    BaseForm.prototype.error = function (input) {
        var feedBack = this.searchFeedBack(input);
        if (feedBack != null) {
            if (feedBack.classList.contains(this.hasSuccessClass))
                feedBack.classList.remove(this.hasSuccessClass);
            if (!feedBack.classList.contains(this.hasErrorClass))
                feedBack.classList.add(this.hasErrorClass);
            this.showFormErrorMsg(feedBack);
        }
        return false;
    };
    BaseForm.prototype.success = function (input) {
        var feedBack = this.searchFeedBack(input);
        if (feedBack != null) {
            if (feedBack.classList.contains(this.hasErrorClass))
                feedBack.classList.remove(this.hasErrorClass);
            if (!feedBack.classList.contains(this.hasSuccessClass))
                feedBack.classList.add(this.hasSuccessClass);
            this.hiddenFormErrorMsg(feedBack);
        }
        return true;
    };
    BaseForm.prototype.serialize = function () {
        var elements = this.element.elements;
        var serialized = [];
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element = elements[i];
            var type = element.type;
            var value = element.value;
            var name = element.name;
            if (!name.isEmpty()) {
                switch (type) {
                    case 'text':
                    case 'checkbox':
                    case 'search':
                    case 'email':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'range':
                    case 'date':
                    case 'month':
                    case 'week':
                    case 'time':
                    case 'datetime':
                    case 'datetime-local':
                    case 'color':
                    case 'textarea':
                    case 'password':
                    case 'select':
                    case 'hidden':
                        serialized.push(name + '=' + value);
                        break;
                    case 'radio':
                        if (element.checked)
                            serialized.push(name + '=' + value);
                        break;
                    default:
                        break;
                }
            }
        }
        return serialized.join('&');
    };
    BaseForm.prototype.toJSON = function () {
        var elements = this.element.elements;
        var json = {};
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element = elements[i];
            var type = element.type;
            var value = element.value;
            var name = element.name;
            if (!name.isEmpty()) {
                switch (type) {
                    case 'text':
                    case 'checkbox':
                    case 'search':
                    case 'email':
                    case 'url':
                    case 'tel':
                    case 'number':
                    case 'range':
                    case 'date':
                    case 'month':
                    case 'week':
                    case 'time':
                    case 'datetime':
                    case 'datetime-local':
                    case 'color':
                    case 'textarea':
                    case 'password':
                    case 'select':
                    case 'hidden':
                        json[name] = value;
                        break;
                    case 'radio':
                        if (element.checked)
                            json[name] = value;
                        break;
                }
            }
        }
        return json;
    };
    BaseForm.prototype.onsubmit = function (callback) {
        this.element.onsubmit = function (e) {
            e.preventDefault();
            callback();
        };
    };
    /*
      * @param input element
      * @returns the feedback that contains the input element
      */
    BaseForm.prototype.searchFeedBack = function (input) {
        var feedBacks = this.element.getElementsByClassName(this.hasFeedBackClass);
        var n = feedBacks.length;
        var feedBack = null;
        if (feedBacks != null && n > 0) {
            var i = 0;
            var found = false;
            do {
                feedBack = feedBacks[i];
                var tmpInput = null;
                if (feedBack.getElementsByTagName('input')[0]) {
                    tmpInput = feedBack.getElementsByTagName('input')[0];
                }
                else {
                    tmpInput = feedBack.getElementsByTagName('textarea')[0];
                }
                if (tmpInput) {
                    found = tmpInput.name === input.name;
                }
                i++;
            } while (!found && i < n);
        }
        return feedBack;
    };
    BaseForm.prototype.showFormErrorMsg = function (feedBack) {
        var formMsg = feedBack.getElementsByClassName(this.iFormErrorMsgClass)[0];
        if (formMsg != null) {
            if (formMsg.classList.contains('hidden')) {
                formMsg.classList.remove('hidden');
                formMsg.classList.add('show');
            }
            this.showIcon(feedBack, this.errorIconClass);
        }
    };
    BaseForm.prototype.hiddenFormErrorMsg = function (feedBack) {
        var formMsg = feedBack.getElementsByClassName(this.iFormErrorMsgClass)[0];
        if (formMsg != null) {
            if (formMsg.classList.contains('show')) {
                formMsg.classList.remove('show');
                formMsg.classList.add('hidden');
            }
            this.showIcon(feedBack, this.successIconClass);
        }
    };
    BaseForm.prototype.showIcon = function (feedBack, icon) {
        var contentIcon = feedBack.getElementsByClassName(this.formControlFeedBackClass)[0];
        if (contentIcon != null) {
            var className = icon + ' ' + this.formControlFeedBackClass;
            contentIcon.className = className;
        }
    };
    /*
    * @param String value
    * @returns true if value is fullname
    */
    BaseForm.isFullName = function (value) {
        return value.match(/^[a-zA-Z][a-zA-Z ]+$/);
    };
    /*
    * @param String value
    * @returns true if value is email
    */
    BaseForm.isEmail = function (value) {
        return value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    };
    /*
    * @param String value
    * @returns true if value is empty
    */
    BaseForm.isEmpty = function (value) {
        return !value.match(/^\S+$|[^\s]+$/);
    };
    /*
    * @param String value
    * @param String value1
    * @returns true if both values are equals
    */
    BaseForm.isEqualsTo = function (value, value1) {
        return value === value1;
    };
    /*
    * @param String value
    * @returns true if value is money format
    */
    BaseForm.isMoney = function (value) {
        return value.match(/^\d+(,\d{3})*(\.\d*)?$/);
    };
    /*
    * @param String value
    * @param length, number of characters
    * @returns true if  value  has length characters or less
    */
    BaseForm.maxLength = function (value, length) {
        return !isNaN(length) && value.length <= length;
    };
    /*
    * @param String value
    * @param length, number of characters
    * @returns true if  value has length characters or more
    */
    BaseForm.minLength = function (value, length) {
        return !isNaN(length) && value.length >= length;
    };
    /*
    * @param String value
    * @param min, number minimum of characters
    * @param max, number maximum of characters
    * @returns true if  value is between min and max
    */
    BaseForm.rangeLength = function (value, min, max) {
        var length = value.length;
        return ((!isNaN(min) && length >= min) && (!isNaN(max) && length <= max));
    };
    /*
    * @param String value
    * @param max, number maximun
    * @returns true if  value is equals or less that max
    */
    BaseForm.max = function (value, max) {
        return (!isNaN(max) && value <= max);
    };
    /*
    * @param String value
    * @param min, number minimun
    * @returns true if value is equals or greater that min
    */
    BaseForm.min = function (value, min) {
        return (!isNaN(min) && value >= min);
    };
    /*
    * @param String value
    * @param min, number minimum
    * @param max, number maximum
    * @returns true if value is between min and max number
    */
    BaseForm.range = function (value, min, max) {
        return ((!isNaN(min) && value >= min) && (!isNaN(max) && value <= max));
    };
    /*
    * @param String value
    * @returns true if value is URL
    */
    BaseForm.isURL = function (value) {
        return value.match(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/);
    };
    /*
    * @param String value
    * @returns true if value is Date
    */
    BaseForm.isDate = function (value) {
        var parms = value.split(/[\.\-\/]/);
        var yyyy = parseInt(parms[2], 10);
        ;
        var mm = parseInt(parms[1], 10);
        var dd = parseInt(parms[0], 10);
        if (yyyy < 1582) {
            var tmp = yyyy;
            yyyy = dd;
            dd = tmp;
        }
        var date = new Date(yyyy, mm - 1, dd);
        return (mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear());
    };
    /*
    * @param String value
    * @returns true if value is Number
    */
    BaseForm.isNumber = function (value) {
        return !isNaN(value);
    };
    /*
    * @param String value
    * @returns true if value is credit card
    */
    BaseForm.isCreditCard = function (value) {
        return value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
    };
    /*
   * @param HtmlElement input
   * @returns true if input is Checked
   */
    BaseForm.isChecked = function (input) {
        return input.checked;
    };
    /*
    * @param HtmlElement input
    * @param option
    * @returns true if option is greater than zero
    */
    BaseForm.isValidOption = function (input, option) {
        return (!isNaN(option) && option > 0);
    };
    return BaseForm;
})();
String.prototype.isEmpty = function () {
    return this == undefined || this === null || this === '' || this.length <= 0;
};
/*
* Return name of month
*/
Date.prototype.getMonthName = function () {
    var month_names = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    return month_names[this.getMonth()];
};
/*
* Return month abbreviation
*/
Date.prototype.getMonthAbbr = function () {
    var month_abbrs = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec'
    ];
    return month_abbrs[this.getMonth()];
};
/*
* Return full day of week name
*/
Date.prototype.getDayFull = function () {
    var days_full = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];
    return days_full[this.getDay()];
};
/*
*  Return full day of week name
*/
Date.prototype.getDayAbbr = function () {
    var days_abbr = [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
    ];
    return days_abbr[this.getDay()];
};
/*
* Return the day of year 1-365
*/
Date.prototype.getDayOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((this.getTime() - onejan.getTime()) / 86400000);
};
/*
* Return the day suffix (st,nd,rd,th)
*/
Date.prototype.getDaySuffix = function () {
    var d = this.getDate();
    var sfx = ["th", "st", "nd", "rd"];
    var val = d % 100;
    return (sfx[(val - 20) % 10] || sfx[val] || sfx[0]);
};
/*
* Return Week of Year
*/
Date.prototype.getWeekOfYear = function () {
    var onejan = new Date(this.getFullYear(), 0, 1);
    return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
};
/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
};
/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
};
/*
* Return Number of Days in a given month
*/
Date.prototype.getMonthDayCount = function () {
    var month_day_counts = [
        31,
        this.isLeapYear() ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31
    ];
    return month_day_counts[this.getMonth()];
};
/*
* back a month
*/
Date.prototype.previousMonth = function () {
    var month = this.getMonth() - 1;
    var year = this.getFullYear();
    if (month < 0 && year > 1582) {
        month = 11;
        year--;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
};
/*
* next an month
*/
Date.prototype.nextMonth = function () {
    var month = this.getMonth() + 1;
    var year = this.getFullYear();
    if (month > 11) {
        month = 0;
        year++;
    }
    var tDays = this.getMonthDayCount();
    if (this.getDate() > tDays) {
        this.setDate(tDays);
    }
    this.setMonth(month);
    this.setFullYear(year);
};
/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
/*
 * returns true if the date is valid
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
};
/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(), month = this.getMonth(), hours = this.getHours(), minutes = this.getMinutes(), seconds = this.getSeconds();
    /*
    * get all date properties
    * ( based on PHP date object functionality )
    */
    var date_props = {
        d: date < 10 ? '0' + date : date,
        D: this.getDayAbbr(),
        j: this.getDate(),
        l: this.getDayFull(),
        S: this.getDaySuffix(),
        w: this.getDay(),
        z: this.getDayOfYear(),
        W: this.getWeekOfYear(),
        F: this.getMonthName(),
        m: month < 9 ? '0' + (month + 1) : month + 1,
        M: this.getMonthAbbr(),
        n: month + 1,
        t: this.getMonthDayCount(),
        L: this.isLeapYear() ? '1' : '0',
        Y: this.getFullYear(),
        y: this.getFullYear() + ''.substring(2, 4),
        a: hours > 12 ? 'pm' : 'am',
        A: hours > 12 ? 'PM' : 'AM',
        g: hours % 12 > 0 ? hours % 12 : 12,
        G: hours > 0 ? hours : "12",
        h: hours % 12 > 0 ? hours % 12 : 12,
        H: hours,
        i: minutes < 10 ? '0' + minutes : minutes,
        s: seconds < 10 ? '0' + seconds : seconds
    };
    /*
    * loop through format array of characters and add matching data
    * else add the format character (:,/, etc.)
    */
    var date_string = "";
    var n = dateFormat.length;
    for (var i = 0; i < n; i++) {
        var f = dateFormat[i];
        if (f.match(/[a-zA-Z]/g)) {
            date_string += date_props[f] ? date_props[f] : '';
        }
        else {
            date_string += f;
        }
    }
    return date_string;
};
/*
* parse string date to object Date
* @param string date
* @param string pattern formmat
* @returns object Date
*/
Date.prototype.parse = function (dateString, pattern) {
    /*
    * break apart format string into array paralel of characters
    */
    dateString = dateString.split(/\W/);
    var pattern = pattern.split(/\W/);
    var n = pattern.length;
    var date = new Date();
    for (var i = 0; i < n; i++) {
        var str = pattern[i];
        switch (str) {
            case 'd':
            case 'j':
                date.setDate(dateString[i]);
                break;
            case 'm':
            case 'n':
                date.setMonth(dateString[i] - 1);
                break;
            case 'F':
                var monthNames = [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December'
                ];
                date.setMonth(monthNames.indexOf(dateString[i]));
                break;
            case 'M':
                var monthAbbrs = [
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec'
                ];
                date.setMonth(monthAbbrs.indexOf(dateString[i]));
                break;
            case 'Y':
                date.setFullYear(dateString[i]);
                break;
        }
    }
    return date;
};
Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
};
var inventorjs_author = 'Yonatan Alexis Quintero Rodriguez';
var inventorjs_version = '0.1';
var inventorjs_email = 'yonax73@gmail.com';
var inventorjs_twitter = '@yonax73';
//# sourceMappingURL=Inventor.js.map