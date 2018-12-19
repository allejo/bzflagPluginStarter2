import { ChunkWriter } from '../ChunkWriter';
import { CPPClass, CPPFormatter } from 'aclovis';
import PluginBuilder from '../../PluginBuilder';
import IPlugin from '../../IPlugin';

export interface ITestCodeDefinition {
    desc: string;
    setup: (def: PluginBuilder) => void;
    expected: string;
}

export const codeStyle: CPPFormatter = new CPPFormatter({
    bracesOnNewLine: true,
    indentWithSpaces: true,
    indentSpaceCount: 4,
});

export function multiLineString(line: string): string {
    return line.replace(/^\n|[\s\n]+$/g, '');
}

export const ITestCodeDefinitionRepeater = (
    chunkType: (c: CPPClass, d: IPlugin) => ChunkWriter,
    tests: ITestCodeDefinition[]
): void => {
    let pluginDef: PluginBuilder;
    let pluginClass: CPPClass;

    beforeEach(() => {
        pluginDef = new PluginBuilder();
        pluginClass = new CPPClass('TestClass');
    });

    for (let i = 0; i < tests.length; i++) {
        const testDef = tests[i];

        test(testDef.desc, () => {
            testDef.setup(pluginDef);

            const chunk = chunkType(pluginClass, pluginDef.definition);
            chunk.process();

            const method = pluginClass.getMethods()[chunk.getIdentifier()];
            const output = method.functionDef.write(codeStyle, 0);

            expect(output).toEqual(multiLineString(testDef.expected));
        });
    }
};
