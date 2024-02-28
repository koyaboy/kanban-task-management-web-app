import { ChangeDetectionStrategy, Component, inject, Signal, computed, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { TemplatePortal } from '@angular/cdk/portal';
import { AddBoardComponent } from '../add/add-board/add-board.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddBoardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  boards: Signal<Board[]> = this.boardService.boards
  board: Signal<Board | undefined> = computed(() => this.boards().find(board => board.name == this.boardService.selectedBoard))

  @ViewChild("addBoardRef") addBoardRef!: TemplateRef<any>

  openAddBoardModal() {
    const addBoardPortal = new TemplatePortal(this.addBoardRef, this.viewContainerRef)
    this.boardService.openModal(addBoardPortal)

  }
}
