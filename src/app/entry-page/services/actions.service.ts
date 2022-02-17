import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { ActionsModel } from "../models/actions-model";

@Injectable()
export class ActionsService {
  private _action = new Subject<ActionsModel>();
  constructor() { }

  get action(): Observable<ActionsModel> {
    return this._action.asObservable();
  }

  next(actions: ActionsModel) {
    this._action.next(actions);
  }


}
