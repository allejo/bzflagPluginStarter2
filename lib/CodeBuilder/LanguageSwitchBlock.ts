class LanguageSwitchBlock implements IWritable {
    cases: LanguageSwitchCase[] = [];
    default: IWritable[] = [];

    constructor(public condition: string) { }

    addCase(caseStatement: LanguageSwitchCase): void {
        this.cases.push(caseStatement);
    }

    defineDefault(body: IWritable[]) {
        this.default = body;
    }

    write(formatter: Formatter, indentCount: number = 0): string {
        let signature = `switch (${this.condition})`;
        let switchBody: IWritable[] = this.cases.slice();

        if (this.default.length == 0) {
            switchBody.push(LanguageHelpers.createLiteral('default: break;'));
        } else {
            let defaultBlock = new LanguageSwitchCase('');
                defaultBlock.defineBody(this.default);
            
            switchBody.push(defaultBlock);
        }

        let codeBlock = new LanguageCodeBlock(signature, switchBody);

        return codeBlock.write(formatter, indentCount);
    }
}