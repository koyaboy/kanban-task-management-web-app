import { Component, inject, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { NgIf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EditBoardComponent } from '../edit/edit-board/edit-board.component';
import { TemplatePortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ColumnsComponent, NgIf, AsyncPipe, EditBoardComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @ViewChild("editBoardRef") editBoardRef!: TemplateRef<any>

  selectedBoard$!: Observable<Board>
  subscription!: Subscription

  ngOnInit() {
    this.selectedBoard$ = this.boardService.selectedBoard$
  }

  openEditBoardModal() {
    const editBoardPortal = new TemplatePortal(this.editBoardRef, this.viewContainerRef)
    this.boardService.openModal(editBoardPortal)
  }
}
