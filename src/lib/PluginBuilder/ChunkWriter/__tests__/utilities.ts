import { CPPFormatter } from 'aclovis';

export const codeStyle: CPPFormatter = new CPPFormatter({
    bracesOnNewLine: true,
    indentWithSpaces: true,
    indentSpaceCount: 4,
});

export function multiLineString(line: string): string {
    return line.replace(/^\n|[\s\n]+$/g, '');
}
