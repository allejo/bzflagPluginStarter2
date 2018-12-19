import PluginBuilder from '../../PluginBuilder';
import InitChunk from '../InitChunk';
import { CPPClass } from 'aclovis';
import { codeStyle, multiLineString } from './utilities';
import { getIEventMock } from './mocks/IEventMock';

const tests = [
    {
        desc: 'Init() should render a single slash command registration with nothing else',
        setup: (def: PluginBuilder) => {
            def.addSlashCommand({
                name: 'test',
            });
        },
        expected: `
void TestClass::Init(const char* config)
{
    bz_registerCustomSlashCommand("test", this);
}
        `,
    },
    {
        desc: 'Init() should render plugin events',
        setup: (def: PluginBuilder) => {
            def.addEvent(getIEventMock({ name: 'bz_eSomeEvent' }));
            def.addEvent(getIEventMock({ name: 'bz_eOtherEvent' }));
        },
        expected: `
void TestClass::Init(const char* config)
{
    Register(bz_eSomeEvent);
    Register(bz_eOtherEvent);
}
        `,
    },
];

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

        const chunk = new InitChunk(pluginClass, pluginDef.definition);
        chunk.process();

        const method = pluginClass.getMethods()[chunk.getIdentifier()];
        const output = method.functionDef.write(codeStyle, 0);

        expect(output).toEqual(multiLineString(testDef.expected));
    });
}
