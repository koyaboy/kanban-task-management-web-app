import { NgFor, NgStyle } from '@angular/common';
import { Component, Input, TemplateRef, ViewChild, inject, viewChild } from '@angular/core';
import { Column } from '../../model/column';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subtask } from '../../model/subtask';
import { BoardService } from '../../services/board.service';
import { ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [NgFor, NgStyle, ViewTaskComponent],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css'
})
export class ColumnsComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @Input() columns: Column[] | undefined = []

  taskTitle!: string
  taskDescription!: string
  taskSubtasks!: Array<Subtask>
  taskStatus!: string

  @ViewChild("viewTaskRef") viewTaskRef!: TemplateRef<any>

  getRandomColor(index: number) {
    let colors = ["#49C4E5", "#8471F2", "#67E2AE"];
    return colors[index % colors.length]
  }

  viewTask(title: string, description: string, subtasks: Array<Subtask>, status: string): void {
    this.taskTitle = title
    this.taskDescription = description
    this.taskSubtasks = subtasks
    this.taskStatus = status

    const viewTaskPortal = new TemplatePortal(this.viewTaskRef, this.viewContainerRef)
    this.boardService.openModal(viewTaskPortal)
  }
}
