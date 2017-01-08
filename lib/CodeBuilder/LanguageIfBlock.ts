class LanguageIfBlock implements IWritable {
    conditions: { [condition: string]: IWritable[]} = {};
    elseCondition: IWritable[] = [];

    constructor() {}

    addCondition(condition: string, body: IWritable[]): void {
        this.conditions[condition] = body;
    }

    defineElseCondition(body: IWritable[]): void {
        this.elseCondition = body;
    }

    write(formatter: Formatter, indentCount: number = 0): string {
        let ifBlocks: LanguageCodeBlock[] = [];
        let first: boolean = true;
        
        for (let condition in this.conditions) {
            let signature = `if (${condition})`;

            if (!first) {
                signature = 'else ' + signature;
            }

            ifBlocks.push(new LanguageCodeBlock(signature, this.conditions[condition]));
            first = false;
        }

        if (this.elseCondition.length > 0) {
            ifBlocks.push(new LanguageCodeBlock('else', this.elseCondition));
        }

        let output: string = '';

        ifBlocks.forEach(element => {
            output += element.write(formatter, indentCount) + "\n" + formatter.indentation.repeat(indentCount);
        });

        return output.trim();
    }
}