import { Component, Input } from '@angular/core';
import { Subtask } from '../../../model/subtask';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [NgFor],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  @Input() title!: string
  @Input() description!: string
  @Input() subtasks!: Array<Subtask>
  @Input() status!: string
}
