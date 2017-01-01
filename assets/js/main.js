//
// Build the base plug-in structure
//
var plugin = new LanguageClass('SAMPLE_PLUGIN');
    plugin.extendsClass(['public', 'bz_Plugin']);

let constCharName = new LanguageFunction(Visibility.public, 'const char*', 'Name');
let voidInit      = new LanguageFunction(Visibility.public, 'void', 'Init',  [{ returnType: 'const char*',   paramName: 'config' }]);
let voidEvent     = new LanguageFunction(Visibility.public, 'void', 'Event', [{ returnType: 'bz_EventData*', paramName: 'eventData' }]);
let voidCleanup   = new LanguageFunction(Visibility.public, 'void', 'Cleanup');

// Implement default functions
constCharName.implementFunction([
    LanguageHelpers.createLiteral(`return "${plugin.className}";`)
]);

plugin.declareFunction(constCharName);
plugin.declareFunction(voidInit);
plugin.declareFunction(voidCleanup);
plugin.declareFunction(voidEvent);

// Define the SlashCommand function but don't add it by default since it's only needed when slash commands exist
let boolSlashCommand = new LanguageFunction(
    Visibility.public, 'bool', 'SlashCommand', [
        { returnType: 'int', paramName: 'playerID' },
        { returnType: 'bz_ApiString', paramName: 'command' },
        { returnType: 'bz_ApiString', paramName: 'message' },
        { returnType: 'bz_APIStringList', paramName: '*params' }
    ]
);

//
// Build the actual app
//
var bpsApp = new Vue({
    el: '#bpsApp',
    data: {
        pluginName: '',
        pluginAuthor: '',
        pluginLicense: '',
        pluginEvents: [],
        styleIndentation: '4spaces',
        styleEventHandling: 'switch',
        styleBracePlacement: 'newLine',

        codeSettings: {
            indentWithSpaces: true,
            indentSpacesCount: 4,
            bracesOnNewLine: true
        },
        pluginBuilder: plugin,
        pluginClassName: '',
        pluginOutput: ''
    },
    methods: {
        buildPlugin: function () {
            this.pluginOutput = this.pluginBuilder.write(this.codeSettings);
        },
        classifyName: function () {
            if (this.pluginName.trim().length == 0) {
                this.pluginClassName = 'SAMPLE_PLUGIN';
                return;
            }

            var literalNumbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
            this.pluginClassName = this.pluginName.replace(/[^A-Za-z0-9_]/g, '');
            
            if (!isNaN(this.pluginClassName.charAt(0))) {
                this.pluginClassName = literalNumbers[this.pluginClassName.charAt(0)] + this.pluginClassName.substring(1);
            }
        }
    },
    watch: {
        pluginName: function () {
            this.classifyName();
            this.pluginBuilder.className = this.pluginClassName;
            this.buildPlugin();
        },
        styleIndentation: function () {
            if (this.styleIndentation == '2spaces' || this.styleIndentation == '4spaces') {
                this.codeSettings.indentWithSpaces = true;
                this.codeSettings.indentSpacesCount = (this.styleIndentation == '2spaces') ? 2 : 4;
            } else {
                this.codeSettings.indentWithSpaces = false;
            }

            this.buildPlugin();
        },
        styleBracePlacement: function () {
            this.codeSettings.bracesOnNewLine = (this.styleBracePlacement == 'newLine');

            this.buildPlugin();
        }
    }
});

bpsApp.buildPlugin();
