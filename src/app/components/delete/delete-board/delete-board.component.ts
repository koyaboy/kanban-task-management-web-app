import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Board } from '../../../model/board';
import { BoardService } from '../../../services/board.service';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteBoardComponent {
  boardService: BoardService = inject(BoardService)

  @Input() board!: Board | undefined

  closeDeleteBoardModal() {
    this.boardService.closeModal()
  }
}
