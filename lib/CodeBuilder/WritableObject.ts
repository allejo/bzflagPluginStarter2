class WritableObject implements IWritable {
    private content: string;

    constructor(content: string) {
        this.content = content;
    }

    write(): string {
        return this.content;
    }
}