import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Board } from '../model/board';
import { toSignal } from "@angular/core/rxjs-interop"
import { shareReplay } from 'rxjs/operators';
import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = "http://localhost:8000/api/boards"

  http: HttpClient = inject(HttpClient)
  overlay: Overlay = inject(Overlay)

  boards$ = this.http.get<Board[]>(`${this.apiUrl}/getBoards`).pipe(shareReplay(1))
  boards = toSignal(this.boards$, { initialValue: [] })
  selectedBoard: Board | undefined = this.boards()[2]

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
}
