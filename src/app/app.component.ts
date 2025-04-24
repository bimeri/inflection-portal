import {Component, ViewChild} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {
  NzContentComponent,
  NzFooterComponent,
  NzLayoutComponent,
  NzSiderComponent
} from "ng-zorro-antd/layout";
import {faCalendarAlt, faCaretDown, faHome, faUser} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NzDatePickerModule, NzRangePickerComponent} from "ng-zorro-antd/date-picker";
import {FormsModule} from "@angular/forms";
import {NzButtonComponent, NzButtonSize} from "ng-zorro-antd/button";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NzLayoutComponent,
    NzSiderComponent,
    NzContentComponent,
    NzFooterComponent,
    FaIconComponent,
    NzRangePickerComponent,
    FormsModule,
    NzDatePickerModule,
    NzButtonComponent,
    NzIconDirective
  ],
  providers: [DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  @ViewChild(NzRangePickerComponent) rangePicker!: NzRangePickerComponent;
  size: NzButtonSize = 'default';
  title = 'inflection-portal';
  date = null;
  private userIcon = faUser;
  protected readonly faUser = faUser;
  protected readonly caretDown = faCaretDown;
  protected readonly faHome = faHome;
  displayDate: string = ' July 6, 2022 - Aug 5, 2022';

  constructor(private datePipe: DatePipe) {
  }

  onChange(dates: Date[]) {
    if (dates && dates.length === 2) {
      const startDate = this.datePipe.transform(dates[0], 'MMMM d, yyyy');
      const endDate = this.datePipe.transform(dates[1], 'MMMM d, yyyy');
      this.displayDate = `${startDate} - ${endDate}`;
    }
  }

  showPicker() {
    this.displayDate = '';
    setTimeout(() => {
      this.rangePicker.datePicker.open();
    }, 600);

  }

  protected readonly faCalendarAlt = faCalendarAlt;
}
