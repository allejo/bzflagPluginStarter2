class LanguageClass implements IWritable {
    classHeader: string[] = [];
    classIncludes: string[] = [];
    classExtends: [string, string][] = [];
    classFunctions: { [name: string]: LanguageFunction; } = {};

    /**
     * @param className The name of the class
     */
    constructor(public className: string) { }

    /**
     * Define a class which this class will extend
     * 
     * @param classExtends A tuple of the visibility and name of the class this class is extending
     */
    addExtends(classExtends: [string, string]): void {
        this.classExtends.push(classExtends);
    }

    /**
     * Remove a parent class this one is extending
     * 
     * @param classExtends A tuple of the visibility and name of the class to no longer extend
     * 
     * @returns True if the deletion was successful
     */
    removeExtends(classExtends: [string, string]): boolean {
        this.classExtends.forEach((element, index) => {
            if (element[0] === classExtends[0] && element[1] === classExtends[1]) {
                this.classExtends.splice(index, 1);
                return true;
            }
        });

        return false;
    }

    /**
     * Add a LanguageFunction to this class
     * 
     * @param classFunction The function that will belong to this class
     */
    declareFunction(classFunction: LanguageFunction): void {
        this.classFunctions[`${classFunction.returnType} ${classFunction.name}`] = classFunction;
    }

    /**
     * Implement the given function. This function call will overwrite any existing contents the function may have
     * 
     * @param returnType The returnType of the function to implement
     * @param name       The name of the function to implement
     * @param body       The contents of the function body
     */
    implementFunction(returnType: string, name: string, body: IWritable[]): void {
        this.classFunctions[`${returnType} ${name}`].implementFunction(body);
    }

    /**
     * Amend the given function
     * 
     * @param returnType The returnType of the function to amend to
     * @param name       The name of the function to amend to
     * @param body       The contents of the function body
     */
    appendFunction(returnType: string, name: string, body: IWritable[]): void {
        this.classFunctions[`${returnType} ${name}`].appendFunction(body);
    }

    /**
     * Remove a given function from this class definition
     * 
     * @param returnType The returnType of the function to delete
     * @param name       The name of the function to delete
     * 
     * @returns True if the deletion was successful
     */
    removeFunction(returnType: string, name: string): boolean {
        let functionSignature = `${returnType} ${name}`;

        if (this.classFunctions.hasOwnProperty(functionSignature)) {
            delete this.classFunctions[functionSignature];
            return true;
        }

        return false;
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
}