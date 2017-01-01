interface IWritable {
    write(formatter: Formatter, indentCount: number): string;
}