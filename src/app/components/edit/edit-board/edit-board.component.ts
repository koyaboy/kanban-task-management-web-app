import { Component, inject, Output, EventEmitter } from '@angular/core';
import { Board } from '../../../model/board';
import { NgFor, NgIf } from '@angular/common';
import { BoardService } from '../../../services/board.service';
import { AsyncPipe } from '@angular/common';
import { LoaderComponent } from '../../loader/loader.component';

import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Column } from '../../../model/column';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-board',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    LoaderComponent,
  ],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.css',
})
export class EditBoardComponent {
  boardService: BoardService = inject(BoardService);
  fb: FormBuilder = inject(FormBuilder);

  @Output() updatedBoards: EventEmitter<Board[]> = new EventEmitter();

  selectedBoardName!: string;
  selectedBoardColumns!: Column[] | undefined;
  selectedBoardId!: string;
  editBoardForm!: FormGroup;
  sub!: Subscription;

  isSubmitting$ = this.boardService.isSubmitting$;

  ngOnInit() {
    this.sub = this.boardService.selectedBoard$.subscribe((selectedBoard) => {
      this.selectedBoardName = selectedBoard.name;
      this.selectedBoardColumns = selectedBoard.columns;
      this.selectedBoardId = selectedBoard._id;
    });

    this.editBoardForm = this.fb.group({
      boardName: [this.selectedBoardName, Validators.required],
      boardColumns: this.fb.array(
        (this.selectedBoardColumns || []).map((column) =>
          this.fb.group({ name: [column.name, Validators.required] })
        )
      ),
    });
  }

  get boardColumns() {
    return this.editBoardForm.get('boardColumns') as FormArray;
  }

  addBoardColumn(): void {
    this.boardColumns.push(this.fb.group({ name: ['', Validators.required] }));
  }

  removeBoardColumn(index: number): void {
    this.boardColumns.removeAt(index);
  }

  onSubmit(): void {
    const { boardName, boardColumns } = this.editBoardForm.value;

    const data = {
      boardName: boardName,
      boardColumns: boardColumns,
    };

    this.boardService.editBoard(data, this.selectedBoardId);
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
