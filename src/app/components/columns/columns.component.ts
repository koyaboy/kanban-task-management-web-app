import { NgFor, NgStyle } from '@angular/common';
import { Component, Input, ViewChild, inject, viewChild } from '@angular/core';
import { Column } from '../../model/column';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { Overlay, OverlayConfig } from "@angular/cdk/overlay"
import { CdkPortal, PortalModule } from '@angular/cdk/portal';
import { Subtask } from '../../model/subtask';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [NgFor, NgStyle, ViewTaskComponent, PortalModule],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css'
})
export class ColumnsComponent {
  @Input() columns: Column[] | undefined = []

  overlay: Overlay = inject(Overlay)

  @ViewChild(CdkPortal) portal!: CdkPortal

  taskTitle!: string
  taskDescription!: string
  taskSubtasks!: Array<Subtask>
  taskStatus!: string

  getRandomColor(index: number) {
    let colors = ["#49C4E5", "#8471F2", "#67E2AE"];
    return colors[index % colors.length]
  }

  viewTask(title: string, description: string, subtasks: Array<Subtask>, status: string): void {
    this.taskTitle = title
    this.taskDescription = description
    this.taskSubtasks = subtasks
    this.taskStatus = status

    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().centerVertically().centerHorizontally(),
      width: '80%',
      hasBackdrop: true
    })

    const overlayRef = this.overlay.create(config)
    overlayRef.attach(this.portal)
    overlayRef.backdropClick().subscribe(() => overlayRef.detach())
  }
}
