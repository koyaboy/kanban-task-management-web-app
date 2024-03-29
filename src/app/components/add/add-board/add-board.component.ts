import { NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.css'
})
export class AddBoardComponent {
  fb: FormBuilder = inject(FormBuilder)

  addBoardForm = this.fb.group({
    boardName: ['', Validators.required],
    boardColumns: this.fb.array([
      this.fb.group({ name: ['Todo', Validators.required] }),
      this.fb.group({ name: ['Doing', Validators.required] })
    ])
  })

  get boardColumns() {
    return this.addBoardForm.get('boardColumns') as FormArray;
  }

  addBoardColumn(): void {
    this.boardColumns.push(this.fb.group({ name: ['', Validators.required] }))
  }

  removeBoardColumn(index: number): void {
    this.boardColumns.removeAt(index)
  }

  onSubmit(): void {
    console.log(this.addBoardForm.value)
  }
}
