class LanguageClass implements IWritable {
    classHeader: string[] = [];
    classIncludes: string[] = [];
    classExtends: [string, string][] = [];
    classFunctions: { [name: string]: LanguageFunction; } = {};

    constructor(public className: string) { }

    extendsClass(extension: [string, string]): void {
        this.classExtends.push(extension);
    }

    declareFunction(_function: LanguageFunction): void {
        this.classFunctions[`${_function.returnType} ${_function.name}`] = _function;
    }

    implementFunction(returnType: string, name: string, body: IWritable[]): void {
        this.classFunctions[`${returnType} ${name}`].implementFunction(body);
    }

    appendFunction(returnType: string, name: string, body: IWritable[]): void {
        this.classFunctions[`${returnType} ${name}`].appendFunction(body);
    }

    removeFunction(returnType: string, name: string): void {
        delete this.classFunctions[`${returnType} ${name}`];
    }

    write(options: FormatableOptions): string {
        let output = '';
        let formatter = new Formatter(options);

        output += this.classHeaderContent() + "\n";
        output += this.classIncludeHeaders() + "\n";
        output += this.classDefinition().write(formatter) + ";\n";

        for (let f in this.classFunctions) {
            output += "\n" + this.classFunctions[f].writeImplementation(this.className, formatter) + "\n";
        }

        return output;
    }

    private classDefinition(): LanguageCodeBlock {
        let functions = [];

        for (let k in this.classFunctions) {
            functions.push(this.classFunctions[k]);
        }

        let classBlock = new LanguageCodeBlock(
            this.classSignature(),
            functions
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