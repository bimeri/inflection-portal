import {Component, OnDestroy, OnInit} from '@angular/core';
import {Partner} from "../../../model/partner";
import {PartnerService} from "../../../services/partner/partner.service";
import {NgIf} from "@angular/common";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.scss'
})
export class PartnerComponent implements OnInit, OnDestroy{
  private subscription?: Subscription;
  protected partners: Partner[] = [];
  protected loading = true;
  protected error = '';
  protected page = 1;

  constructor(private partnerService: PartnerService) {}

  private getPartners() {
    this.loading = true;
    this.error = '';
   this.subscription = this.partnerService.getPartners().subscribe({
      next: (data: Partner[]) => {
        console.log("the data is:", data);
        this.partners = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load partners';
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getPartners();
  }

  ngOnDestroy(): void {
    if (this.subscription){
      this.subscription.unsubscribe();
    }
  }

}
