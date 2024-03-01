import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Subtask } from '../../model/subtask';
import { NgFor, NgStyle } from '@angular/common';
import { ViewContainerRef } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [NgFor, NgStyle, OverlayModule],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTaskComponent {
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @Input() title!: string
  @Input() description!: string
  @Input() subtasks!: Array<Subtask>
  @Input() status!: string

  completedSubtasks!: number
  openEditandDeleteOptions = false

  ngOnInit() {
    this.completedSubtasks = this.subtasks.filter((task) => task.isCompleted).length
  }
}
