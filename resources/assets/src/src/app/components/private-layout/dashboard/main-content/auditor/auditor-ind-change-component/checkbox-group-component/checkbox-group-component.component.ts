// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-checkbox-group-component',
//   templateUrl: './checkbox-group-component.component.html',
//   styleUrls: ['./checkbox-group-component.component.scss']
// })
// export class CheckboxGroupComponentComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

// }

import { Component, OnInit, forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-checkbox-group-component',
    template: `<ng-content></ng-content>`,
    providers: [
        {
          provide: NG_VALUE_ACCESSOR,
          useExisting: forwardRef(() => CheckboxGroupComponentComponent),
          multi: true
        }
    ]
})
export class CheckboxGroupComponentComponent implements ControlValueAccessor, OnInit {
    private _model: any;
    private onChange: (m: any) => void;
    private onTouched: (m: any) => void;

    ngOnInit() {
    }

    get model() {
        return this._model;
    }

    writeValue(value: any): void {
        this._model = value;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }
    set(value: any) {
        this._model = value;
        this.onChange(this._model);
    }

    addOrRemove(value: any) {
        if (this.contains(value)) {
            this.remove(value);
        } else {
            this.add(value);
        }
    }

    contains(value: any): boolean {
        if (this._model instanceof Array) {
            return this._model.indexOf(value) > -1;
        } else if (!!this._model) {
            return this._model === value;
        }

        return false;
    }

    private add(value: any) {
        if (!this.contains(value)) {
            if (this._model instanceof Array) {
                this._model.push(value);
            } else {
                this._model = [value];
            }
            this.onChange(this._model);
        }
    }

    private remove(value: any) {
        const index = this._model.indexOf(value);
        if (!this._model || index < 0) {
            return;
        }

        this._model.splice(index, 1);
        this.onChange(this._model);
    }
}
