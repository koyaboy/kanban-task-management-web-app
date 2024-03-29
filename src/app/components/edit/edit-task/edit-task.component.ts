import { Component, Input, inject } from '@angular/core';
import { Subtask } from '../../../model/subtask';
import { NgFor, NgIf } from '@angular/common';
import { Board } from '../../../model/board';
import { BoardService } from '../../../services/board.service';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Column } from '../../../model/column';
import { Task } from '../../../model/task';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  boardService: BoardService = inject(BoardService)
  fb: FormBuilder = inject(FormBuilder)

  // @Input() board!: Board | undefined
  @Input() taskId!: string
  @Input() taskTitle!: string
  @Input() taskDescription!: string
  @Input() taskSubtasks!: Array<Subtask>
  @Input() taskStatus!: string

  editTaskForm!: FormGroup
  board = this.boardService.selectedBoard

  ngOnInit() {
    this.editTaskForm = this.fb.group({
      title: [this.taskTitle, Validators.required],
      description: this.taskDescription,
      subtasks: this.fb.array(this.taskSubtasks.map(subtask =>
        this.fb.group({
          title: [subtask.title, Validators.required],
          isCompleted: subtask.isCompleted
        })
      )),
      status: [this.taskStatus, Validators.required]
    })

  }

  get subtasks() {
    return this.editTaskForm.get("subtasks") as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(this.fb.group({ title: ['', Validators.required], isCompleted: false }))
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index)
  }


  onSubmit(): void {
    const { title, description, subtasks, status } = this.editTaskForm.value

    const boardId = this.board()?._id as string

    const data = {
      title: title,
      description: description,
      subtasks: subtasks,
      status: status
    }

    this.boardService.editTask(data, this.taskId, boardId, this.taskStatus).subscribe()

    //OPTIMISTICALLY UPDATE UI
    let selectedColumn = this.board()?.columns.find((column) => column.name == this.taskStatus) as Column
    let task = selectedColumn.tasks.find(task => task._id == this.taskId) as Task
    let taskIndex = selectedColumn.tasks.findIndex(task => task._id == this.taskId)

    task.title = title
    task.description = description
    task.subtasks = subtasks
    task.status = status

    //Move task to new column if status changes and remove it from the old one
    if (status !== this.taskStatus) {
      let newColumn = this.board()?.columns.find((column) => column.name == status) as Column
      newColumn.tasks.unshift(task)
      selectedColumn.tasks.splice(taskIndex, 1)
    }

    this.boardService.closeModal()
  }
}
