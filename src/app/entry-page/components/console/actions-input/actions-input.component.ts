import {
  AfterViewInit,
  Component,
  ElementRef, EventEmitter,
  HostListener,
  Inject, Output,
  ViewChild
} from '@angular/core';
import { DOCUMENT } from "@angular/common";
import { AvailableActions } from "../console-actions";
import { ActionsModel } from "../../../models/actions-model";

@Component({
  selector: 'app-actions-input',
  templateUrl: './actions-input.component.html',
  styleUrls: ['./actions-input.component.scss']
})
export class ActionsInputComponent implements AfterViewInit {
  allActions: ActionsModel[] = AvailableActions;
  actionNames = AvailableActions.map(item => item.name);

  name: string = '';
  parameters: string[] = [];
  regex: RegExp | null;
  paramsInput = '';

  private valid = false;

  @ViewChild('input') input: ElementRef;
  @Output() newAction = new EventEmitter();

  constructor(@Inject(DOCUMENT) private document: Document) { }

  ngAfterViewInit() {
    this.input.nativeElement.focus();
    document.execCommand("defaultParagraphSeparator", false, "div");
  }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace') {
      this.onBackSpace()
    }
    if (event.key === ' ') {
      this.onNewAction();
    }
    if (event.key === 'Enter') {
      this.onUserInput();
    }
  }

  @HostListener('keyup', ['$event']) onKeyUp(event: KeyboardEvent) {
    if (this.name && event.key === ' ') {
      this.paramsInput += event.key
    }
    if (this.name && event.key === '-') {
      this.paramsInput += event.key
    }
    if (this.name && (new RegExp('[-+]?[0-9]+').test(event.key))) {
      this.paramsInput += event.key
      this.input.nativeElement.innerHTML =
          `<span style="color: blue">${this.name} </span>` + ' ' + `<span style="color: green"> ${this.paramsInput} </span>`
      this.document.execCommand('selectAll', false, '');
      this.document.getSelection()?.collapseToEnd();
    }
  }

  serialize() {
    return this.valid ? {name: this.name, parameters: this.parameters} : null;
  }

  private getParamsFromMatch(match: RegExpExecArray): any[] {
    const params: string[] = [];
    match.shift();
    match.forEach(item => params.push(item))
    return params;
  }

  isValid(): boolean {
      return this.valid;
  }

  private onUserInput() {
      if (this.name && !this.regex) {
        this.valid = true;
        setTimeout(() => {this.newAction.next({name: this.name});} ,0)
      }

      if (this.name && this.regex) {
          const paramsInput = new String(this.paramsInput).trim();
          const match = this.regex?.exec(paramsInput.trim())
          if (match) {
              this.valid = true;
              this.parameters = this.getParamsFromMatch(match)
              setTimeout(() => {
                this.newAction.next({name: this.name, parameters: this.parameters});
              } ,0)
          }
      }
  }

  private onNewAction() {
    const input = this.input.nativeElement.innerHTML.replace(/\&nbsp;/g, '');
    if (this.actionNames.includes(input)) {
      this.name = input;
      this.input.nativeElement.innerHTML = `<span style="color: blue"> ${input} </span>`;
      const found = this.allActions.find((item) => item.name === this.name)
      if (found?.regex) {
        this.regex = new RegExp(found.regex);
      }
      this.document.execCommand('selectAll', false, '');
      this.document.getSelection()?.collapseToEnd();
    }
  }

  private onBackSpace() {
    if (this.paramsInput) {
      this.paramsInput = this.paramsInput.slice(0, -1);
      if (this.regex) {
        this.valid = false;
      }
    } else if (this.name) {
      this.parameters = [];
      this.name = ''
      this.input.nativeElement.innerHTML = '';
      this.regex = null;
      this.valid = false;
    }
  }
}
