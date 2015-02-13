﻿/**
@ Autor :https://twitter.com/yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 13/02/2015
@ Date update: 13/02/2015
@ Update by: https://twitter.com/yonax73  | yonax73@gmail.com
@ Description: BaseForm
**/
class BaseForm {

    protected element: HTMLFormElement;
    protected inputs: Array<HTMLInputElement>;
    protected result: boolean;
    protected hasSuccess: string;
    protected hasError: string;
    protected hasFeedBack: string;
    protected iFormErrorMsg: string;
    protected iGroupChecbox: string;

    constructor(element: HTMLFormElement) {
        this.element = element;
        this.inputs = new Array<HTMLInputElement>();
        this.result = true;
        this.hasSuccess = 'has-success';
        this.hasError = 'has-error';
        this.hasFeedBack = 'has-feedback';
        this.iFormErrorMsg = 'i-form-error-msg';
        this.iGroupChecbox = 'i-group-checkbox';
    }

    public isValid() {
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
        while (i < n) {
            totalMultiple *= multiples[i++];
        }
        return totalMultiple > 0;
    }

    protected validate(input) {
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
                    this.result = Form.isEmpty(input.value) ? this.error(input) : this.success(input);                 //Check required verificar si funciona con el this
                    if (this.result) {
                        this.generalValidations(input);
                    }
                } else {
                    this.generalValidations(input);
                }
                break;
            default:
                this.result = true;                                                                                    //The other inputs by default are valid
                break;
        }
    }

    protected validateGroupCheckBox() {
        var groups = this.element.getElementsByClassName(this.iGroupChecbox);
        var n = groups ? groups.length : 0;
        if (n > 0) {
            for (var g = 0; g < n; g++) {
                var group: any = groups[g];
                if (group.dataset.checkmin) {
                    var min = group.dataset.checkmin;
                    if (this.countChecks(group) < min) {
                        this.error(group);
                    } else {
                        this.success(group);
                    }
                } else if (group.dataset.checkmax) {
                    var max = group.dataset.checkmax;
                    if (this.countChecks(group) > max) {
                        this.error(group);
                    } else {
                        this.success(group);
                    }
                } else if (group.dataset.checkrange) {
                    var range = group.dataset.checkrange.split('-');
                    var min = range[0];
                    var max = range[1];
                    var checks = this.countChecks(group);
                    if (checks >= min && checks <= max) {
                        this.success(group);
                    } else {
                        this.error(group);
                    }
                }
            }
        }
    }

    protected countChecks(group) {
        var checkboxes = group.querySelectorAll('input[type="checkbox"]');
        var k = checkboxes.length;
        var checks = 0;
        for (var c = 0; c < k; c++) {
            var checkbox = checkboxes[c];
            if (checkbox.checked) checks++;
        }
        return checks;
    }

    protected generalValidations(input) {
        if (input.dataset.fullname) {
            this.result = Form.isFullName(input.value) ? this.success(input) : this.error(input);                      //Check full name
        } else if (input.dataset.email) {
            this.result = Form.isEmail(input.value) ? this.success(input) : this.error(input);                         //Check email
        } else if (input.dataset.equalsto) {
            var tmpInp: any = document.getElementsByName(input.dataset.equalsto)[0];                                   //Check equals to
            if (Form.isEqualsTo(tmpInp.value, input.value)) {
                var tmpBool1 = this.success(input);
                var tmpBool2 = this.success(tmpInp);
                this.result = tmpBool1 && tmpBool2;
            } else {
                var tmpBool1 = this.error(input);
                var tmpBool2 = this.error(tmpInp);
                this.result = tmpBool1 && tmpBool2;
            }
            if (this.result) {
                this.generalValidations(tmpInp);
            }
        } else if (input.dataset.money) {
            this.result = Form.isMoney(input.value) ? this.success(input) : this.error(input);                         //Check money
        } else if (input.dataset.maxlength) {
            var length = input.dataset.maxlength;
            this.result = Form.maxLength(input.value, length) ? this.success(input) : this.error(input);
        } else if (input.dataset.minlength) {
            var length = input.dataset.minlength;
            this.result = Form.minLength(input.value, length) ? this.success(input) : this.error(input);               //Check min length
        } else if (input.dataset.rangelength) {
            var data = input.dataset.rangelength.split("-");
            var min = data[0];
            var max = data[1];
            this.result = Form.rangeLength(input.value, min, max) ? this.success(input) : this.error(input);           //Check range length
        } else if (input.dataset.max) {
            var max = input.dataset.max;
            this.result = Form.max(input.value, max) ? this.success(input) : this.error(input);                        //Check max number
        } else if (input.dataset.min) {
            var min = input.dataset.min;
            this.result = Form.min(input.value, min) ? this.success(input) : this.error(input);                        //Check min number
        } else if (input.dataset.range) {
            var data = input.dataset.range.split("-");
            var min = data[0];
            var max = data[1];
            this.result = Form.range(input.value, min, max) ? this.success(input) : this.error(input);                 //Check range number
        } else if (input.dataset.url) {
            this.result = Form.isURL(input.value) ? this.success(input) : this.error(input);                           //Check URL
        } else if (input.dataset.date) {
            this.result = Form.isDate(input.value) ? this.success(input) : this.error(input);                          //Check date
        } else if (input.dataset.number) {
            this.result = Form.isNumber(input.value) ? this.success(input) : this.error(input);                        //Check number
        } else if (input.dataset.creditcard) {
            this.result = Form.isCreditCard(input.value) ? this.success(input) : this.error(input);                    //Check credit card
        } else if (input.dataset.option) {
            this.result = Form.isValidOption(input, input.dataset.option) ? this.success(input) : this.error(input);   //Check UI-Select Option
        } else {
            this.success(input);
        }
    }

    protected error(input: HTMLInputElement) {
        var feedBack = this.searchFeedBack(input);
        if (feedBack != null) {
            feedBack.classList.add(this.hasError);
            this.showFormErrorMsg(feedBack);
        }
        return false;
    }

    protected success(input: HTMLInputElement) {
        var feedBack = this.searchFeedBack(input);
        if (feedBack != null) {
            feedBack.classList.add(this.hasSuccess);
            this.hiddenFormErrorMsg(feedBack);
        }
        return true;
    }

    public serialize() {
        var elements = this.element.elements;
        var serialized = [];
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element: HTMLInputElement = <HTMLInputElement> elements[i];
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
                        if (element.checked) serialized.push(name + '=' + value);
                        break;
                    default:
                        break;
                }
            }
        }
        return serialized.join('&');
    }

    public toJSON() {
        var elements = this.element.elements;
        var json: any = {};
        var i = 0;
        var n = elements.length;
        for (i = 0; i < n; i++) {
            var element: HTMLInputElement = <HTMLInputElement> elements[i];
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
                        if (element.checked) json[name] = value;
                        break;
                }
            }
        }
        return json;
    }

    public onsubmit(callback) {
        this.element.onsubmit = (e) => {
            e.preventDefault();
            callback();
        }
    }

    /*    
      * @param input element
      * @returns the feedback that contains the input element
      */
    protected searchFeedBack(input: HTMLInputElement): HTMLElement {
        var feedBacks = this.element.getElementsByClassName(this.hasFeedBack);
        var n = feedBacks.length;
        var feedBack: HTMLElement = null;
        if (feedBacks != null && n > 0) {
            var i = 0;
            var found = false;
            do {
                feedBack = <HTMLElement> feedBacks[i];
                var tmpInput: HTMLInputElement = <HTMLInputElement>feedBack.getElementsByTagName('input')[0];
                found = tmpInput.name === input.name;
                i++;
            } while (!found && i < n);
        }
        return feedBack;
    }

    protected showFormErrorMsg(feedBack: HTMLElement) {
        var formMsg: HTMLElement = <HTMLElement> feedBack.getElementsByClassName(this.iFormErrorMsg)[0];
        if (formMsg != null) {
            if (formMsg.classList.contains('hidden')) {
                formMsg.classList.remove('hidden');
                formMsg.classList.add('show');
            }
        }
    }

    protected hiddenFormErrorMsg(feedBack: HTMLElement) {
        var formMsg: HTMLElement = <HTMLElement> feedBack.getElementsByClassName(this.iFormErrorMsg)[0];
        if (formMsg != null) {
            if (formMsg.classList.contains('show')) {
                formMsg.classList.remove('show');
                formMsg.classList.add('hidden');
            }
        }
    }

    /*    
    * @param String value
    * @returns true if value is fullname
    */
    static isFullName(value) {
        return value.match(/^[a-zA-Z][a-zA-Z ]+$/);
    }
    /*
    * @param String value 
    * @returns true if value is email
    */
    static isEmail(value) {
        return value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    }
    /*
    * @param String value
    * @returns true if value is empty
    */
    static isEmpty(value) {
        return !value.match(/^\S+$|[^\s]+$/);
    }
    /*    
    * @param String value 
    * @param String value1 
    * @returns true if both values are equals
    */
    static isEqualsTo(value, value1) {
        return value === value1;
    }
    /*
    * @param String value 
    * @returns true if value is money format
    */
    static isMoney(value) {
        return value.match(/^\d+(,\d{3})*(\.\d*)?$/);
    }
    /*     
    * @param String value	 
    * @param length, number of characters 
    * @returns true if  value  has length characters or less 
    */
    static maxLength(value, length) {
        return !isNaN(length) && value.length <= length;
    }
    /* 
    * @param String value
    * @param length, number of characters 
    * @returns true if  value has length characters or more 
    */
    static minLength(value, length) {
        return !isNaN(length) && value.length >= length;
    }
    /*
    * @param String value
    * @param min, number minimum of characters 
    * @param max, number maximum of characters 
    * @returns true if  value is between min and max
    */
    static rangeLength(value, min, max) {
        var length = value.length;
        return ((!isNaN(min) && length >= min) && (!isNaN(max) && length <= max));
    }
    /*     
    * @param String value 
    * @param max, number maximun
    * @returns true if  value is equals or less that max
    */
    static max(value, max) {
        return (!isNaN(max) && value <= max);
    }
    /* 
    * @param String value
    * @param min, number minimun
    * @returns true if value is equals or greater that min
    */
    static min(value, min) {
        return (!isNaN(min) && value >= min);
    }
    /* 
    * @param String value 
    * @param min, number minimum  
    * @param max, number maximum
    * @returns true if value is between min and max number
    */
    static range(value, min, max) {
        return ((!isNaN(min) && value >= min) && (!isNaN(max) && value <= max));
    }
    /*
    * @param String value
    * @returns true if value is URL
    */
    static isURL(value) {
        return value.match(/https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}/);
    }
    /*
    * @param String value 
    * @returns true if value is Date
    */
    static isDate(value) {
        var parms = value.split(/[\.\-\/]/);
        var yyyy = parseInt(parms[2], 10);;
        var mm = parseInt(parms[1], 10);
        var dd = parseInt(parms[0], 10);
        if (yyyy < 1582) {
            var tmp = yyyy;
            yyyy = dd;
            dd = tmp;
        }
        var date = new Date(yyyy, mm - 1, dd);
        return (mm === (date.getMonth() + 1) && dd === date.getDate() && yyyy === date.getFullYear());
    }
    /*
    * @param String value
    * @returns true if value is Number
    */
    static isNumber(value) {
        return !isNaN(value);
    }
    /*
    * @param String value
    * @returns true if value is credit card
    */
    static isCreditCard(value) {
        return value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/);
    }
    /*
   * @param HtmlElement input
   * @returns true if input is Checked
   */
    static isChecked(input) {
        return input.checked;
    }
    /*
    * @param HtmlElement input
    * @param option
    * @returns true if option is greater than zero
    */
    static isValidOption(input, option) {
        return (!isNaN(option) && option > 0);
    }


}
/**
@ Autor : https://twitter.com/yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 13/02/2015
@ Date update: 13/02/2015
@ Update by: https://twitter.com/yonax73 | yonax73@gmail.com
@ Description: extend object String
**/
interface String {
    isEmpty(): boolean;
}
String.prototype.isEmpty = function () {
    return this == undefined || this === null || this === '' || this.length <= 0;
}
/**
@ Autor : https://twitter.com/yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 13/02/2015
@ Date update: 13/02/2015
@ Update by: https://twitter.com/yonax73 | yonax73@gmail.com
@ Description: extend object Date
**/
interface Date {
    getMonthName(): string;
    getMonthAbbr(): string;
    getDayFull(): string;
    getDayAbbr(): string;
    getDayOfYear(): number;
    getDaySuffix(): string;
    getWeekOfYear(): number;
    getWeekOfMonth(): number;
    isLeapYear(): boolean;
    getMonthDayCount(): number;
    previousMonth();
    nextMonth();
    clone(): Date;
    isValid(): boolean;
    format(format): string;
    parse(strDate, pattern): Date;
}
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
}
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
}
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
}
/*
* return week of month
*/
Date.prototype.getWeekOfMonth = function () {
    var firstDayOfMonth = new Date(this.getFullYear(), this.getMonth(), 1).getDay();
    return Math.ceil((this.getDate() + firstDayOfMonth) / 7);
}

/*
* Return if it is a leap year or not
*/
Date.prototype.isLeapYear = function () {
    return (this.getFullYear() % 4 === 0 || (this.getFullYear() % 100 !== 0 && this.getFullYear() % 400 === 0));
}
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
}
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
}
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
}
/*
* returns clone date
*/
Date.prototype.clone = function () {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate());
}
/*
 * returns true if the date is valid
 */
Date.prototype.isValid = function () {
    return !isNaN(this.getTime());
}
/*
* return Format date
*/
Date.prototype.format = function (dateFormat) {
    /*
    * break apart format string into array of characters
    */
    dateFormat = dateFormat.split("");
    var date = this.getDate(),
        month = this.getMonth(),
        hours = this.getHours(),
        minutes = this.getMinutes(),
        seconds = this.getSeconds();
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
        } else {
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
/**
@ Autor :https://twitter.com/yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 13/02/2015
@ Date update: 13/02/2015
@ Update by:https://twitter.com/yonax73 | yonax73@gmail.com
@ Description: extend object Element
**/
interface Element {
    removeChildren();
}
Element.prototype.removeChildren = function () {
    while (this.childNodes.length > 0) {
        this.removeChild(this.childNodes[0]);
    }
}

var inventorjs_author = 'Yonatan Alexis Quintero Rodriguez';
var inventorjs_version = '0.1';
var inventorjs_email = 'yonax73@gmail.com';
var inventorjs_twitter = 'https://twitter.com/yonax73';

