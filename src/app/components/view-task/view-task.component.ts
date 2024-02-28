import { Component, Input } from '@angular/core';
import { Subtask } from '../../model/subtask';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [NgFor, NgStyle],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css'
})
export class ViewTaskComponent {
  @Input() title!: string
  @Input() description!: string
  @Input() subtasks!: Array<Subtask>
  @Input() status!: string

  completedSubtasks!: number

  ngOnInit() {
    this.completedSubtasks = this.subtasks.filter((task) => task.isCompleted).length
  }
}
