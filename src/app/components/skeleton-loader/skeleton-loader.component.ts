import { Component } from '@angular/core';
import {NzSkeletonComponent, NzSkeletonElementDirective, NzSkeletonElementInputComponent} from "ng-zorro-antd/skeleton";

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [
    NzSkeletonComponent,
    NzSkeletonElementDirective,
    NzSkeletonElementInputComponent
  ],
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss'
})
export class SkeletonLoaderComponent {

}
