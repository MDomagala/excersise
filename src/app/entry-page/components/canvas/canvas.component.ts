import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { createCore } from "./core";
import { ActionsModel } from "../../models/actions-model";
import { ActionsService } from "../../services/actions.service";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatSnackBar } from "@angular/material/snack-bar";
import { debounceTime } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  width = 500;
  height = 500;

  constructor(@Inject(ElementRef) private elementRef: ElementRef, private actionsService: ActionsService, public snackBar: MatSnackBar) {}

  @ViewChild('bottom', {static: true, read: ElementRef}) bottom: ElementRef<HTMLCanvasElement>;
  @ViewChild('top', {static: true, read: ElementRef}) top: ElementRef<HTMLCanvasElement>;
  core: any;

  ngAfterViewInit(): void {
    const bottomContext = this.bottom.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    const topContext = this.top.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    this.width = this.elementRef.nativeElement.offsetWidth;
    this.height = this.elementRef.nativeElement.offsetHeight - 48;

    if (bottomContext) {
      this.core = createCore(bottomContext, topContext, this.width, this.height);
      this.core.getErrors().pipe((untilDestroyed(this))).subscribe((error: string) => {
        if (error) {
          this.snackBar.open(error, '', {duration: 5000});
        }
      })
    }

    this.actionsService.action.pipe(debounceTime(500)).subscribe((action) => {
      this.execute(action)
    });
  }


  execute(action: ActionsModel) {
    const handler = this.core[action.name];
    if (typeof handler === 'function') {
      handler(action.parameters);
    } else {
      console.error('Function is not defined');
    }
  }

}
