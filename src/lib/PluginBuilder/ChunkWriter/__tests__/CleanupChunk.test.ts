import PluginBuilder from '../../PluginBuilder';
import { CPPClass } from 'aclovis';
import { codeStyle, multiLineString } from './utilities';
import CleanupChunk from '../CleanupChunk';

let pluginDef: PluginBuilder;
let pluginClass: CPPClass;

beforeEach(() => {
    pluginDef = new PluginBuilder();
    pluginClass = new CPPClass('TestClass');
});

test('add Cleanup() method to plugin class', () => {
    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const methods = Object.keys(pluginClass.getMethods());

    expect(methods).toContain(chunk.getIdentifier());
});

test('render method with just Flush() call', () => {
    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const method = pluginClass.getMethods()[chunk.getIdentifier()];
    const output = method.functionDef.write(codeStyle, 0);
    const expected = multiLineString(`
void TestClass::Cleanup()
{
    Flush();
}
    `);

    expect(output).toEqual(expected);
});

test('render method with Flush() call and slash commands', () => {
    pluginDef.addSlashCommand({
        name: 'ican'
    });
    pluginDef.addSlashCommand({
        name: 'seethefuture'
    });

    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const method = pluginClass.getMethods()[chunk.getIdentifier()];
    const output = method.functionDef.write(codeStyle, 0);
    const expected = multiLineString(`
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomSlashCommand("ican");
    bz_removeCustomSlashCommand("seethefuture");
}
    `);

    expect(output).toEqual(expected);
});

test('render method with Flush() and map objects', () => {
    pluginDef.addMapObject({
        uuid: '',
        name: 'customzone',
        properties: [],
    });

    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const method = pluginClass.getMethods()[chunk.getIdentifier()];
    const output = method.functionDef.write(codeStyle, 0);
    const expected = multiLineString(`
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomMapObject("customzone");
}
    `);

    expect(output).toEqual(expected);
});

test('render method with Flush(), slash commands, and map objects', () => {
    pluginDef.addSlashCommand({
        name: 'command'
    });
    pluginDef.addMapObject({
        uuid: '',
        name: 'customzone',
        properties: [],
    });

    const chunk = new CleanupChunk(pluginClass, pluginDef.definition);
    chunk.process();

    const method = pluginClass.getMethods()[chunk.getIdentifier()];
    const output = method.functionDef.write(codeStyle, 0);
    const expected = multiLineString(`
void TestClass::Cleanup()
{
    Flush();

    bz_removeCustomSlashCommand("command");

    bz_removeCustomMapObject("customzone");
}
    `);

    expect(output).toEqual(expected);
});
