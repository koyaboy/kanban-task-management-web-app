import { Component, Input, inject } from '@angular/core';
import { Subtask } from '../../../model/subtask';
import { NgFor, NgIf } from '@angular/common';
import { Board } from '../../../model/board';
import { BoardService } from '../../../services/board.service';
import {
  FormBuilder,
  Validators,
  FormGroup,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Column } from '../../../model/column';
import { Task } from '../../../model/task';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent {
  boardService: BoardService = inject(BoardService);
  fb: FormBuilder = inject(FormBuilder);

  // @Input() board!: Board | undefined
  @Input() taskId!: string;
  @Input() taskTitle!: string;
  @Input() taskDescription!: string | undefined;
  @Input() taskSubtasks!: Array<Subtask> | undefined;
  @Input() taskStatus!: string;

  editTaskForm!: FormGroup;
  subscription!: Subscription;
  selectedBoard!: Board;

  ngOnInit() {
    this.subscription = this.boardService.selectedBoard$.subscribe(
      (selectedBoard) => {
        this.selectedBoard = selectedBoard;
      }
    );

    this.editTaskForm = this.fb.group({
      title: [this.taskTitle, Validators.required],
      description: this.taskDescription,
      subtasks: this.fb.array(
        (this.taskSubtasks ?? []).map((subtask) =>
          this.fb.group({
            title: [subtask.title, Validators.required],
            isCompleted: subtask.isCompleted,
          })
        )
      ),
      status: [this.taskStatus, Validators.required],
    });
  }

  get subtasks() {
    return this.editTaskForm.get('subtasks') as FormArray;
  }

  addSubtask(): void {
    this.subtasks.push(
      this.fb.group({ title: ['', Validators.required], isCompleted: false })
    );
  }

  removeSubtask(index: number): void {
    this.subtasks.removeAt(index);
  }

  onSubmit(): void {
    const { title, description, subtasks, status } = this.editTaskForm.value;

    const boardId = this.selectedBoard._id as string;

    const data = {
      title: title,
      description: description,
      subtasks: subtasks,
      status: status,
    };

    this.boardService.editTask(
      data,
      this.taskId,
      boardId,
      this.taskStatus,
      data
    );

    this.boardService.closeModal();
  }
}
