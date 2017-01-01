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
        let output = this.classDefinition(formatter).write(formatter) + ";\n";

        for (let f of this.classFunctions) {
            output += "\n" + f.writeImplementation(this.className, formatter) + "\n";
        }

        return output;
    }

    private classDefinition(formatter: Formatter): LanguageCodeBlock {
        let classBlock = new LanguageCodeBlock(
            this.classSignature(),
            this.classFunctions
        );

        return classBlock;
    }

    private classSignature(): string {
        let classSignature = `class ${this.className}`;

        if (this.classExtends.length > 0) {
            let classExtensions = [];

            this.classExtends.forEach(element => {
                classExtensions.push(`${element[0]} ${element[1]}`);
            });

            classSignature += ` : ${classExtensions.join(', ')}`;
        }

        return classSignature;
    }
}