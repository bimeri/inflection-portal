import {CurrencyPipe, DatePipe, DecimalPipe, NgIf, NgTemplateOutlet} from "@angular/common";
import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, query, stagger, style, transition, trigger} from "@angular/animations";
import {NzDatePickerComponent, NzRangePickerComponent} from "ng-zorro-antd/date-picker";
import {SkeletonLoaderComponent} from "../skeleton-loader/skeleton-loader.component";
import {TranslationService} from "../../services/translation/translation.service";
import {faCalendarAlt, faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {ToastService} from "../../services/notification/toast.service";
import {NzTableModule, NzThAddOnComponent} from "ng-zorro-antd/table";
import {PartnerService} from "../../services/partner/partner.service";
import {NzButtonComponent, NzButtonSize} from "ng-zorro-antd/button";
import {SharedService} from "../../services/shared/shared.service";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ErrorResponseDto} from "../../model/ErrorResponseDto";
import {constants} from "../../../assets/resorces/constants";
import {TranslatePipe} from "../../pipes/translate.pipe";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzRowDirective} from "ng-zorro-antd/grid";
import {Partner} from "../../model/partner";
import {FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dashboard',
  imports: [
    SkeletonLoaderComponent,
    NzRangePickerComponent,
    NzDatePickerComponent,
    NzThAddOnComponent,
    NzButtonComponent,
    NgTemplateOutlet,
    NzDropDownModule,
    FaIconComponent,
    NzIconDirective,
    NzRowDirective,
    NzModalModule,
    NzTableModule,
    TranslatePipe,
    CurrencyPipe,
    FormsModule,
    DecimalPipe,
    NgIf,
  ],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true }),

        query(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class DashboardComponent implements OnInit, OnDestroy{
  protected listOfColumn: {title: string, compare: any}[] = constants.LIST_OF_COLUMNS;
  protected availableColumns: {title: string, compare: any}[] = [...this.listOfColumn];
  @ViewChild(NzRangePickerComponent) rangePicker!: NzRangePickerComponent;
  protected selectedColumns: { title: string, compare: any }[] = [];
  protected globalError: ErrorResponseDto = new ErrorResponseDto();
  protected displayDate: string = 'July 6, 2022 - Aug 5, 2022';
  private subscription: Subscription = new Subscription();
  protected mobileWidth: number = constants.MOBILE_WIDTH;
  protected chooseColumnModalVisible = false;
  protected pageSize: number = constants.PAGE_SIZE;
  protected isMessageModalVisible = false;
  protected isExportModalVisible = false;
  protected isDropdownVisible = false;
  protected size: NzButtonSize = 'default';
  protected error: string | undefined = '';
  protected downloading: boolean = false;
  protected visible: boolean = false;
  protected loading: boolean = false;
  protected partners: Partner[] = [];
  protected AllData: Partner[] = [];
  protected currentPage: number = 1;
  protected windowSize: number = 0;
  protected date: any = null;

  constructor(private datePipe: DatePipe, private partnerService: PartnerService,
              private sharedService: SharedService,
              private nzMessageService: NzMessageService,
              private tService: TranslationService,
              private toastService: ToastService) {
    this.subscription.add(
      this.sharedService.windowWidth$.subscribe((width: number) => {
        this.windowSize = width;
      })
    );
  }

  async confirm(text: string): Promise<void> {
    const element = document.getElementById('capture-section');
    const translatedText = this.tService.translateMessage(text);
    if (element != null && text == 'exported_as_pdf') {
      this.downloading = true;
     await this.partnerService.downloadAsPDF('capture-section');
      this.toastService.showSuccess(this.tService.translateMessage('success'),  translatedText);
      this.handleExport();
      this.downloading = false;
      return ;
    }
    this.nzMessageService.info(`${translatedText} 😜 😉`);
    this.handleExport();
  }

  onChange(dates: Date[]) {
    if (dates && dates.length === 2) {
      const startDate = this.datePipe.transform(dates[0], 'MMMM d, yyyy');
      const endDate = this.datePipe.transform(dates[1], 'MMMM d, yyyy');
      this.displayDate = `${startDate} - ${endDate}`;
      if (this.mobileWidth > this.windowSize) {
        this.isDropdownVisible = false;
      }
      this.toastService.showSuccess('success', this.tService.translateMessage('you_selected_the_date', [this.displayDate]));
    }
  }

  showPicker() {
    this.displayDate = '';
    setTimeout(() => {
      this.rangePicker.datePicker.open();
    }, 600);
  }

  onMessageClick(): void {
    this.isMessageModalVisible = true;
  }

  onColumnModalClick(): void {
    this.chooseColumnModalVisible = true;
  }

  onExportClick(): void {
    this.isExportModalVisible = true;
  }

  handleMessage(): void {
    this.nzMessageService.info(this.tService.translateMessage('message_sent'));
    this.toastService.showSuccess(this.tService.translateMessage('success'),  this.tService.translateMessage('message_sent'));
    this.handleCancelMessage();
  }

  handleColumn(): void {
    let selected = '';
    if (this.selectedColumns.length == 0) {
      this.toastService.showInfo(this.tService.translateMessage('info'),  this.tService.translateMessage('no_column_selected'));
      this.chooseColumnModalVisible = !this.chooseColumnModalVisible;
      return;
    }
    this.selectedColumns.forEach(column => {
      selected += `${column.title.toLowerCase()}, `;
    });
    this.nzMessageService.info(this.tService.translateMessage('success_column_message', [selected]), {
      nzDuration: 4000,
      nzAnimate: true,
      nzPauseOnHover: true
    });

    this.toastService.showSuccess(this.tService.translateMessage('success'),  this.tService.translateMessage('success_column'));
    this.chooseColumnModalVisible = !this.chooseColumnModalVisible;
  }

  handleExport(): void {
    this.isExportModalVisible = false;
  }

  handleCancelExport(): void {
    this.isExportModalVisible = false;
  }

  handleCancelMessage(): void {
    this.isMessageModalVisible = false;
  }

  handleColumnModalCancel(): void {
    this.chooseColumnModalVisible = false;
  }

  selectColumn(column: { title: string, compare: any }) {
    this.availableColumns = this.availableColumns.filter(c => c.title !== column.title);
    this.selectedColumns.push(column);
  }

  deselectColumn(column: { title: string, compare: any }) {
    this.selectedColumns = this.selectedColumns.filter(c => c.title !== column.title);
    this.availableColumns.push(column);
  }

  private getPartners() {
    this.loading = true;
    this.error = '';
    const allPartners: Partner[] = this.sharedService.getAllPartners();
    if (allPartners && allPartners.length > 0) {
      this.partners = allPartners;
      this.AllData = allPartners;
      this.loading = false;
      return;
    }
    this.subscription = this.partnerService.getPartners().subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
        this.AllData = data;
        this.sharedService.setPartner(data);
        this.loading = false;
      },
      error: (error: Error) => {
        this.globalError = this.sharedService.buildErrorResponse(error);
        this.error = this.globalError.errorMessage;
        this.toastService.showError(this.tService.translateMessage('unknown_error'), this.globalError.detailMessage)
        this.loading = false;
      }
    });
  }

  get paginatedData(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
     this.partners =  this.AllData;
     this.partners = this.partners.slice(start, end);
     return;
  }

  get totalPages() {
    return Math.ceil(this.AllData.length / this.pageSize);
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginatedData;
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginatedData;
    }
  }

  get dataRange(): [number, number] {
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.AllData.length);
    return [start, end];
  }

  ngOnInit(): void {
    this.getPartners();
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly caretDown = faCaretDown;
}
