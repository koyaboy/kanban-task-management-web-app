import { NgFor, NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Column } from '../../model/column';

@Component({
  selector: 'app-columns',
  standalone: true,
  imports: [NgFor, NgStyle],
  templateUrl: './columns.component.html',
  styleUrl: './columns.component.css'
})
export class ColumnsComponent {
  @Input() columns: Column[] | undefined = []

  getRandomColor(index: number) {
    let colors = ["#49C4E5", "#8471F2", "#67E2AE"];
    return colors[index % colors.length]
  }
}
