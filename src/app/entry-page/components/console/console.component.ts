import {
  Component,
  ComponentRef,
  createNgModuleRef, HostListener,
  Injector,
  NgModuleRef,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import { ActionsService } from "../../services/actions.service";
import { ActionsInputComponent } from "./actions-input/actions-input.component";
import { race, Subscription } from "rxjs";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";

@UntilDestroy()
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  private ngModuleRef: NgModuleRef<any>;
  private index = 0;
  private children: ComponentRef<ActionsInputComponent>[] = [];
  private subscription: Subscription;

  @ViewChild('container', {read: ViewContainerRef, static: true}) container: ViewContainerRef;

  constructor(private actionsService: ActionsService, public injector: Injector) {
    import('./actions-input/actions-input.module').then((wholeModule) => {
      const module = wholeModule['ActionsInputModule'];
      this.ngModuleRef = createNgModuleRef(module, this.injector);
    })
  }

  ngOnInit() {
    this.createChild();
  }

  @HostListener('document:keypress', ['$event']) onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();

      if (this.children.every((child) => child.instance.isValid())) {
        this.createChild();
      }
    }
  }

  onClean(): void {
    this.children.forEach((child) => child.destroy());
    this.index = 0;
    this.children = [];
    this.createChild();
    this.actionsService.next({name: 'clear'});
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private createChild() {
    this.children.push(this.container.createComponent(ActionsInputComponent,
        {injector: this.container.injector, index: this.index++, ngModuleRef: this.ngModuleRef, projectableNodes: [[]]}
    ));

    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    const observables = this.children.map((child) => child.instance.newAction);
    this.subscription = race(observables).pipe(untilDestroyed(this)).subscribe((arg) => {
      this.actionsService.next(arg);
    })
  }

}
