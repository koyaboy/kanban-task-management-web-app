import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTaskComponent {
  boardService: BoardService = inject(BoardService)

  @Input() title!: string

  closeDeleteTaskModal() {
    this.boardService.closeModal()
  }
}
