import { Component, inject } from '@angular/core';
import { Board } from '../../../model/board';
import { NgFor } from '@angular/common';
import { BoardService } from '../../../services/board.service';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Column } from '../../../model/column';

@Component({
  selector: 'app-edit-board',
  standalone: true,
  imports: [NgFor, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.css'
})
export class EditBoardComponent {
  boardService: BoardService = inject(BoardService)
  fb: FormBuilder = inject(FormBuilder)

  // @Output() updatedBoards: EventEmitter<Board[]> = new EventEmitter()
  selectedBoardName!: string
  selectedBoardColumns!: Column[] | undefined
  editBoardForm!: FormGroup

  ngOnInit() {
    this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoardName = selectedBoard.name
      this.selectedBoardColumns = selectedBoard.columns
    })

    this.editBoardForm = this.fb.group({
      boardName: [this.selectedBoardName, Validators.required],
      boardColumns: this.fb.array((this.selectedBoardColumns || []).map(column => this.fb.group({ name: [column.name, Validators.required] })))
    })
  }

  get boardColumns() {
    return this.editBoardForm.get('boardColumns') as FormArray;
  }

  addBoardColumn(): void {
    this.boardColumns.push(this.fb.group({ name: ['', Validators.required] }))
  }

  removeBoardColumn(index: number): void {
    this.boardColumns.removeAt(index)
  }

  onSubmit(): void {
    const { boardName, boardColumns } = this.editBoardForm.value

    const data = {
      name: boardName,
      columns: boardColumns
    }

    console.log(data)

    // this.boardService.addBoard(data).subscribe(() => {
    //   this.updateBoards()
    // })
  }

  updateBoards() {
    // this.boardService.getBoards().subscribe((data) => {
    //   this.updatedBoards.emit(data)
    // })
  }
}
