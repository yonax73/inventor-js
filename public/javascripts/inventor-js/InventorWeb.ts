/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: validation form
**/
class IForm extends BaseForm {

    constructor(element: HTMLFormElement) {
        super(element);
    }

}
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: Alert
**/
class IAlert {

    private element: HTMLElement = null;
    private button = document.createElement('button');
    private span = document.createElement('span');
    private p = document.createElement('p');
    private i = document.createElement('i');
    private strong = document.createElement('strong');
    public icoSuccess = 'fa-check';
    public icoInfo = 'fa-info';
    public icoWarning = 'fa-exclamation-triangle';
    public icoDanger = 'fa-times';
    public icoWait = 'fa-circle-o-notch';
    public animationIn = 'ui-fade-in';
    public animationOut = 'ui-fade-out';
    public typeAnimation = 'ui-ease-in-out';
    private type = 'close';
    private durationAnimation = 'ui-1s';

    constructor(htmlElement: HTMLElement) {
        this.element = htmlElement;
        this.element.className = 'hidden';
        this.button.className = 'close';
        this.button.type = 'button';
        var self = this;
        this.button.onclick = function () {
            self.close()
        }
        this.span.innerHTML = '&times;';
        this.button.appendChild(this.span);
        this.element.appendChild(this.button);
        this.p.className = 'text-center';
        this.p.appendChild(this.i);
        this.p.appendChild(this.strong);
        this.element.appendChild(this.p);
    }

    public close() {
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
            setTimeout(function () { self.element.classList.add('hidden') }, 1000);
        }
    }

    public success(message) {
        this.removeAnimation();
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoSuccess);
        this.element.className = 'alert alert-success alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'success';

    }

    public info(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoInfo);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'info';
        this.removeAnimation();

    }

    public warning(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoWarning);
        this.element.className = 'alert alert-warning alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'warning';
        this.removeAnimation();
    }

    public danger(message) {
        this.i.className = 'fa fa-lg pull-left';
        this.i.classList.add(this.icoDanger);
        this.element.className = 'alert alert-danger alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'danger';
        this.removeAnimation();
    }

    public wait(message) {
        this.i.className = 'fa fa-spin fa-lg pull-left';
        this.i.classList.add(this.icoWait);
        this.element.className = 'alert alert-info alert-dismissible';
        this.addAnimation();
        this.strong.textContent = message;
        this.type = 'wait';
        this.removeAnimation();
    }

    private addAnimation() {
        this.element.classList.add(this.typeAnimation);
        this.element.classList.add(this.durationAnimation);
        this.element.classList.add(this.animationIn);
    }

    private removeAnimation() {
        var self = this;
        setTimeout(function () {
            self.element.classList.remove(self.typeAnimation);
            self.element.classList.remove(self.durationAnimation);
            self.element.classList.remove(self.animationIn);
        }, 1000);
    }
}
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73 | yonax73@gmail.com
@ Description: DataTable
**/
class IDataTable {

    private element: HTMLElement;
    private icoLoading: HTMLElement;
    private action: String;
    private fields: Array<{}>;
    private table: HTMLElement;
    private data: Array<JSON>;

    constructor(element: HTMLElement, action: String, fields: Array<{}>) {
        this.element = element;
        this.action = action;
        this.fields = fields;
        this.icoLoading = document.createElement('i');
        this.table = document.createElement('table');
        this.init();
    }

    public init() {
        this.icoLoading.className = 'fa fa-spinner fa-spin';
        this.table.className = 'ui-data-table table table-striped';
        this.fillTable();
    }

    private fillTable() {
        var m = this.fields.length;
        if (m > 0) {
            this.fillHeaderTable();
            var actionHXR = new XHR('GET', this.action);
            actionHXR.setContentType('application/x-www-form-urlencoded;charset=UTF-8');
            actionHXR.onBeforeSend(() => { this.runIcoLoading() });
            actionHXR.onReady((xhr) => {
                this.data = JSON.parse(xhr.responseText);
                var n = this.data.length;
                if (n > 0) {
                    var i = 0;
                    var tbody = document.createElement('tbody');

                    do {
                        var tr = document.createElement('tr');
                        var d: any = this.data[i];
                        for (var j = 0; j < m; j++) {
                            var td = document.createElement('td');
                            var field: any = this.fields[j];
                            td.textContent = d[field.value];
                            tr.appendChild(td);
                        }
                        tbody.appendChild(tr);
                        i++;
                    } while (i < n);
                    this.table.appendChild(tbody);
                    this.stopIcoLoading();
                    this.element.appendChild(this.table);
                }
            });
            actionHXR.send();
        }
    }

    private fillHeaderTable() {
        var m = this.fields.length;
        if (m > 0) {
            var j = 0;
            var thead = document.createElement('thead');
            var tr = document.createElement('tr');
            thead.appendChild(tr);
            do {
                var th = document.createElement('th');
                var field: any = this.fields[j];
                th.textContent = field.name;
                tr.appendChild(th);
                j++;
            } while (j < m);
            this.table.appendChild(thead);
        }
    }

    private runIcoLoading() {
        this.element.appendChild(this.icoLoading);
    }

    private stopIcoLoading() {
        this.element.removeChild(this.icoLoading);
    }

}