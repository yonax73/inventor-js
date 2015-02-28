
/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 27/02/2015
@ Date update: 27/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: select
**/
enum ETypeSelect {
    SIMPLE,
    ICON,
    IMAGE
}
class Select {

    
    private hidden = document.createElement('input');
    private input: any = document.createElement('input');
    private mask = document.createElement('div');
    private ico = document.createElement('i');
    private icoItem: HTMLElement;
    private imgItem: HTMLImageElement;
    private items = document.createElement('ul');
    private element: HTMLElement = null;
    private open = false;
    private disabled = false;
    private readOnly = false;
    private data: Array<any> = null;
    private length = 0;
    private icono = 'fa-angle-down';
    private animaIn: Animation;
    private animaOut: Animation;
    private type = ETypeSelect.SIMPLE;
    private options = null;
    private itemSate: State;
    private itemIconState: State;
    private itemImageState: State;
    private inputLgClass = 'i-select-lg';
    private action: String;

    constructor(htmlElement: HTMLElement,action,data, options) {
        this.element = htmlElement;
        this.action = action;
        this.data = data;
        if (options) this.setOptions(options);
        this.animaIn = new Animation('i-ease', 'i-flip-in-x', 'i-2s', 200);
        this.animaOut = new Animation('i-ease', 'i-flip-out-x', 'i-0-2s', 200);
        this.itemSate = new State();       
        this.hidden.type = 'hidden';
        if (this.element.getAttribute('data-name')) this.hidden.name = this.element.getAttribute('data-name');   
        if (this.element.getAttribute('data-required')) this.input.dataset.required = this.element.getAttribute('data-required');        
        this.input.type = 'text';
        this.input.className = 'form-control';
        if (this.element.classList.contains(this.inputLgClass)) this.input.classList.add('input-lg');
        this.input.onchange = () => { return true; }
        this.input.onkeyup = (e) => {
            if (e) {
                if (e.keyCode == 13) this.toggle();
                if (e.keyCode == 38) this.previous();
                if (e.keyCode == 40) this.next();
            }
        };
        this.input.onkeydown = (e) => {
            if (e) {
                if (e.keyCode != 9 && e.keyCode != 13 && e.keyCode != 16 &&
                    e.keyCode != 17 && !(e.keyCode >= 38 && e.keyCode <= 40)) {
                    e.preventDefault();
                }
            }
        };
        this.element.appendChild(this.input);
        this.mask.className = 'i-select-mask';
        this.mask.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.element.appendChild(this.mask);
        this.ico.className = 'form-control-feedback fa';
        this.ico.classList.add(this.icono);
        this.ico.onclick = (e) => {
            this.toggle();
            e.stopPropagation();
            return false;
        }
        this.element.appendChild(this.ico);        
        this.items.className = 'i-select-items';
        this.element.appendChild(this.items);
        this.config();
        this.fill();
    }

    private setOptions(options) {
        this.options = options;
        if (options.icon) {
            this.type = ETypeSelect.ICON;
            this.itemIconState = new State();
        } else if (options.image) {
            this.type = ETypeSelect.IMAGE;
            this.itemImageState = new State();
        }
    }

    private config(clear?) {
        switch (this.type) {
            case ETypeSelect.ICON:
                if (clear) {
                    this.element.classList.remove('has-i-icon');
                    this.items.classList.remove('fa-lu');
                    this.element.removeChild(this.icoItem);
                    this.icoItem = null;
                } else {
                    this.element.classList.add('has-i-icon');
                    this.items.classList.add('fa-lu');
                    this.icoItem = document.createElement('i');
                    this.icoItem.className = 'form-control-i-icon fa';
                    this.element.appendChild(this.icoItem);
                }

                break;
            case ETypeSelect.IMAGE:
                if (clear) {
                    this.element.classList.remove('has-i-image');
                    this.items.classList.remove('i-image-lu');
                    this.element.removeChild(this.imgItem);
                    this.imgItem = null;
                } else {
                    this.element.classList.add('has-i-image');
                    this.items.classList.add('i-image-lu');
                    this.imgItem = document.createElement('img');
                    this.imgItem.className = 'form-control-i-image';
                    this.element.appendChild(this.imgItem);
                }
                break;
        }
    }

    private fill() {
        if (this.action) {
            var actionHXR = new XHR('GET', this.action);
            actionHXR.setContentType('application/x-www-form-urlencoded;charset=UTF-8');
            actionHXR.onBeforeSend(() => { this.loading() });
            actionHXR.onReady((xhr) => {
                this.data = JSON.parse(xhr.responseText);
                var n = this.data.length;
                this.fillItems();
                this.complete();
            });
            actionHXR.send();
        } else {
            this.fillItems();
        }       
    }

    private fillItems() {
        this.length = this.data.length;
        for (var i = 0; i < this.length; i++) {
            var item = this.data[i];
            var li = document.createElement('li');
            if (item.icon) this.addIcon(li, item.icon);
            else if (item.image) this.addImage(li, item.image);
            li.appendChild(document.createTextNode(item.value));
            li.tabIndex = i;
            li.setAttribute('data-option', item.option);
            var self = this;
            li.onclick = function (e) {
                self.changeValue(this);
                self.toggle();
                e.stopPropagation();
                return false;
            }
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
            }
            this.items.appendChild(li);
            if (item.selected) {
                this.selectItem(item.option);
            }
        }
    }

    private addIcon(element: HTMLElement, classIcon: string) {
        var tmpIcon = document.createElement('i');
        tmpIcon.className = 'fa fa-li';
        tmpIcon.classList.add(classIcon);
        element.appendChild(tmpIcon);
    }

    private addImage(element: HTMLElement, src: string) {
        var tmpImg = document.createElement('img');
        tmpImg.className = 'i-image-item';
        tmpImg.src = src;
        element.appendChild(tmpImg);
    }

    private animationIn() {
        this.items.classList.add('open');
        this.animaIn.run(this.items);
    }

    private animationOut() {
        this.animaOut.run(this.items,() => {
            this.items.classList.remove('open');
        });
    }

    private changeValue(htmlElement: HTMLElement) {
        this.itemSate.exchange(htmlElement);
        this.input.value = this.itemSate.current.textContent;
        this.input.setAttribute('data-option', this.itemSate.current.getAttribute('data-option'));
        this.hidden.value = this.input.value;
        this.input.onchange();
        this.itemSate.old.classList.remove('bg-primary');
        this.itemSate.current.classList.add('bg-primary');
        if (this.isTypeIcon()) {
            this.changeIconItem();
        } else if (this.isTypeImage()) {
            this.changeImageItem();
        }
        this.input.focus();
    }

    private changeIconItem() {
        this.itemIconState.exchange(this.getIconItem());
        this.icoItem.classList.remove(this.itemIconState.old);
        this.icoItem.classList.add(this.itemIconState.current);
    }

    private changeImageItem() {
        this.itemImageState.exchange(this.getImageItem());
        this.imgItem.src = this.itemImageState.current;
    }

    private next() {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.nextElementSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    private previous() {
        if (!this.disabled && !this.readOnly && this.itemSate.current) {
            var item = this.itemSate.current.previousSibling;
            if (item) {
                this.changeValue(<HTMLElement>item);
            }
        }
    }

    private isTypeIcon() {
        return this.type === ETypeSelect.ICON;
    }

    private isTypeImage() {
        return this.type === ETypeSelect.IMAGE;
    }

    private isTypeSimple() {
        return this.type === ETypeSelect.SIMPLE;
    }

    public toggle() {
        if (!this.readOnly && !this.disabled) {
            this.open = this.items.classList.contains('open');
            if (this.open) {
                this.animationOut();
                this.open = false;
            } else {
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
    }

    public selectItem(option) {
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
                    this.hidden.value = this.input.value;
                    if (this.isTypeIcon()) {
                        this.changeIconItem();
                    } else if (this.isTypeImage()) {
                        this.changeImageItem();
                    }
                    this.itemSate.current.focus();
                    if (this.itemSate.old) this.itemSate.old.classList.remove('bg-primary');
                    this.itemSate.current.classList.add('bg-primary');
                }
            }
        }
    }

    public addItem(option, value, args) {
        if (!this.disabled && !this.readOnly) {
            var li = document.createElement('li');
            if (args) {
                if (args.icon && this.isTypeIcon()) {
                    this.addIcon(li, args.icon);
                } else if (args.image && this.isTypeImage()) {
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
            }

            this.items.appendChild(li);
            this.length++;
        }
    }

    public getItem() {
        if (!this.disabled && !this.readOnly) {
            if (this.isTypeIcon()) {
                var tmpIcon: any = this.itemSate.current.getElementsByClassName('fa')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    icon: tmpIcon.classList.item(2)
                };
            } else if (this.isTypeImage()) {
                var tmpImg: any = this.itemSate.current.getElementsByClassName('i-image-item')[0];
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option'),
                    image: tmpImg.src
                };
            } else {
                return {
                    value: this.input.value,
                    option: this.input.getAttribute('data-option')
                };
            }
        }
    }

    public getValue() {
        if (!this.disabled && !this.readOnly) {
            return this.input.value;
        }
    }

    public getOption() {
        if (!this.disabled && !this.readOnly) {
            return this.input.getAttribute('data-option');
        }
    }

    public isOpen() {
        if (!this.disabled && !this.readOnly) {
            return this.open;
        }
    }

    /**
    * get Icon Item Class
    * @returns {string} class Icon
    * @method getIconItem
    */
    public getIconItem() {
        if (!this.disabled && !this.readOnly) {
            var tmpIcon: any = this.itemSate.current.getElementsByClassName('fa')[0];
            return tmpIcon.classList.item(2);
        }
    }

    /**
    * get Image Item src
    * @returns {string} src
    * @method getImageItem
    */
    public getImageItem() {
        if (!this.disabled && !this.readOnly) {
            var tmpImg: any = this.itemSate.current.getElementsByClassName('i-image-item')[0];
            return tmpImg.src;
        }
    }
    /**
    * set Data
    * @param {[JSON]} data
    * @param {JSON} options
    * @method setDate
    */
    public setData(data, options) {
        if (!this.disabled && !this.readOnly) {
            /**
            * Clear
            */
            this.clearData();
            /**
            * Load
            */
            this.data = data;
            if (options) this.setOptions(options);
            this.config();
            this.fill();
        }
    }

    public isDisabled() {
        return this.disabled;
    }

    public setDisabled(disabled: boolean) {
        this.disabled = disabled;
        this.input.disabled = this.disabled;
        if (this.disabled) {
            this.element.classList.add('disabled');
        } else {
            this.element.classList.remove('disabled');
        }
    }

    public isReadOnly() {
        return this.readOnly;
    }

    public setReadOnly(readOnly: boolean) {
        this.readOnly = readOnly;
        this.input.readOnly = this.readOnly;
        if (this.readOnly) {
            this.element.classList.add('read-only');
        } else {
            this.element.classList.remove('read-only');
        }
    }

    public setHeight(height: string) {
        if (!this.disabled && !this.readOnly) {
            this.items.style.height = height;
        }
    }

    public getSize() {
        if (!this.disabled || !this.readOnly) {
            return this.length;
        }
    }

    public setIcono(icono: string) {
        if (!this.disabled && !this.readOnly) {
            this.ico.classList.remove(this.icono);
            this.icono = icono;
            this.ico.classList.add(this.icono);
        }
    }

    public focus() {
        if (!this.disabled && !this.readOnly) {
            this.input.focus();
        }
    }

    public loading() {
        if (this.ico.classList.contains(this.icono)) this.ico.classList.remove(this.icono);
        if (!this.ico.classList.contains('fa-spinner')) this.ico.classList.add('fa-spinner');
        if (!this.ico.classList.contains('fa-spin')) this.ico.classList.add('fa-spin');
        this.setDisabled(true);
    }

    public complete() {
        if (this.ico.classList.contains('fa-spinner')) this.ico.classList.remove('fa-spinner');
        if (this.ico.classList.contains('fa-spin')) this.ico.classList.remove('fa-spin');
        if (!this.ico.classList.contains(this.icono)) this.ico.classList.add(this.icono);
        this.setDisabled(false);
    }

    public clearData() {
        this.config(true);
        this.hidden.value = '';
        this.input.value = '';
        this.input.removeAttribute('data-option');
        this.items.innerHTML = '';
    }

    public onchange(callback) {
        this.input.onchange = callback;
    }

    public static clear() {
        var selects = document.getElementsByClassName('i-select');
        var n = selects.length;
        if (n > 0) {
            for (var i = 0; i < n; i++) {
                var select = <HTMLElement> selects[i];
                var items = select.getElementsByTagName('ul')[0];
                if (items) {
                    if (items.classList.contains('open')) {
                        items.classList.add('i-ease-out');
                        items.classList.add('i-0-2s');
                        items.classList.add('i-fade-out-up');
                        (function (items) {
                            setTimeout(() => {
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
    }
}

/**
@ Autor :@yonax73 | yonax73@gmail.com
@ Version: 0.1
@ Date : 25/02/2015
@ Date update: 25/02/2015
@ Update by: @yonax73  | yonax73@gmail.com
@ Description: validation form
**/
class Form extends BaseForm {

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
class Alert {

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
    public animationIn = 'i-fade-in';
    public animationOut = 'i-fade-out';
    public typeAnimation = 'i-ease-in-out';
    private type = 'close';
    private durationAnimation = 'i-1s';

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
class DataTable {

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
        this.table.className = 'i-data-table table table-striped';
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