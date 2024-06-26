import { NgFor, NgIf } from '@angular/common';
import { Component, Output, inject, EventEmitter } from '@angular/core';
import { LoaderComponent } from '../../loader/loader.component';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
  FormArray,
  FormGroup,
} from '@angular/forms';
import { BoardService } from '../../../services/board.service';
import { Board } from '../../../model/board';
import { AsyncPipe } from '@angular/common';
import { noDuplicateColumnNames } from '../../../validators/noDuplicateName.validator';

@Component({
  selector: 'app-add-board',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    FormsModule,
    NgFor,
    AsyncPipe,
    LoaderComponent,
  ],
  templateUrl: './add-board.component.html',
  styleUrl: './add-board.component.css',
})
export class AddBoardComponent {
  boardService: BoardService = inject(BoardService);
  fb: FormBuilder = inject(FormBuilder);

  addBoardForm!: FormGroup;

  isSubmitting$ = this.boardService.isSubmitting$;
  errorMessage$ = this.boardService.errorMessage$;

  ngOnInit() {
    this.addBoardForm = this.fb.group({
      boardName: ['', Validators.required],
      boardColumns: this.fb.array(
        [
          this.fb.group({ name: ['Todo', Validators.required] }),
          this.fb.group({ name: ['Doing', Validators.required] }),
        ],
        { validators: noDuplicateColumnNames() }
      ),
    });
  }

  get boardColumns() {
    return this.addBoardForm.get('boardColumns') as FormArray;
  }

  addBoardColumn(): void {
    this.boardColumns.push(this.fb.group({ name: ['', Validators.required] }));
  }

  removeBoardColumn(index: number): void {
    this.boardColumns.removeAt(index);
  }

  onSubmit(): void {
    const { boardName, boardColumns } = this.addBoardForm.value;

    const data = {
      name: boardName,
      columns: boardColumns,
    };

    this.boardService.addBoard(data);
  }
}
