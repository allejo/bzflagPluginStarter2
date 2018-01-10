interface IPlugin {
    name: string;
    author: string;
    license: ILicense|null;
    events: IPluginEvent[];
    slashCommands: any[];
}
