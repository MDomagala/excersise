import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionsInputComponent } from "./actions-input.component";
import { ActionsService } from "../../../services/actions.service";



@NgModule({
  declarations: [ActionsInputComponent],
  imports: [
    CommonModule
  ],
  providers: [ActionsService],
  exports: [ActionsInputComponent]
})
export class ActionsInputModule { }
