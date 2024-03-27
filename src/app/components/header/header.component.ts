import { ChangeDetectionStrategy, Component, inject, Signal, computed, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { TemplatePortal } from '@angular/cdk/portal';
import { AddTaskComponent } from '../add/add-task/add-task.component';
import { AddBoardComponent } from '../add/add-board/add-board.component';
import { EditBoardComponent } from '../edit/edit-board/edit-board.component';
import { DeleteBoardComponent } from '../delete/delete-board/delete-board.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgFor, NgStyle } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddTaskComponent, AddBoardComponent, EditBoardComponent, DeleteBoardComponent, OverlayModule, NgFor, NgStyle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  boards: Signal<Board[]> = this.boardService.boards
  board: Signal<Board | undefined> = computed(() => this.boards().find(board => board.name == this.boardService.selectedBoard?.name))

  shouldOpenBoards: boolean = false
  shouldOpenEditandDeleteBoardsDropdown: boolean = false

  @ViewChild("addTaskRef") addTaskRef!: TemplateRef<any>
  @ViewChild("addBoardRef") addBoardRef!: TemplateRef<any>
  @ViewChild("editBoardRef") editBoardRef!: TemplateRef<any>
  @ViewChild("deleteBoardRef") deleteBoardRef!: TemplateRef<any>

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
}
