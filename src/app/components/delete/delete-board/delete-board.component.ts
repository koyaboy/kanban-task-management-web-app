import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { Board } from '../../../model/board';
import { BoardService } from '../../../services/board.service';
import { Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [AsyncPipe, LoaderComponent, NgIf],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBoardComponent {
  boardService: BoardService = inject(BoardService);

  @Output() updatedBoards: EventEmitter<Board[]> = new EventEmitter();

  boards!: Board[];
  selectedBoard!: Board;
  selectedBoardId!: string;
  sub!: Subscription;
  sub2!: Subscription;

  isSubmitting$ = this.boardService.isSubmitting$;

  ngOnInit() {
    this.sub = this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoard = selectedBoard;
      this.selectedBoardId = selectedBoard._id;
    });

    this.sub2 = this.boardService.boards$.subscribe((boards) => {
      this.boards = boards;
    });
  }

  deleteBoard() {
    this.boardService.deleteBoard(this.selectedBoardId);
  }

  updateBoards() {
    // this.boardService.getBoards().subscribe((data) => {
    //   this.updatedBoards.emit(data)
    // })
  }

  closeDeleteBoardModal() {
    this.boardService.closeModal();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
