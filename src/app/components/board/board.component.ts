import {
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
  TemplateRef,
  Renderer2,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ColumnsComponent } from '../columns/columns.component';
import { BoardService } from '../../services/board.service';
import { Board } from '../../model/board';
import { NgIf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { EditBoardComponent } from '../edit/edit-board/edit-board.component';
import { TemplatePortal } from '@angular/cdk/portal';
// import {MatSidenavModule} from '@angular/material/sidenav';
import { NgStyle } from '@angular/common';
import { AddBoardComponent } from '../add/add-board/add-board.component';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    ColumnsComponent,
    NgIf,
    AsyncPipe,
    EditBoardComponent,
    NgStyle,
    AddBoardComponent,
    NgFor,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css',
})
export class BoardComponent {
  boardService: BoardService = inject(BoardService);
  viewContainerRef: ViewContainerRef = inject(ViewContainerRef);
  renderer: Renderer2 = inject(Renderer2);

  @ViewChild('addBoardRef') addBoardRef!: TemplateRef<any>;
  @ViewChild('editBoardRef') editBoardRef!: TemplateRef<any>;
  @ViewChild('checkbox') checkbox!: ElementRef<HTMLInputElement>;

  boards$!: Observable<Board[]>;
  selectedBoard$!: Observable<Board>;
  subscription!: Subscription;

  isSideBarOpen!: boolean;
  windowWidth!: number;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.windowWidth = window.innerWidth;

    if (this.windowWidth < 768) {
      this.boardService.hideSideBar();
    }
  }

  ngOnInit() {
    this.boards$ = this.boardService.boards$;
    this.selectedBoard$ = this.boardService.selectedBoard$;

    this.subscription = this.boardService.isSideBarOpen$.subscribe(
      (isSideBarOpen) => {
        this.isSideBarOpen = isSideBarOpen;
      }
    );

    this.windowWidth = window.innerWidth;
  }

  openEditBoardModal() {
    const editBoardPortal = new TemplatePortal(
      this.editBoardRef,
      this.viewContainerRef
    );
    this.boardService.openModal(editBoardPortal);
  }

  changeBoard(index: number) {
    this.boardService.boards$.subscribe((boards) => {
      this.boardService.updateSelectedBoard(boards[index]);
    });
  }

  openAddBoardModal(): void {
    const addBoardPortal = new TemplatePortal(
      this.addBoardRef,
      this.viewContainerRef
    );
    this.boardService.openModal(addBoardPortal);
  }

  toggleTheme() {
    const htmlTag = document.querySelector('html');
    const isCheckboxChecked = this.checkbox.nativeElement.checked;
    if (isCheckboxChecked) {
      this.renderer?.addClass(htmlTag, 'dark');
      this.boardService.setTheme('dark');
    } else {
      this.renderer?.removeClass(htmlTag, 'dark');
      this.boardService.setTheme('light');
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
