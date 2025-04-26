import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TranslatePipe} from "../../pipes/translate.pipe";
import {Partner} from "../../model/partner";
import {SharedService} from "../../services/shared/shared.service";
import {Subscription} from "rxjs";
import {PartnerService} from "../../services/partner/partner.service";
import {ErrorResponseDto} from "../../model/ErrorResponseDto";
import {TranslationService} from "../../services/translation/translation.service";
import {ToastService} from "../../services/notification/toast.service";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-partners',
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe,
    NgForOf,
    NzSpinComponent,
    NzIconDirective
  ],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.scss'
})
export class PartnersComponent implements OnInit, OnDestroy{
  protected globalError: ErrorResponseDto = new ErrorResponseDto();
  protected partners: Partner[] = [];
  protected error: string | undefined = '';
  protected loading: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor( private sharedService: SharedService,
               private partnerService: PartnerService,
               private tService: TranslationService,
               private toastService: ToastService) {

  }

  private getAllPartners() {
    this.loading = true;
    this.error = '';
    this.subscription = this.partnerService.getPartners().subscribe({
      next: (data: Partner[]) => {
        this.partners = data;
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.partners = this.sharedService.getAllPartners();
    if (!this.partners || !this.partners.length) {
      this.getAllPartners();
    }
  }


}
