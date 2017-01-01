class LanguageClass implements IWritable {
    classExtends: [string, string][] = [];
    classFunctions: LanguageFunction[] = [];

    constructor(public className: string) { }

    extendsClass(extension: [string, string]): void {
        this.classExtends.push(extension);
    }

    declareFunction(_function: LanguageFunction): void {
        this.classFunctions.push(_function);
    }

    write(options: FormatableOptions): string {
        let formatter = new Formatter(options);
        let output = this.classDefinition().write(formatter) + ";\n";

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