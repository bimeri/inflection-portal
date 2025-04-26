import {Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {NzDatePickerComponent, NzRangePickerComponent} from "ng-zorro-antd/date-picker";
import {SkeletonLoaderComponent} from "../skeleton-loader/skeleton-loader.component";
import {TranslationService} from "../../services/translation/translation.service";
import {faCalendarAlt, faCaretDown} from "@fortawesome/free-solid-svg-icons";
import {DatePipe, NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
import {ToastService} from "../../services/notification/toast.service";
import {NzTableModule, NzThAddOnComponent} from "ng-zorro-antd/table";
import {PartnerService} from "../../services/partner/partner.service";
import {NzButtonComponent, NzButtonSize} from "ng-zorro-antd/button";
import {SharedService} from "../../services/shared/shared.service";
import {NzColDirective, NzRowDirective} from "ng-zorro-antd/grid";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ErrorResponseDto} from "../../model/ErrorResponseDto";
import {constants} from "../../../assets/resorces/constants";
import {TranslatePipe} from "../../pipes/translate.pipe";
import {NzPopoverDirective} from "ng-zorro-antd/popover";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzModalModule} from "ng-zorro-antd/modal";
import {Partner} from "../../model/partner";
import {FormsModule} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [
    SkeletonLoaderComponent,
    NzRangePickerComponent,
    NzDatePickerComponent,
    NzPopoverDirective,
    NzThAddOnComponent,
    NzButtonComponent,
    NgTemplateOutlet,
    NzIconDirective,
    FaIconComponent,
    NzRowDirective,
    NzColDirective,
    NzModalModule,
    TranslatePipe,
    NzTableModule,
    FormsModule,
    NgClass,
    NgIf,
  ],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe]
})
export class PartnerComponent implements OnInit, OnDestroy{
  protected listOfColumn: {title: string, compare: any}[] = constants.LIST_OF_COLUMNS;
  @ViewChild(NzRangePickerComponent) rangePicker!: NzRangePickerComponent;
  protected globalError: ErrorResponseDto = new ErrorResponseDto();
  protected displayDate: string = 'July 6, 2022 - Aug 5, 2022';
  private subscription: Subscription = new Subscription();
  protected mobileWidth: number = constants.MOBILE_WIDTH;
  protected pageSize: number = constants.PAGE_SIZE;
  protected isMessageModalVisible = false;
  protected isExportModalVisible = false;
  protected size: NzButtonSize = 'default';
  protected error: string | undefined = '';
  protected visible: boolean = false;
  protected loading: boolean = false;
  protected partners: Partner[] = [];
  protected AllData: Partner[] = [];
  protected currentPage: number = 1;
  protected windowSize: number = 0;
  protected downloading: boolean = false;
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
    this.nzMessageService.info(translatedText);
    this.handleExport();
  }

  onChange(dates: Date[]) {
    if (dates && dates.length === 2) {
      const startDate = this.datePipe.transform(dates[0], 'MMMM d, yyyy');
      const endDate = this.datePipe.transform(dates[1], 'MMMM d, yyyy');
      this.displayDate = `${startDate} - ${endDate}`;
    }
  }

  change(value: boolean): void {
    this.visible = value;
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

  onExportClick(): void {
    this.isExportModalVisible = true;
  }

  handleMessage(): void {
    this.nzMessageService.info(this.tService.translateMessage('message_sent'));
    this.toastService.showSuccess(this.tService.translateMessage('success'),  this.tService.translateMessage('message_sent'));
    this.handleCancelMessage();
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

  private getPartners() {
    this.loading = true;
    this.error = '';
    this.subscription = this.partnerService.getPartners().subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
        this.AllData = data;
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
