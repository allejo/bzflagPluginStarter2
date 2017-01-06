class LanguageSwitchCase implements IWritable {
    private body: IWritable[];

    constructor(public condition: string) { }

    defineBody(body: IWritable[]): void {
        this.body = body;
    }

    write(formatter: Formatter, indentCount: number = 0): string {
        let signature = (this.condition.length == 0) ? 'default:' : `case ${this.condition}:`;
        let caseBlock = new LanguageCodeBlock(signature, this.body);
        let output = caseBlock.write(formatter, indentCount);
        output += "\n" + formatter.indentation.repeat(indentCount) + "break;"

        return output;
    }
}