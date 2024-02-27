import { Injectable, inject, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Board } from '../model/board';

import { toSignal } from "@angular/core/rxjs-interop"
import { shareReplay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class BoardService {

  private apiUrl = "http://localhost:8000/api/boards"

  http: HttpClient = inject(HttpClient)

  boards$ = this.http.get<Board[]>(`${this.apiUrl}/getBoards`).pipe(
    shareReplay(1)
  )
  boards = toSignal(this.boards$, { initialValue: [] })
  selectedBoard: string = this.boards()[2]?.name

}
