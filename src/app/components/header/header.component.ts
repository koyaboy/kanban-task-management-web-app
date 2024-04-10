import { ChangeDetectionStrategy, Component, inject, Signal, computed, ViewChild, ViewContainerRef, TemplateRef, signal } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { TemplatePortal } from '@angular/cdk/portal';
import { AddTaskComponent } from '../add/add-task/add-task.component';
import { AddBoardComponent } from '../add/add-board/add-board.component';
import { EditBoardComponent } from '../edit/edit-board/edit-board.component';
import { DeleteBoardComponent } from '../delete/delete-board/delete-board.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { AsyncPipe, NgFor, NgStyle, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddTaskComponent, AddBoardComponent, EditBoardComponent, DeleteBoardComponent, OverlayModule, NgFor, NgStyle, NgIf, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  @ViewChild("addTaskRef") addTaskRef!: TemplateRef<any>
  @ViewChild("addBoardRef") addBoardRef!: TemplateRef<any>
  @ViewChild("editBoardRef") editBoardRef!: TemplateRef<any>
  @ViewChild("deleteBoardRef") deleteBoardRef!: TemplateRef<any>

  boards$!: Observable<Board[]>
  selectedBoard$!: Observable<Board>

  boards!: Board[]
  selectedBoard!: Board

  shouldOpenBoards: boolean = false
  shouldOpenEditandDeleteBoardsDropdown: boolean = false

  ngOnInit() {
    this.boards$ = this.boardService.boards$
    this.selectedBoard$ = this.boardService.selectedBoard$

    this.boardService.boards$.subscribe((boards) => {
      this.boards = boards
    })

    this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoard = selectedBoard
    })
  }
  changeBoard(index: number) {
    this.boardService.boards$.subscribe((boards) => {
      this.boardService.updateSelectedBoard(boards[index])
    })

    this.shouldOpenBoards = false
  }

  openAddTaskModal() {
    const addTaskPortal = new TemplatePortal(this.addTaskRef, this.viewContainerRef)
    this.boardService.openModal(addTaskPortal)

  }

  openAddBoardModal(): void {
    this.shouldOpenBoards = false

    const addBoardPortal = new TemplatePortal(this.addBoardRef, this.viewContainerRef)
    this.boardService.openModal(addBoardPortal)
  }

  openEditBoardModal(): void {
    this.shouldOpenEditandDeleteBoardsDropdown = false

    const editBoardPortal = new TemplatePortal(this.editBoardRef, this.viewContainerRef)
    this.boardService.openModal(editBoardPortal)
  }

  openDeleteBoardModal(): void {
    this.shouldOpenEditandDeleteBoardsDropdown = false

    const deleteBoardPortal = new TemplatePortal(this.deleteBoardRef, this.viewContainerRef)
    this.boardService.openModal(deleteBoardPortal)
  }

  handleBoardsUpdate(newBoards: Board[]) {
    this.boards$ = this.boardService.boards$
    this.boards = newBoards
    let newSelectedBoard = this.boards[this.boards.length - 1]
    this.boardService.updateSelectedBoard(newSelectedBoard)
    this.boardService.closeModal()
  }
}
