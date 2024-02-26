import { Component } from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [ColumnsComponent],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {

}
