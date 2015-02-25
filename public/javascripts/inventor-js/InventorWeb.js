var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: validation form
**/
var IForm = (function (_super) {
    __extends(IForm, _super);
    function IForm(element) {
        _super.call(this, element);
    }
    return IForm;
})(BaseForm);
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: Alert
**/
var IAlert = (function () {
    function IAlert(htmlElement) {
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
        this.animationIn = 'ui-fade-in';
        this.animationOut = 'ui-fade-out';
        this.typeAnimation = 'ui-ease-in-out';
        this.type = 'close';
        this.durationAnimation = 'ui-1s';
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
    IAlert.prototype.close = function () {
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
    IAlert.prototype.success = function (message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';
    };
    IAlert.prototype.info = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();
    };
    IAlert.prototype.warning = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    };
    IAlert.prototype.danger = function (message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    };
    IAlert.prototype.wait = function (message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    };
    IAlert.prototype.addAnimation = function () {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    };
    IAlert.prototype.removeAnimation = function () {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    };
    return IAlert;
})();
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: DataTable
**/
var IDataTable = (function () {
    function IDataTable(element, action, fields) {
        this.element = element;
        this.action = action;
        this.fields = fields;
        this.icoLoading = document.createElement('i');
        this.table = document.createElement('table');
        this.init();
    }
    IDataTable.prototype.init = function () {
        this.icoLoading.className = 'fa fa-spinner fa-spin';
        this.table.className = 'ui-data-table table table-striped';
        this.fillTable();
    };
    IDataTable.prototype.fillTable = function () {
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
    IDataTable.prototype.fillHeaderTable = function () {
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
    IDataTable.prototype.runIcoLoading = function () {
        this.element.appendChild(this.icoLoading);
    };
    IDataTable.prototype.stopIcoLoading = function () {
        this.element.removeChild(this.icoLoading);
    };
    return IDataTable;
})();
//# sourceMappingURL=InventorWeb.js.map