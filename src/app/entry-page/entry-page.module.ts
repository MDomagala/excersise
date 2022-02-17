import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryPageComponent } from './entry-page.component';
import { RouterModule } from "@angular/router";
import { ActionsService } from "./services/actions.service";
import { ConsoleModule } from "./components/console/console.module";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { CanvasModule } from "./components/canvas/canvas.module";

@NgModule({
  declarations: [EntryPageComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{path: '', component: EntryPageComponent}]),
        ConsoleModule,
        MatToolbarModule,
        MatButtonModule,
        CanvasModule,
        ConsoleModule
    ],
  exports: [EntryPageComponent],
  providers: [ActionsService]
})
export class EntryPageModule {

}
