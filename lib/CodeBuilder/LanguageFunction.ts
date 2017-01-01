enum Visibility {
    public,
    protected,
    private
}

interface Parameter {
    returnType: string;
    paramName: string;
    defaultValue?: string;
}

class LanguageFunction implements IWritable {
    private body: IWritable[] = [];
    private parsedParams: string[] = [];

    constructor(
        public visibility: Visibility, public returnType: string, public name: string,
        public parameters: Parameter[] = []
    ) { }

    private buildParameters(): string {
        if (this.parsedParams.length == 0) {
            this.parameters.forEach(element => {
                this.parsedParams.push(`${element.returnType} ${element.paramName}`);
            });
        }

        return this.parsedParams.join(', ');
    }

    implementFunction(body: IWritable[]): void {
        this.body = body;
    }

    appendFunction(body: IWritable | IWritable[]): void {
        if (body instanceof Array) {
            this.body = this.body.concat(body);
        } else {
            this.body.push(body);
        }
    }

    writeSignature(className: string = ''): string {
        let prefix = (className.length) ? `${className}::` : '';

        return `${this.returnType} ${prefix}${this.name} (${this.buildParameters()})`;
    }

    writeImplementation(className: string, options: Formatter): string {
        let codeBlock = new LanguageCodeBlock(
            this.writeSignature(className),
            this.body
        );

        return codeBlock.write(options);
    }

    write(): string {
        return `virtual ${this.returnType} ${this.name} (${this.buildParameters()});`;
    }
}