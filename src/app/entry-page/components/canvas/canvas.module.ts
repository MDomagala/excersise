import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasComponent } from "./canvas.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSnackBarModule } from "@angular/material/snack-bar";

@NgModule({
  declarations: [CanvasComponent],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  exports: [
    CanvasComponent
  ]
})
export class CanvasModule { }
