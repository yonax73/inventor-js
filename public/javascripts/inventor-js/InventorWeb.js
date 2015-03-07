var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 27/02/2015
@ Date update: 27/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: select
**/
var ETypeSelect;
(function (ETypeSelect) {
    ETypeSelect[ETypeSelect["SIMPLE"] = 0] = "SIMPLE";
    ETypeSelect[ETypeSelect["ICON"] = 1] = "ICON";
    ETypeSelect[ETypeSelect["IMAGE"] = 2] = "IMAGE";
})(ETypeSelect || (ETypeSelect = {}));
var Select = (function () {
    function Select(htmlElement, action, callback, data, options) {
        var _this = this;
        this.hidden = document.createElement('input');
        this.input = document.createElement('input');
        this.mask = document.createElement('div');
        this.ico = document.createElement('i');
        this.items = document.createElement('ul');
        this.element = null;
        this.open = false;
        this.disabled = false;
        this.readOnly = false;
        this.data = null;
        this.length = 0;
        this.icono = 'fa-angle-down';
        this.type = 0 /* SIMPLE */;
        this.options = null;
        this.inputLgClass = 'i-select-lg';
        this.element = htmlElement;
        this.action = action;
        this.callback = callback;
        this.data = data;
        if (options)
            this.setOptions(options);
        this.animaIn = new Animation('i-ease', 'i-flip-in-x', 'i-2s', 200);
        this.animaOut = new Animation('i-ease', 'i-flip-out-x', 'i-0-2s', 200);
        this.itemSate = new State();
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name'))
            this.hidden.name = this.element.getAttribute('data-name');
        if (this.element.getAttribute('data-required'))
            this.input.dataset.required = this.element.getAttribute('data-required');
        this.input.type = 'text';
        this.input.className = 'form-control';
        if (this.element.classList.contains(this.inputLgClass))
            this.input.classList.add('input-lg');
        this.input.onchange = function () {
            return true;
        };
        this.input.onkeyup = function (e) {
            if (e) {
                if (e.keyCode == 13)
                    _this.toggle();
                if (e.keyCode == 38)
                    _this.previous();
                if (e.keyCode == 40)
                    _this.next();
            }
        };
        this.input.onkeydown = function (e) {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 && e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.element.appendChild(this.hidden);
        this.element.appendChild(this.input);
        this.mask.className = 'i-select-mask';
        this.mask.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.element.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = function (e) {
            _this.toggle();
            e.stopPropagation();
            return false;
        };
        this.element.appendChild(this.ico);
        this.items.className = 'i-select-items';
        this.element.appendChild(this.items);
        this.config();
        this.fill();
    }
    Select.prototype.setOptions = function (options) {
        this.options = options;
        if (options.icon) {
            this.type = 1 /* ICON */;
            this.itemIconState = new State();
        }
        else if (options.image) {
            this.type = 2 /* IMAGE */;
            this.itemImageState = new State();
        }
    };
    Select.prototype.config = function (clear) {
        switch (this.type) {
            case 1 /* ICON */:
                if (clear) {
                    this.element.classList.remove('has-i-icon');
                    this.items.classList.remove('fa-lu');
                    this.element.removeChild(this.icoItem);
                    this.icoItem = null;
                }
                else {
                    this.element.classList.add('has-i-icon');
                    this.items.classList.add('fa-lu');
                    this.icoItem = document.createElement('i');
                    this.icoItem.className = 'form-control-i-icon fa';
                    this.element.appendChild(this.icoItem);
                }
                break;
            case 2 /* IMAGE */:
                if (clear) {
                    this.element.classList.remove('has-i-image');
                    this.items.classList.remove('i-image-lu');
                    this.element.removeChild(this.imgItem);
                    this.imgItem = null;
                }
                else {
                    this.element.classList.add('has-i-image');
                    this.items.classList.add('i-image-lu');
                    this.imgItem = document.createElement('img');
                    this.imgItem.className = 'form-control-i-image';
                    this.element.appendChild(this.imgItem);
                }
                break;
        }
    };
    Select.prototype.fill = function () {
        var _this = this;
        if (this.action) {
            var actionHXR = new XHR('GET', this.action);
            actionHXR.setContentType('application/x-www-form-urlencoded;charset=UTF-8');
            actionHXR.onBeforeSend(function () {
                _this.loading();
            });
            actionHXR.onReady(function (xhr) {
                _this.data = JSON.parse(xhr.responseText);
                var n = _this.data.length;
                _this.fillItems();
                _this.complete();
                if (_this.callback)
                    _this.callback();
            });
            actionHXR.send();
        }
        else {
            this.fillItems();
            if (this.callback)
                this.callback();
        }
    };
    Select.prototype.fillItems = function () {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            if (item.icon)
                this.addIcon(li, item.icon);
            else if (item.image)
                this.addImage(li, item.image);
            li.appendChild(document.createTextNode(item.value));
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            };
            li.onkeyup = function (e) {
                if (e) {
                    if (e.keyCode == 13) {
                        self.changeValue(self.itemSate.current);
                        self.toggle();
                    }
                    if (e.keyCode == 38) {
                        self.previous();
                    }
                    if (e.keyCode == 40) {
                        self.next();
                    }
                }
            };
            this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    };
    Select.prototype.addIcon = function (element, classIcon) {
        var tmpIcon = document.createElement('i');
        tmpIcon.className = 'fa fa-li';
        tmpIcon.classList.add(classIcon);
        element.appendChild(tmpIcon);
    };
    Select.prototype.addImage = function (element, src) {
        var tmpImg = document.createElement('img');
        tmpImg.className = 'i-image-item';
        tmpImg.src = src;
        element.appendChild(tmpImg);
    };
    Select.prototype.animationIn = function () {
        this.items.classList.add('open');
        this.animaIn.run(this.items);
    };
    Select.prototype.animationOut = function () {
        var _this = this;
        this.animaOut.run(this.items, function () {
            _this.items.classList.remove('open');
        });
    };
    Select.prototype.changeValue = function (htmlElement) {
        this.itemSate.exchange(htmlElement);
        this.input.value = this.itemSate.current.textContent;
        this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
        this.hidden.value = this.input.dataset.option;
        this.input.onchange();
        this.itemSate.old.classList.remove('bg-primary');
        this.itemSate.current.classList.add('bg-primary');
        if (this.isTypeIcon()) {
            this.changeIconItem();
        }
        else if (this.isTypeImage()) {
            this.changeImageItem();
        }
        this.input.focus();
    };
    Select.prototype.changeIconItem = function () {
        this.itemIconState.exchange(this.getIconItem());
        this.icoItem.classList.remove(this.itemIconState.old);
        this.icoItem.classList.add(this.itemIconState.current);
    };
    Select.prototype.changeImageItem = function () {
        this.itemImageState.exchange(this.getImageItem());
        this.imgItem.src = this.itemImageState.current;
    };
    Select.prototype.next = function () {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.nextElementSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };
    Select.prototype.previous = function () {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.previousSibling;
            if (item) {
                this.changeValue(item);
            }
        }
    };
    Select.prototype.isTypeIcon = function () {
        return this.type === 1 /* ICON */;
    };
    Select.prototype.isTypeImage = function () {
        return this.type === 2 /* IMAGE */;
    };
    Select.prototype.isTypeSimple = function () {
        return this.type === 0 /* SIMPLE */;
    };
    Select.prototype.toggle = function () {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            }
            else {
                Select.clear();
                this.animationIn();
                this.open = true;
                if (!this.itemSate.current) {
                    this.itemSate.current = this.items.getElementsByTagName('li')[0];
                    this.itemSate.current.classList.add('bg-primary');
                }
                this.itemSate.current.focus();
                this.input.focus();
            }
        }
    };
    Select.prototype.selectItem = function (option) {
        if (!this.disabled && !this.readOnly) {
            var lis = this.items.getElementsByTagName('li');
            if (this.length > 0) {
                var found = false;
                var i = 0;
                do {
                    var item = lis[i];
                    i++;
                    if (item.getAttribute('data-option') == option) {
                        this.itemSate.exchange(item);
                        found = true;
                    }
                } while (!found && i < this.length);
                if (found) {
                    this.input.value = this.itemSate.current.textContent;
                    this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
                    this.hidden.value = this.input.dataset.option;
                    if (this.isTypeIcon()) {
                        this.changeIconItem();
                    }
                    else if (this.isTypeImage()) {
                        this.changeImageItem();
                    }
                    this.itemSate.current.focus();
                    if (this.itemSate.old)
                        this.itemSate.old.classList.remove('bg-primary');
                    this.itemSate.current.classList.add('bg-primary');
                }
            }
        }
    };
    Select.prototype.addItem = function (option, value, args) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            if (args) {
                if (args.icon && this.isTypeIcon()) {
                    this.addIcon(li, args.icon);
                }
                else if (args.image && this.isTypeImage()) {
                    this.addImage(li, args.image);
                }
            }
            li.appendChild(document.createTextNode(value));
            li.tabIndex = this.length + 1;
            li.setAttribute('data-option', option);
            this.input.setAttribute('data-option', option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            };
            this.items.appendChild(li);
            this.length++;
        }
    };
    Select.prototype.getItem = function () {
        if (!this.disabled && !this.readOnly) {
            if (this.isTypeIcon()) {
                var tmpIcon = this.itemSate.current.getElementsByClassName('fa')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    icon: tmpIcon.classList.item(2)
                };
            }
            else if (this.isTypeImage()) {
                var tmpImg = this.itemSate.current.getElementsByClassName('i-image-item')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    image: tmpImg.src
                };
            }
            else {
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option')
                };
            }
        }
    };
    Select.prototype.getValue = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    };
    Select.prototype.getOption = function () {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    };
    Select.prototype.isOpen = function () {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    };
    /**
    * get Icon Item Class
    * @returns {string} class Icon
    * @method getIconItem
    */
    Select.prototype.getIconItem = function () {
        if (!this.disabled && !this.readOnly) {
            var tmpIcon = this.itemSate.current.getElementsByClassName('fa')[0];
            return tmpIcon.classList.item(2);
        }
    };
    /**
    * get Image Item src
    * @returns {string} src
    * @method getImageItem
    */
    Select.prototype.getImageItem = function () {
        if (!this.disabled && !this.readOnly) {
            var tmpImg = this.itemSate.current.getElementsByClassName('i-image-item')[0];
            return tmpImg.src;
        }
    };
    /**
    * set Data
    * @param {[JSON]} data
    * @param {JSON} options
    * @method setDate
    */
    Select.prototype.setData = function (data, options) {
        if (!this.disabled && !this.readOnly) {
            /**
            * Clear
            */
            this.clearData();
            /**
            * Load
            */
            this.data = data;
            if (options)
                this.setOptions(options);
            this.config();
            this.fill();
        }
    };
    Select.prototype.isDisabled = function () {
        return this.disabled;
    };
    Select.prototype.setDisabled = function (disabled) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        }
        else {
            this.element.classList.remove('disabled');
        }
    };
    Select.prototype.isReadOnly = function () {
        return this.readOnly;
    };
    Select.prototype.setReadOnly = function (readOnly) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        }
        else {
            this.element.classList.remove('read-only');
        }
    };
    Select.prototype.setHeight = function (height) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    };
    Select.prototype.getSize = function () {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    };
    Select.prototype.setIcono = function (icono) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    };
    Select.prototype.focus = function () {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    };
    Select.prototype.loading = function () {
        if (this.ico.classList.contains(this.icono))
            this.ico.classList.remove(this.icono);
        if (!this.ico.classList.contains('fa-spinner'))
            this.ico.classList.add('fa-spinner');
        if (!this.ico.classList.contains('fa-spin'))
            this.ico.classList.add('fa-spin');
        this.setDisabled(true);
    };
    Select.prototype.complete = function () {
        if (this.ico.classList.contains('fa-spinner'))
            this.ico.classList.remove('fa-spinner');
        if (this.ico.classList.contains('fa-spin'))
            this.ico.classList.remove('fa-spin');
        if (!this.ico.classList.contains(this.icono))
            this.ico.classList.add(this.icono);
        this.setDisabled(false);
    };
    Select.prototype.clearData = function () {
        this.config(true);
        this.hidden.value = '';
        this.input.value = '';
        this.input.removeAttribute('data-option');
        this.items.innerHTML = '';
    };
    Select.prototype.onchange = function (callback) {
        this.input.onchange = callback;
    };
    Select.clear = function () {
        var selects = document.getElementsByClassName('i-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items) {
                    if (items.classList.contains('open')) {
                        items.classList.add('i-ease-out');
                        items.classList.add('i-0-2s');
                        items.classList.add('i-fade-out-up');
                        (function (items) {
                            setTimeout(function () {
                                items.classList.remove('i-ease-out');
                                items.classList.remove('i-0-2s');
                                items.classList.remove('i-fade-out-up');
                                items.classList.remove('open');
                            }, 200);
                        })(items);
                    }
                }
            }
        }
    };
    return Select;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: validation form
**/
var Form = (function (_super) {
    __extends(Form, _super);
    function Form(element) {
        _super.call(this, element);
    }
    return Form;
})(BaseForm);
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: Alert
**/
var Alert = (function () {
    function Alert(htmlElement) {
        this.element = null;
        this.button = document.createElement('button');
        this.span = document.createElement('span');
        this.p = document.createElement('p');
        this.i = document.createElement('i');
        this.strong = document.createElement('strong');
        this.icoSuccess = 'fa-check';
        this.icoInfo = 'fa-info';
        this.icoWarning = 'fa-exclamation-triangle';
        this.icoDanger = 'fa-times';
        this.icoWait = 'fa-circle-o-notch';
        this.animationIn = 'i-fade-in';
        this.animationOut = 'i-fade-out';
        this.typeAnimation = 'i-ease-in-out';
        this.type = 'close';
        this.durationAnimation = 'i-1s';
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close();
        };
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }
    Alert.prototype.close = function () {
        if (this.type !== 'close') {
            switch (this.type) {
                case 'success':
                    this.element.className = 'alert alert-success alert-dismissible';
                    break;
                case 'info':
                case 'wait':
                    this.element.className = 'alert alert-info alert-dismissible';
                    break;
                case 'warning':
                    this.element.className = 'alert alert-warning alert-dismissible';
                    break;
                case 'danger':
                    this.element.className = 'alert alert-danger alert-dismissible';
                    break;
            }
            this.type = 'close';
            this.element.classList.add(this.typeAnimation);
            this.element.classList.add(this.durationAnimation);
            this.element.classList.add(this.animationOut);
            var self = this;
            setTimeout(function () {
                self.element.classList.add('hidden');
            }, 1000);
        }
    };
    Alert.prototype.success = function (message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';
    };
    Alert.prototype.info = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();
    };
    Alert.prototype.warning = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    };
    Alert.prototype.danger = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    };
    Alert.prototype.wait = function (message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    };
    Alert.prototype.addAnimation = function () {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    };
    Alert.prototype.removeAnimation = function () {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    };
    return Alert;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: DataTable
**/
var DataTable = (function () {
    function DataTable(element, action, fields) {
        this.element = element;
        this.action = action;
        this.fields = fields;
        this.icoLoading = document.createElement('i');
        this.table = document.createElement('table');
        this.init();
    }
    DataTable.prototype.init = function () {
        this.icoLoading.className = 'fa fa-spinner fa-spin';
        this.table.className = 'i-data-table table table-striped';
        this.fillTable();
    };
    DataTable.prototype.fillTable = function () {
        var _this = this;
        var m = this.fields.length;
        if (m > 0) {
            this.fillHeaderTable();
            var actionHXR = new XHR('GET', this.action);
            actionHXR.setContentType('application/x-www-form-urlencoded;charset=UTF-8');
            actionHXR.onBeforeSend(function () {
                _this.runIcoLoading();
            });
            actionHXR.onReady(function (xhr) {
                _this.data = JSON.parse(xhr.responseText);
                var n = _this.data.length;
                if (n > 0) {
                    var i = 0;
                    var tbody = document.createElement('tbody');
                    do {
                        var tr = document.createElement('tr');
                        var d = _this.data[i];
                        for (var j = 0; j < m; j++) {
                            var td = document.createElement('td');
                            var field = _this.fields[j];
                            td.textContent = d[field.value];
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                        i++;
                    } while (i < n);
                    _this.table.appendChild(tbody);
                    _this.stopIcoLoading();
                    _this.element.appendChild(_this.table);
                }
            });
            actionHXR.send();
        }
    };
    DataTable.prototype.fillHeaderTable = function () {
        var m = this.fields.length;
        if (m > 0) {
            var j = 0;
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            thead.appendChild(tr);
            do {
                var th = document.createElement('th');
                var field = this.fields[j];
                th.textContent = field.name;
                tr.appendChild(th);
                j++;
            } while (j < m);
            this.table.appendChild(thead);
        }
    };
    DataTable.prototype.runIcoLoading = function () {
        this.element.appendChild(this.icoLoading);
    };
    DataTable.prototype.stopIcoLoading = function () {
        this.element.removeChild(this.icoLoading);
    };
    return DataTable;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 07/03/2015
@ Date update: 07/03/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: Toggle
**/
var Toggle = (function () {
    function Toggle() {
    }
    Toggle.init = function () {
        this.initNavBar();
        this.initDropDown();
    };
    Toggle.initNavBar = function () {
        var navbars = document.querySelectorAll('.navbar-toggle[data-toggle="collapse"]');
        var n = navbars.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = navbars[i];
                element.onclick = function () {
                    var target = document.getElementById(this.dataset.target);
                    this.classList.toggle('collapsed');
                    target.classList.toggle('in');
                };
            }
        }
    };
    Toggle.initDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var element = dropdownsToggle[i];
                element.onclick = function (e) {
                    var dropdown = this.parentNode;
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    if (dropdown.classList.contains('open')) {
                        dropdownMenu.classList.add('i-ease');
                        dropdownMenu.classList.add('i-0-5s');
                        dropdownMenu.classList.add('i-fade-out-up');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('i-ease');
                            dropdownMenu.classList.remove('i-0-5s');
                            dropdownMenu.classList.remove('i-fade-out-up');
                            dropdown.classList.remove('open');
                        }, 500);
                    }
                    else {
                        dropdown.classList.add('open');
                        dropdownMenu.classList.add('i-ease');
                        dropdownMenu.classList.add('i-0-5s');
                        dropdownMenu.classList.add('i-fade-in-down');
                        setTimeout(function () {
                            dropdownMenu.classList.remove('i-ease');
                            dropdownMenu.classList.remove('i-0-5s');
                            dropdownMenu.classList.remove('i-fade-in-down');
                        }, 500);
                    }
                    e.stopPropagation();
                    return false;
                };
            }
        }
    };
    Toggle.clearDropDown = function () {
        var dropdownsToggle = document.querySelectorAll('.dropdown-toggle[data-toggle="dropdown"]');
        var n = dropdownsToggle.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var dropdown = dropdownsToggle[i].parentNode;
                if (dropdown.classList.contains('open')) {
                    var dropdownMenu = dropdown.getElementsByClassName('dropdown-menu')[0];
                    dropdownMenu.classList.add('ui-ease');
                    dropdownMenu.classList.add('ui-0-5s');
                    dropdownMenu.classList.add('ui-fade-out-up');
                    setTimeout(function () {
                        dropdownMenu.classList.remove('ui-ease');
                        dropdownMenu.classList.remove('ui-0-5s');
                        dropdownMenu.classList.remove('ui-fade-out-up');
                        dropdown.classList.remove('open');
                    }, 500);
                }
            }
        }
    };
    return Toggle;
})();
