import {
  NzContentComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from "ng-zorro-antd/layout";
import {FaIconComponent, IconDefinition} from "@fortawesome/angular-fontawesome";
import {faCaretDown, faHome} from "@fortawesome/free-solid-svg-icons";
import {Component, HostListener, OnDestroy} from '@angular/core';
import {SharedService} from "./services/shared/shared.service";
import {NgForOf, NgIf, NgTemplateOutlet} from '@angular/common';
import {NzIconDirective} from "ng-zorro-antd/icon";
import { RouterOutlet } from '@angular/router';
import {Subscription} from "rxjs";
import {animate, keyframes, state, style, transition, trigger} from "@angular/animations";
import {MenuItem} from "./model/partner";
import {TranslatePipe} from "./pipes/translate.pipe";
import {TranslationService} from "./services/translation/translation.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NzContentComponent,
    NzHeaderComponent,
    NzLayoutComponent,
    NgTemplateOutlet,
    NzSiderComponent,
    NzIconDirective,
    FaIconComponent,
    TranslatePipe,
    RouterOutlet,
    NgIf,
    NgForOf,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('vibrate', [
      state('idle', style({ transform: 'translateX(0)' })),
      state('vibrating', style({})),
      transition('idle => vibrating', [
        animate(
          '300ms',
          keyframes([
            style({ transform: 'translateX(-2px)', offset: 0.1 }),
            style({ transform: 'translateX(2px)', offset: 0.2 }),
            style({ transform: 'translateX(-2px)', offset: 0.3 }),
            style({ transform: 'translateX(2px)', offset: 0.4 }),
            style({ transform: 'translateX(-1px)', offset: 0.5 }),
            style({ transform: 'translateX(1px)', offset: 0.6 }),
            style({ transform: 'translateX(0)', offset: 1 })
          ])
        )
      ])
    ])
  ]
})
export class AppComponent implements OnDestroy{
  protected logo: string = 'assets/images/vector1264-y7so.svg';
  protected readonly caretDown: IconDefinition = faCaretDown;
  protected readonly homeIcon: IconDefinition = faHome;
  private subscription: Subscription = new Subscription();
  protected isCollapsed: boolean = true;
  protected mobileWidth: number = 985;
  protected windowSize: number = 0;
  protected hoveredIndex: number | null = null;
  protected menuItems: MenuItem[] = [
    { label: this.tService.translateMessage('dashboard'), icon: 'home'},
    { label: this.tService.translateMessage('partners'), icon: 'user' },
    { label: this.tService.translateMessage('approvals'), icon: 'check-square'},
    { label: this.tService.translateMessage('messaging'), icon: 'mail' },
    { label: this.tService.translateMessage('marketing_resources'), icon: 'shopping' },
    { label: this.tService.translateMessage('files'), icon: 'file-text'},
    { label: this.tService.translateMessage('conversion'), icon: 'transaction' },
    { label: this.tService.translateMessage('admin'), icon: 'user-switch' }
  ];

  constructor(private sharedService: SharedService, private tService: TranslationService) {
    this.subscription.add(
      this.sharedService.windowWidth$.subscribe((width: number) => {
          this.windowSize = width;
        })
    );
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.sharedService.setWindowWidthAndHeight(window.innerWidth, window.innerHeight);
  }

  setHover(index: number | null) {
    this.hoveredIndex = index;
  }

  closeDrawer(): void {
    this.isCollapsed = true;
  }

  ngOnDestroy(): void{
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
