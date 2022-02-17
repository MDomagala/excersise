import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ActionsInputModule } from "./actions-input/actions-input.module";
import { ConsoleComponent } from "./console.component";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";


@NgModule({
  declarations: [ConsoleComponent],
  exports: [ConsoleComponent],
  imports: [
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ActionsInputModule,
    MatToolbarModule,
    MatButtonModule
  ]
})
export class ConsoleModule { }
