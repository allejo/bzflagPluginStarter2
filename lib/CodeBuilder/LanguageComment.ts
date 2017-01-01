class LanguageComment implements IWritable {
    constructor(public content: string) { }

    write(options: FormatableOptions = {}): string {
        return `// ${this.content}`;
    }
}