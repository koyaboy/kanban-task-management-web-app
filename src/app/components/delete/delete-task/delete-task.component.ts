import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTaskComponent {
  @Input() title!: string
}
