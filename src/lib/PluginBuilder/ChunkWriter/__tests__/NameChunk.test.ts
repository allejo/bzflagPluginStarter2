import NameChunk from '../NameChunk';
import PluginBuilder from '../../PluginBuilder';
import { CPPClass } from 'aclovis';
import { codeStyle, multiLineString } from './utilities';

let pluginDef: PluginBuilder;
let pluginClass: CPPClass;

beforeEach(() => {
    pluginDef = new PluginBuilder();
    pluginClass = new CPPClass('TestClass');
});

test('NameChunk creates Name() method in given CPPClass instance', () => {
    const chunk = new NameChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const methods = pluginClass.getMethods();
    const methodSigs = Object.keys(methods);

    expect(methodSigs).toContain('const char* Name()');
});

test('NameChunk creates Name() method returning human-friendly name', () => {
    pluginDef.definition.name = 'Plugin Name With Spaces';

    const chunk = new NameChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const methods = pluginClass.getMethods();
    const nameFxn = methods['const char* Name()'];

    const output = nameFxn.functionDef.write(codeStyle, 0);

    expect(output).toContain(`return "${pluginDef.definition.name}";`);
});

test('NameChunk creates Name() method with correct code', () => {
    const chunk = new NameChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const methods = pluginClass.getMethods();
    const nameFxn = methods['const char* Name()'];

    const output = nameFxn.functionDef.write(codeStyle, 0);
    const expected = multiLineString(`
const char* TestClass::Name()
{
    return "Sample Plugin";
}
    `);

    expect(output).toEqual(expected);
});
