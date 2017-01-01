class LanguageHelpers {
    public static createString(content: string): IWritable {
        return (new WritableObject(`"${content}"`));
    }

    public static createLiteral(content: string): IWritable {
        return (new WritableObject(content));
    }

    public static createComment(content: string): IWritable {
        return (new LanguageComment(content));
    }

    public static createNewLine(): IWritable {
        return (new WritableObject("\n"));
    }

    public static createFunctionCall(name: string, params: (string | IWritable)[]): IWritable {
        let functionParameters = [];

        for (let p of params) {
            functionParameters.push((typeof p == "string") ? p : p.write(new Formatter({}), 0));
        }

        return (new WritableObject(`${name}(${functionParameters.join(', ')});`));
    }
}