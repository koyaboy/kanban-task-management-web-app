import { ChangeDetectionStrategy, Component, inject, Signal, computed, ViewChild, ViewContainerRef, TemplateRef } from '@angular/core';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { TemplatePortal } from '@angular/cdk/portal';
import { AddTaskComponent } from '../add/add-task/add-task.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AddTaskComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  boardService: BoardService = inject(BoardService)
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef)

  boards: Signal<Board[]> = this.boardService.boards
  board: Signal<Board | undefined> = computed(() => this.boards().find(board => board.name == this.boardService.selectedBoard))

  @ViewChild("addTaskRef") addTaskRef!: TemplateRef<any>

  openAddBoardModal() {
    const addTaskPortal = new TemplatePortal(this.addTaskRef, this.viewContainerRef)
    this.boardService.openModal(addTaskPortal)

  }
}
