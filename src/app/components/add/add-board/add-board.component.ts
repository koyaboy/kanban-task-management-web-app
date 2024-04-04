import { NgFor } from '@angular/common';
import { Component, Output, inject, EventEmitter } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule, FormArray } from '@angular/forms';
import { toSignal } from "@angular/core/rxjs-interop"
import { BoardService } from '../../../services/board.service';
import { Board } from '../../../model/board';

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgFor],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.css'
})
export class AddBoardComponent {
  boardService: BoardService = inject(BoardService)
  fb: FormBuilder = inject(FormBuilder)

  @Output() updatedBoards: EventEmitter<Board[]> = new EventEmitter()

  selectedBoard = this.boardService.selectedBoard
  addBoardForm = this.fb.group({
    boardName: ['', Validators.required],
    boardColumns: this.fb.array([
      this.fb.group({ name: ['Todo', Validators.required] }),
      this.fb.group({ name: ['Doing', Validators.required] })
    ])
  })

  get boardColumns() {
    return this.addBoardForm.get('boardColumns') as FormArray;
  }

  addBoardColumn(): void {
    this.boardColumns.push(this.fb.group({ name: ['', Validators.required] }))
  }

  removeBoardColumn(index: number): void {
    this.boardColumns.removeAt(index)
  }

  onSubmit(): void {
    const { boardName, boardColumns } = this.addBoardForm.value

    const data = {
      name: boardName,
      columns: boardColumns
    }

    this.boardService.addBoard(data).subscribe(() => {
      this.updateBoards()
    })
  }

  updateBoards() {
    this.boardService.getBoards().subscribe((data) => {
      this.updatedBoards.emit(data)
    })
  }
}
