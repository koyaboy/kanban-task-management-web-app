import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import { BoardService } from '../../../services/board.service';
import { Column } from '../../../model/column';
import { Board } from '../../../model/board';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteTaskComponent {
  boardService: BoardService = inject(BoardService);

  @Input() taskId!: string;
  @Input() title!: string;
  @Input() taskStatus!: string;

  selectedBoard!: Board;

  ngOnInit() {
    this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoard = selectedBoard;
    });
  }

  deleteTask() {
    this.boardService.deleteTask(
      this.taskId,
      this.selectedBoard._id,
      this.taskStatus
    );

    this.boardService.closeModal();
  }

  closeDeleteTaskModal() {
    this.boardService.closeModal();
  }
}
