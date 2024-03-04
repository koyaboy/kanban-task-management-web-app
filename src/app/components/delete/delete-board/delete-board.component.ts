import { Component, Input } from '@angular/core';
import { Board } from '../../../model/board';

@Component({
  selector: 'app-delete-board',
  standalone: true,
  imports: [],
  templateUrl: './delete-board.component.html',
  styleUrl: './delete-board.component.css'
})
export class DeleteBoardComponent {
  @Input() board!: Board | undefined
}
