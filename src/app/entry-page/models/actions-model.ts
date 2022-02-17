export interface ActionsModel {
    name: string;
    inputs?: any[];
    about?: string;
    parameters?: any [];
    regex?: string
}

export interface ActionParameter {
    [key: string]: string;
}
