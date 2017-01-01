interface FormatableOptions {
    indentWithSpaces?: boolean;
    indentSpacesCount?: number;
    bracesOnNewLine?: boolean;
}

class Formatter {
    readonly indentation: string;

    constructor(readonly options: FormatableOptions) {
        this.indentation = (this.options.indentWithSpaces) ? " ".repeat(this.options.indentSpacesCount) : "\t";
    }
}