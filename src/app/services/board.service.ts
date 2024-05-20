import {
  Injectable,
  inject,
  signal,
  Signal,
  EnvironmentInjector,
  HostListener,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { toSignal } from '@angular/core/rxjs-interop';
import { shareReplay, finalize } from 'rxjs/operators';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Task } from '../model/task';
import { BehaviorSubject, Subject } from 'rxjs';
import { Column } from '../model/column';
import { updateTaskOrderDTO } from '../model/updateTaskOrderDTO';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  private apiUrl = 'http://localhost:8000/api/boards';

  http: HttpClient = inject(HttpClient);
  overlay: Overlay = inject(Overlay);
  injector = inject(EnvironmentInjector);

  private boards = new BehaviorSubject<Board[]>([]);
  boards$ = this.boards.asObservable();

  private selectedBoard = new BehaviorSubject<Board>({
    _id: '',
    name: '',
    columns: [],
  });
  selectedBoard$ = this.selectedBoard.asObservable();

  private isSideBarOpen = new BehaviorSubject<boolean>(true);
  isSideBarOpen$ = this.isSideBarOpen.asObservable();

  private isSubmitting = new BehaviorSubject<boolean>(false);
  isSubmitting$ = this.isSubmitting.asObservable();

  config = new OverlayConfig({
    positionStrategy: this.overlay
      .position()
      .global()
      .centerVertically()
      .centerHorizontally(),
    hasBackdrop: true,
  });

  overlayRef = this.overlay.create(this.config);

  openModal(portal: TemplatePortal<any>): void {
    this.overlayRef.attach(portal);
    this.overlayRef.backdropClick().subscribe(() => this.closeModal());
  }

  closeModal(): void {
    this.overlayRef.detach();
  }

  addTask(data: any, tempId: string, status: string) {
    let selectedBoard = this.selectedBoard.value;
    let selectedColumn = selectedBoard.columns?.find(
      (column) => column.name == status
    ) as Column;
    selectedColumn.tasks?.push({ _id: tempId, ...data });

    return this.http
      .post<Task>(`${this.apiUrl}/addTask`, {
        boardId: this.selectedBoard.value._id,
        ...data,
      })
      .subscribe((newTask) => {
        let selectedBoard = this.selectedBoard.value;
        let selectedColumn = selectedBoard.columns?.find(
          (column) => column.name == data.status
        ) as Column;

        let taskIndex = selectedColumn.tasks?.findIndex(
          (task) => task._id == tempId
        ) as number;
        if (selectedColumn.tasks) {
          selectedColumn.tasks[taskIndex]._id = newTask._id;
        }
        this.selectedBoard.next(selectedBoard);
      });
  }

  getBoards() {
    this.http
      .get<Board[]>(`${this.apiUrl}/getBoards`)
      .pipe(shareReplay(1))
      .subscribe((boards) => {
        this.boards.next(boards);
        this.selectedBoard.next(boards[0]);
      });
  }

  updateSelectedBoard(newBoard: Board) {
    this.selectedBoard.next(newBoard);
  }

  addBoard(data: object) {
    this.isSubmitting.next(true);
    this.http
      .post<Board>(`${this.apiUrl}/createBoard`, { ...data })
      .pipe(
        finalize(() => {
          this.isSubmitting.next(false);
        })
      )
      .subscribe((newBoard) => {
        const currentBoard = this.boards.value;
        const updatedBoards = [...currentBoard, newBoard];
        this.boards.next(updatedBoards);
        this.updateSelectedBoard(newBoard);
        this.closeModal();
      });
  }

  editBoard(data: object, selectedBoardId: string) {
    this.isSubmitting.next(true);
    this.http
      .put<Board>(`${this.apiUrl}/editBoard/${selectedBoardId}`, { ...data })
      .pipe(
        finalize(() => {
          this.isSubmitting.next(false);
        })
      )
      .subscribe((editedBoard) => {
        let currentBoards = this.boards.value;
        const index = currentBoards.findIndex(
          (board) => board._id === editedBoard._id
        );

        if (index !== -1) {
          currentBoards[index] = editedBoard;
        }

        this.boards.next(currentBoards);
        this.closeModal();
      });
  }

  deleteBoard(selectedBoardId: string) {
    this.isSubmitting.next(true);
    this.http
      .delete<Board>(`${this.apiUrl}/deleteBoard/${selectedBoardId}`)
      .pipe(
        finalize(() => {
          this.isSubmitting.next(false);
        })
      )
      .subscribe((deletedBoard) => {
        let currentBoards = this.boards.value;

        const boardToDeleteIndex = currentBoards.findIndex(
          (board) => board._id == deletedBoard._id
        );

        if (boardToDeleteIndex !== -1) {
          currentBoards.splice(boardToDeleteIndex, 1);
        }

        this.boards.next(currentBoards);

        if (boardToDeleteIndex > 0) {
          this.updateSelectedBoard(currentBoards[boardToDeleteIndex - 1]);
        } else {
          this.updateSelectedBoard(currentBoards[0]);
        }
        this.closeModal();
      });
  }

  editTask(
    data: object,
    taskId: string,
    boardId: string,
    columnName: string,
    newTaskData: any
  ) {
    let selectedBoard = this.selectedBoard.value;
    let selectedColumn = selectedBoard.columns?.find(
      (column) => column.name == columnName
    ) as Column;
    let task = selectedColumn.tasks?.find((task) => task._id == taskId) as Task;
    let taskIndex = selectedColumn.tasks?.findIndex(
      (task) => task._id == taskId
    ) as number;

    task.title = newTaskData.title;
    task.description = newTaskData.description;
    task.subtasks = newTaskData.subtasks;
    task.status = newTaskData.status;

    if (columnName !== newTaskData.status) {
      let newColumn = selectedBoard.columns?.find(
        (column) => column.name == newTaskData.status
      ) as Column;
      newColumn.tasks?.unshift(task);
      if (taskIndex >= 0) {
        selectedColumn.tasks?.splice(taskIndex, 1);
      }
    }

    this.selectedBoard.next(selectedBoard);

    return this.http
      .put(`${this.apiUrl}/editTask/${taskId}`, {
        data,
        selectedBoardId: boardId,
        columnName: columnName,
      })
      .subscribe();
  }

  deleteTask(taskId: string, boardId: string, status: string) {
    let selectedBoard = this.selectedBoard.value;
    let selectedColumn = selectedBoard.columns?.find(
      (column) => column.name == status
    ) as Column;
    let taskIndex = selectedColumn?.tasks?.findIndex(
      (task) => taskId == task._id
    ) as number;

    if (taskIndex >= 0) {
      selectedColumn?.tasks?.splice(taskIndex, 1);
    }

    this.selectedBoard.next(selectedBoard);

    return this.http
      .delete(`${this.apiUrl}/deleteTask/${taskId}/${boardId}/${status}`)
      .subscribe();
  }

  openSideBar() {
    this.isSideBarOpen.next(true);
  }

  hideSideBar() {
    this.isSideBarOpen.next(false);
  }

  updateTaskOrder(data: updateTaskOrderDTO) {
    return this.http.post(`${this.apiUrl}/updateTaskOrder`, {
      previousIndex: data.previousIndex,
      currentIndex: data.currentIndex,
      previousColumnName: data.previousColumnName,
      currentColumnName: data.currentColumnName,
      columnName: data.columnName,
      selectedBoardId: data.selectedBoardId,
    });
  }
}
