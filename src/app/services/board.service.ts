import { Injectable, inject, signal, Signal, EnvironmentInjector, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { toSignal } from "@angular/core/rxjs-interop"
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Task } from '../model/task'
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = "http://localhost:8000/api/boards"

  http: HttpClient = inject(HttpClient)
  overlay: Overlay = inject(Overlay)
  injector = inject(EnvironmentInjector);

  private boards = new BehaviorSubject<Board[]>([])
  boards$ = this.boards.asObservable()

  private selectedBoard = new BehaviorSubject<Board>({ _id: '', name: '', columns: [] })
  selectedBoard$ = this.selectedBoard.asObservable()

  private isSideBarOpen = new BehaviorSubject<boolean>(true)
  isSideBarOpen$ = this.isSideBarOpen.asObservable()

  config = new OverlayConfig({
    positionStrategy: this.overlay.position().global().centerVertically().centerHorizontally(),
    hasBackdrop: true
  })

  overlayRef = this.overlay.create(this.config)

  openModal(portal: TemplatePortal<any>): void {
    this.overlayRef.attach(portal)
    this.overlayRef.backdropClick().subscribe(() => this.closeModal())
  }

  closeModal(): void {
    this.overlayRef.detach()
  }

  addTask(data: any) {
    return this.http.post<Task>(`${this.apiUrl}/addTask`, { boardId: this.selectedBoard.value._id, ...data })
  }

  getBoards() {
    this.http.get<Board[]>(`${this.apiUrl}/getBoards`).pipe(shareReplay(1)).subscribe(
      (boards) => {
        this.boards.next(boards)
        this.selectedBoard.next(boards[0])
      })
  }

  updateSelectedBoard(newBoard: Board) {
    this.selectedBoard.next(newBoard)
  }

  addBoard(data: object) {
    this.http.post<Board>(`${this.apiUrl}/createBoard`, { ...data }).subscribe(
      (newBoard) => {
        const currentBoard = this.boards.value;
        const updatedBoards = [...currentBoard, newBoard]
        this.boards.next(updatedBoards)
        this.updateSelectedBoard(newBoard)
        this.closeModal()
      })
  }

  editBoard(data: object, selectedBoardId: string) {
    this.http.put<Board>(`${this.apiUrl}/editBoard/${selectedBoardId}`, { ...data }).subscribe((editedBoard) => {
      let currentBoards = this.boards.value
      const index = currentBoards.findIndex(board => board._id === editedBoard._id);

      if (index !== -1) {
        currentBoards[index] = editedBoard
      }

      this.boards.next(currentBoards)
      this.closeModal()
    })
  }

  deleteBoard(selectedBoardId: string) {
    this.http.delete<Board>(`${this.apiUrl}/deleteBoard/${selectedBoardId}`).subscribe((deletedBoard) => {
      let currentBoards = this.boards.value

      const boardToDeleteIndex = currentBoards.findIndex(board => board._id == deletedBoard._id)

      if (boardToDeleteIndex !== -1) {
        currentBoards.splice(boardToDeleteIndex, 1)
      }

      this.boards.next(currentBoards)

      if (boardToDeleteIndex > 0) {
        this.updateSelectedBoard(currentBoards[boardToDeleteIndex - 1])
      } else {
        this.updateSelectedBoard(currentBoards[0])
      }
      this.closeModal()
    })
  }

  editTask(data: object, taskId: string, boardId: string, columnName: string) {
    return this.http.put(`${this.apiUrl}/editTask/${taskId}`, { data, selectedBoardId: boardId, columnName: columnName })
  }

  deleteTask(taskId: string, boardId: string, status: string) {
    return this.http.delete(`${this.apiUrl}/deleteTask/${taskId}/${boardId}/${status}`)
  }

  openSideBar() {
    this.isSideBarOpen.next(true)
  }

  hideSideBar() {
    this.isSideBarOpen.next(false)
  }
}
