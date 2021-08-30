import { FormGroup } from "@angular/forms";

export class FormValidator {
    static validateForm(form: FormGroup): boolean {
        this.checkInvalids(form);
        return form.valid;
    }

    static checkInvalids(formulario: FormGroup): void {
        Object.keys(formulario.controls).forEach(key => {
            if (formulario.get(key).invalid) {
                formulario.get(key).markAsDirty();
            }
        });
    }

    static msgInvalidKeys(fields: any, keys: string[]): string {
        let msg = '';
        keys.forEach(k => msg = msg.concat(`${fields[k].toLowerCase()}${keys.indexOf(k) === keys.length - 1 ? '' : ', '}`));
        return msg;
    }

    static getInvalids(form: FormGroup): string[] {
        const invalidKeys = [];
        Object.keys(form.controls).forEach(key => {
            if (form.get(key).invalid) {
                invalidKeys.push(key);
            }
        });
        return invalidKeys;
    }

}
