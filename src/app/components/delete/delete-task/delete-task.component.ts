import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { BoardService } from '../../../services/board.service';
import { Column } from '../../../model/column';
import { Board } from '../../../model/board';

@Component({
  selector: 'app-delete-task',
  standalone: true,
  imports: [],
  templateUrl: './delete-task.component.html',
  styleUrl: './delete-task.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeleteTaskComponent {
  boardService: BoardService = inject(BoardService)

  @Input() taskId!: string
  @Input() title!: string
  @Input() taskStatus!: string

  selectedBoard = this.boardService.selectedBoard as Board

  ngOnInit() {
    console.log(this.taskStatus)
  }

  deleteTask() {
    this.boardService.deleteTask(this.taskId, this.selectedBoard._id, this.taskStatus).subscribe()

    //Optimistically update UI
    let column = this.boardService.selectedBoard?.columns.find(column => column.name == this.taskStatus) as Column
    let taskIndex = column.tasks.findIndex(task => task._id == this.taskId)
    column.tasks.splice(taskIndex, 1)

    this.boardService.closeModal()
  }

  closeDeleteTaskModal() {
    this.boardService.closeModal()
  }
}
