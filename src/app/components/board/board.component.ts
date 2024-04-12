import { Component, computed, inject, Signal } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { NgIf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ColumnsComponent, NgIf, AsyncPipe],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  boardService: BoardService = inject(BoardService)

  selectedBoard$!: Observable<Board>
  subscription!: Subscription

  ngOnInit() {
    // this.subscription = this.boardService.boards$.subscribe((boards) => {
    //   this.boardService.updateSelectedBoard(boards[0])
    // })

    this.selectedBoard$ = this.boardService.selectedBoard$
  }

  ngOnDestroy() {
    // this.subscription.unsubscribe()
  }
}
