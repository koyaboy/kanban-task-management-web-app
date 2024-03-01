import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild, inject } from '@angular/core';
import { Subtask } from '../../model/subtask';
import { NgFor, NgStyle } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { EditTaskComponent } from '../edit/edit-task/edit-task.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { BoardService } from '../../services/board.service';
import { DeleteTaskComponent } from '../delete/delete-task/delete-task.component';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [NgFor, NgStyle, OverlayModule, EditTaskComponent, DeleteTaskComponent],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTaskComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @Input() title!: string
  @Input() description!: string
  @Input() subtasks!: Array<Subtask>
  @Input() status!: string

  completedSubtasks!: number
  openEditandDeleteOptions = false

  @ViewChild("editTaskRef") editTaskRef !: TemplateRef<any>
  @ViewChild("deleteTaskRef") deleteTaskRef !: TemplateRef<any>

  ngOnInit() {
    this.completedSubtasks = this.subtasks.filter((task) => task.isCompleted).length
  }

  openEditTaskModal() {
    this.boardService.closeModal()

    const editTaskPortal = new TemplatePortal(this.editTaskRef, this.viewContainerRef)
    this.boardService.openModal(editTaskPortal)
  }

  openDeleteTaskModal() {
    this.boardService.closeModal()

    const deleteTaskPortal = new TemplatePortal(this.deleteTaskRef, this.viewContainerRef)
    this.boardService.openModal(deleteTaskPortal)
  }
}
