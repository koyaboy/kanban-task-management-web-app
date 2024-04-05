import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { Subtask } from '../../model/subtask';
import { AsyncPipe, NgFor, NgIf, NgStyle } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { EditTaskComponent } from '../edit/edit-task/edit-task.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { BoardService } from '../../services/board.service';
import { DeleteTaskComponent } from '../delete/delete-task/delete-task.component';
import { Board } from '../../model/board';
import { Observable } from 'rxjs';
AsyncPipe

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [NgFor, NgIf, NgStyle, OverlayModule, EditTaskComponent, DeleteTaskComponent, AsyncPipe],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTaskComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @Input() id!: string
  @Input() title!: string
  @Input() description!: string | undefined
  @Input() subtasks!: Array<Subtask> | undefined
  @Input() status!: string

  selectedBoard$: Observable<Board> = this.boardService.selectedBoard$

  shouldOpenEditTaskModal: boolean = false
  shouldOpenDeleteTaskModal: boolean = false
  completedSubtasks!: number | undefined
  openEditandDeleteOptions = false

  ngOnInit() {
    this.completedSubtasks = this.subtasks?.filter((task) => task.isCompleted).length
  }

  openEditTaskModal() {
    this.openEditandDeleteOptions = false
    this.shouldOpenEditTaskModal = true
  }

  openDeleteTaskModal() {
    this.openEditandDeleteOptions = false
    this.shouldOpenDeleteTaskModal = true
  }
}
