interface IParameter {
    name: string;
    dataType: string;
    description: string;
}

interface IPluginEvent {
    name: string;
    since: string,
    dataType: string;
    description: string;
    parameters: IParameter[];
}
