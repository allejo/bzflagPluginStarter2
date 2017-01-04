class LanguageClass implements IWritable {
    classHeader: string[] = [];
    classIncludes: string[] = [];
    classExtends: [string, string][] = [];
    classFxnNames: any = {};
    classFunctions: LanguageFunction[] = [];

    constructor(public className: string) { }

    extendsClass(extension: [string, string]): void {
        this.classExtends.push(extension);
    }

    declareFunction(_function: LanguageFunction): void {
        let index = this.classFunctions.push(_function);
        this.classFxnNames[`${_function.returnType} ${_function.name}`] = index - 1;
    }

    implementFunction(returnType: string, name: string, body: IWritable[]): void {
        let fxnIndex = this.classFxnNames[`${returnType} ${name}`];
        this.classFunctions[fxnIndex].implementFunction(body);
    }

    appendFunction(returnType: string, name: string, body: IWritable[]): void {
        let fxnIndex = this.classFxnNames[`${returnType} ${name}`];
        this.classFunctions[fxnIndex].appendFunction(body);
    }

    write(options: FormatableOptions): string {
        let output = '';
        let formatter = new Formatter(options);

        output += this.classHeaderContent() + "\n";
        output += this.classIncludeHeaders() + "\n";
        output += this.classDefinition().write(formatter) + ";\n";

        for (let f of this.classFunctions) {
            output += "\n" + f.writeImplementation(this.className, formatter) + "\n";
        }

        return output;
    }

    private classDefinition(): LanguageCodeBlock {
        let classBlock = new LanguageCodeBlock(
            this.classSignature(),
            this.classFunctions
        );

        return classBlock;
    }

    private classHeaderContent(): string {
        return `/*\n${this.classHeader.join('')}*/\n`;
    }

    private classIncludeHeaders(): string {
        let headers: string[] = [];

        for (let i of this.classIncludes) {
            headers.push(`#include "${i}"`);
        }

        return headers.join("\n") + "\n";
    }

    private classSignature(): string {
        let classSignature = `class ${this.className}`;

        if (this.classExtends.length > 0) {
            let classExtensions: string[] = [];

            for (let e of this.classExtends) {
                classExtensions.push(`${e[0]} ${e[1]}`)
            }

            classSignature += ` : ${classExtensions.join(', ')}`;
        }

        return classSignature;
    }
}