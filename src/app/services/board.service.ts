import { Injectable, inject, signal, Signal, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { toSignal } from "@angular/core/rxjs-interop"
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Task } from '../model/task'

@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = "http://localhost:8000/api/boards"

  http: HttpClient = inject(HttpClient)
  overlay: Overlay = inject(Overlay)
  injector = inject(EnvironmentInjector);

  boards$ = this.http.get<Board[]>(`${this.apiUrl}/getBoards`).pipe(shareReplay(1))
  boards = toSignal(this.boards$, { initialValue: [] })

  // boards = signal(this.boards$)

  // test = signal(this.boards$)
  // selectedBoard: Board | undefined = this.boards()[0]

  selectedBoard = signal(this.boards()[0])

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
    return this.http.post<Task>(`${this.apiUrl}/addTask`, { boardId: this.selectedBoard()?._id, ...data })
  }

  getBoards() {
    this.boards$ = this.http.get<Board[]>(`${this.apiUrl}/getBoards`).pipe(shareReplay(1))
    runInInjectionContext(this.injector, () => {
      this.boards = toSignal(this.boards$) as Signal<Board[]>;
    });
    return this.boards$
  }

  addBoard(data: object) {
    return this.http.post(`${this.apiUrl}/createBoard`, { ...data })
  }

  editTask(data: object, taskId: string, boardId: string, columnName: string) {
    return this.http.put(`${this.apiUrl}/editTask/${taskId}`, { data, selectedBoardId: boardId, columnName: columnName })
  }

  deleteTask(taskId: string, boardId: string, status: string) {
    return this.http.delete(`${this.apiUrl}/deleteTask/${taskId}/${boardId}/${status}`)
  }
}
