import InitChunk from '../InitChunk';
import PluginBuilder from '../../PluginBuilder';
import { ITestCodeDefinition, ITestCodeDefinitionRepeater } from '../../__tests__/utilities';
import { getIEventMock } from '../../__tests__/mocks/IEventMock';

const tests: ITestCodeDefinition[] = [
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

ITestCodeDefinitionRepeater((c, d) => new InitChunk(c, d), tests);
