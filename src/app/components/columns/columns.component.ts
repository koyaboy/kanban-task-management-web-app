import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Column } from '../../model/column';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [NgFor],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css'
})
export class ColumnsComponent {
  @Input() columns: Column[] | undefined = []
}
