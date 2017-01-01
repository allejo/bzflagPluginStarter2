class LanguageSwitchBlock implements IWritable {
    cases: LanguageSwitchCase[] = [];

    constructor(public condition: string) { }

    addCase(caseStatement: LanguageSwitchCase): void {
        this.cases.push(caseStatement);
    }

    write(formatter: Formatter, indentCount: number = 0): string {
        let signature = `switch (${this.condition})`;
        let codeBlock = new LanguageCodeBlock(signature, this.cases);

        return codeBlock.write(formatter, indentCount);
    }
}