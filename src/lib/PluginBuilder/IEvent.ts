export interface IParameter {
    name: string;
    dataType: string;
    description: string;
}

export interface IEvent {
    name: string;
    since: string;
    dataType: string;
    description: string;
    parameters: IParameter[];
}
