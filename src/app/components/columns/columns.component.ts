import { AsyncPipe, NgFor, NgStyle } from '@angular/common';
import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ViewTaskComponent } from '../view-task/view-task.component';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subtask } from '../../model/subtask';
import { BoardService } from '../../services/board.service';
import { ViewContainerRef } from '@angular/core';
import { Task } from '../../model/task';
import { Observable } from 'rxjs';
import { Board } from '../../model/board';
import { EditBoardComponent } from '../edit/edit-board/edit-board.component';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Column } from '../../model/column';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [
    NgFor,
    NgStyle,
    ViewTaskComponent,
    AsyncPipe,
    EditBoardComponent,
    CdkDrag,
    CdkDropListGroup,
    CdkDropList,
  ],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css',
})
export class ColumnsComponent {
  boardService: BoardService = inject(BoardService);
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef);

  @ViewChild('viewTaskRef') viewTaskRef!: TemplateRef<any>;
  @ViewChild('editBoardRef') editBoardRef!: TemplateRef<any>;

  selectedBoard$!: Observable<Board>;
  selectedBoard!: Board;

  taskId!: string;
  taskTitle!: string;
  taskDescription!: string | undefined;
  taskSubtasks!: Array<Subtask> | undefined;
  taskStatus!: string;
  completedSubtasks!: number;

  ngOnInit() {
    this.selectedBoard$ = this.boardService.selectedBoard$;

    this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoard = selectedBoard;
    });
  }

  getRandomColor(index: number) {
    let colors = ['#49C4E5', '#8471F2', '#67E2AE'];
    return colors[index % colors.length];
  }

  getCompletedSubtasks(task: Task) {
    return task.subtasks?.filter((subtask) => subtask.isCompleted).length;
  }

  drop(event: CdkDragDrop<Task[]>, columnName: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const data = {
        previousIndex: event.previousIndex,
        currentIndex: event.currentIndex,
        previousColumnName: '',
        currentColumnName: '',
        columnName: columnName,
        selectedBoardId: this.selectedBoard._id,
      };
      this.boardService.updateTaskOrder(data).subscribe();
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const previousContainerId = event.previousContainer.id;
      const matchPrev = previousContainerId.match(/\d+$/);
      const previousColumnIndex = matchPrev ? matchPrev[0] : null;

      const currentContainerId = event.container.id;
      const matchCurr = currentContainerId.match(/\d+$/);
      const currentColumnIndex = matchCurr ? matchCurr[0] : null;

      if (
        previousColumnIndex &&
        currentColumnIndex &&
        this.selectedBoard.columns
      ) {
        const prevColumn =
          this.selectedBoard.columns[Number(previousColumnIndex)];
        const prevColumnName = prevColumn.name;

        const currentColumn =
          this.selectedBoard.columns[Number(currentColumnIndex)];
        const currentColumnName = currentColumn.name;

        const data = {
          previousIndex: event.previousIndex,
          currentIndex: event.currentIndex,
          previousColumnName: prevColumnName,
          currentColumnName: currentColumnName,
          columnName: '',
          selectedBoardId: this.selectedBoard._id,
        };

        this.boardService.updateTaskOrder(data).subscribe();
      }
    }
  }

  viewTask(
    id: string,
    title: string,
    description: string | undefined,
    subtasks: Array<Subtask> | undefined,
    status: string
  ): void {
    this.taskId = id;
    this.taskTitle = title;
    this.taskDescription = description;
    this.taskSubtasks = subtasks;
    this.taskStatus = status;

    const viewTaskPortal = new TemplatePortal(
      this.viewTaskRef,
      this.viewContainerRef
    );
    this.boardService.openModal(viewTaskPortal);
  }

  openEditBoardModal() {
    const editBoardPortal = new TemplatePortal(
      this.editBoardRef,
      this.viewContainerRef
    );
    this.boardService.openModal(editBoardPortal);
  }
}
