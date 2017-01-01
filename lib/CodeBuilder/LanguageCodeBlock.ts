class LanguageCodeBlock implements IWritable {
    functionCall: string = '';
    functionCallParams: any = [];

    constructor(public signature: string, public body: IWritable[]) { }

    write(formatter: Formatter, indentCount: number = 0): string {
        let indent = formatter.indentation.repeat(indentCount);
        let output = this.signature;
        output += (formatter.options.bracesOnNewLine === true ? "\n" + indent : " ") + "{\n";

        for (let element of this.body) {
            let myIndentCnt = indentCount + 1;

            output += formatter.indentation.repeat(myIndentCnt) + element.write(formatter, myIndentCnt) + "\n";
        }

        output += indent + "}"

        return output;
    }
}