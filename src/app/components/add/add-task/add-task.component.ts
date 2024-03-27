import { NgFor, NgIf } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Board } from '../../../model/board';
import { BoardService } from '../../../services/board.service';
import { Subtask } from '../../../model/subtask';
import { Task } from "../../../model/task";
import { Column } from '../../../model/column';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent {
  boardService: BoardService = inject(BoardService)
  fb: FormBuilder = inject(FormBuilder)

  @Input() board!: Board | undefined

  addTaskForm!: FormGroup

  ngOnInit() {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: '',
      subtasks: this.fb.array([
        this.fb.group({
          title: ['', Validators.required],
          isCompleted: false
        }),
        this.fb.group({
          title: ['', Validators.required],
          isCompleted: false
        })
      ]),
      status: [this.board?.columns[0].name, Validators.required]
    })
  }

  get subtasks() {
    return this.addTaskForm.get("subtasks") as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(this.fb.group({ title: ['', Validators.required], isCompleted: false }))
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index)
  }


  onSubmit(): void {
    const { title, description, subtasks, status } = this.addTaskForm.value

    const tempId = Math.random().toString(36).substring(2, 15);

    const data = {
      title: title,
      description: description,
      subtasks: subtasks,
      status: status
    }

    //OPTIMISTICALLY UPDATE UI
    let selectedColumn = this.board?.columns.find((column) => column.name == status) as Column
    selectedColumn.tasks.push({ _id: tempId, ...data })
    this.boardService.closeModal()

    //Make server reuest to add task
    this.boardService.addTask(data).subscribe((res: Task) => {
      let actualId = res._id

      let taskIndex = selectedColumn?.tasks.findIndex((task) => task._id == tempId)

      if (taskIndex) {
        selectedColumn.tasks[taskIndex]._id = actualId
      }
    })

  }
}
