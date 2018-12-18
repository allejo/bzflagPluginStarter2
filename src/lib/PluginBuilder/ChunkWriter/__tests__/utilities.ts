export function multiLineString(line: string) {
    return line.replace(/^\n|[\s\n]+$/g, '');
}
