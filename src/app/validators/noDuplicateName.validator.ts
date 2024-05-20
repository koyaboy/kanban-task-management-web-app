import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { FormArray } from '@angular/forms';

// Custom validator function to check for duplicate names in the FormArray
export function noDuplicateColumnNames(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control && control instanceof FormArray) {
      const columnNames = control.controls.map(
        (group) => group.get('name')?.value
      );
      const hasDuplicates = columnNames.some(
        (name, index) => columnNames.indexOf(name) !== index
      );
      return hasDuplicates ? { duplicateNames: true } : null;
    }
    return null;
  };
}
