import { Component, computed, inject, Signal } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';


@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ColumnsComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  boardService: BoardService = inject(BoardService)

  boards: Signal<Board[]> = this.boardService.boards

  board: Signal<Board | undefined> = computed(() => this.boards().find(board => board.name == this.boardService.selectedBoard))
}
