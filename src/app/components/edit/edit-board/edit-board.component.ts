import { Component, Input } from '@angular/core';
import { Board } from '../../../model/board';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-edit-board',
  standalone: true,
  imports: [NgFor],
  templateUrl: './edit-board.component.html',
  styleUrl: './edit-board.component.css'
})
export class EditBoardComponent {
  @Input() board!: Board | undefined
}
