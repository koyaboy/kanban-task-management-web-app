import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Board } from '../../../model/board';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  fb: FormBuilder = inject(FormBuilder)

  @Input() board!: Board | undefined

  addTaskForm!: FormGroup

  ngOnInit() {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      subtasks: this.fb.array(
        [this.fb.control('', Validators.required), this.fb.control('', Validators.required)]),
      status: [this.board?.columns[0].name, Validators.required]
    })
  }

  get subtasks() {
    return this.addTaskForm.get("subtasks") as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(this.fb.control('', Validators.required))
  }


  onSubmit(): void {
    console.log(this.addTaskForm)
  }
}
