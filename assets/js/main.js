//
// Prepare our application by fetching necessary data
//
var bzEvents = {};
var licenses = {};
$.when(
    $.ajax('/bzflagPluginStarter2/data/events.json').done(function (data) {
        bzEvents = data;
    }),
    $.ajax('/bzflagPluginStarter2/data/licenses.json').done(function (data) {
        licenses = data;
    })
).then(function () {
    bpsApp.buildLicenseHeader();
})


//
// Build the base plug-in structure
//
var plugin = new LanguageClass('SAMPLE_PLUGIN');
    plugin.addExtends(['public', 'bz_Plugin']);
    plugin.classIncludes = ['bzfsAPI.h', 'plugin_utils.h'];

let constCharName = new LanguageFunction(Visibility.public, 'const char*', 'Name');
let voidInit      = new LanguageFunction(Visibility.public, 'void', 'Init',  [{ returnType: 'const char*',   paramName: 'config' }]);
let voidEvent     = new LanguageFunction(Visibility.public, 'void', 'Event', [{ returnType: 'bz_EventData*', paramName: 'eventData' }]);
let voidCleanup   = new LanguageFunction(Visibility.public, 'void', 'Cleanup');

// Implement default functions
constCharName.implementFunction([
    LanguageHelpers.createLiteral(`return "${plugin.className}";`)
]);

voidCleanup.implementFunction([
    LanguageHelpers.createFunctionCall('Flush', [])
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
        { returnType: 'bz_ApiString', paramName: '/*message*/' },
        { returnType: 'bz_APIStringList', paramName: '*params' }
    ]
);

//
// Generic helper functions
//
function maxLength (objectArray, key) {
    return Enumerable.From(objectArray)
        .OrderByDescending(function (x) { return x[key].length; })
        .Select(function (x) { return x[key].length; })
        .First();
}

function stringPad (string, charLimit) {
    var spacesRemaining = charLimit - string.length + 1;
    
    return string + ' '.repeat(spacesRemaining);
}

//
// Build the actual app
//
var bpsApp = new Vue({
    el: '#bpsApp',
    data: {
        pluginName: '',
        pluginAuthor: '',
        pluginLicense: 'MIT',
        pluginEvents: [],
        styleIndentation: '4spaces',
        styleEventHandling: 'switch',
        styleBracePlacement: 'newLine',
        disableDocs: false,
        disableComments: false,
        newSlashCommand: '',

        codeSettings: {
            indentWithSpaces: true,
            indentSpacesCount: 4,
            bracesOnNewLine: true
        },
        pluginBuilder: plugin,
        pluginClassName: 'SAMPLE_PLUGIN',
        pluginEventsSorted: [],
        pluginEventsCache: {},
        pluginSlashCommands: [],
        pluginSlashCommandsConfigured: false
    },
    methods: {
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
        },
        buildLicenseHeader: function () {
            var author  = (this.pluginAuthor.length == 0) ? 'John Doe' : this.pluginAuthor;
            var license = licenses[this.pluginLicense];
            var header  = license.header
                .replace('{year}', new Date().getFullYear())
                .replace('{author}', author)
                .replace('{name}', this.pluginName);

            this.pluginBuilder.classHeader = [header + "\n\n"];
            this.pluginBuilder.classHeader = this.pluginBuilder.classHeader.concat(license.content);
        },
        buildEventBlock: function (eventName) {
            var event = bzEvents[eventName];
            var block = [LanguageHelpers.createLiteral(
                event['dataType'] + ' *' + event['variable'] + ' = (' + event['dataType'] + '*)eventData;'
            )];
            var docBlock = [];

            if (!this.disableDocs) {
                if (this.pluginEventsCache.hasOwnProperty(eventName)) {
                    docBlock = this.pluginEventsCache[eventName];
                } else {
                    docBlock.push(LanguageHelpers.createNewLine());
                    docBlock.push(new LanguageComment('Data'));
                    docBlock.push(new LanguageComment('----'));

                    var dataTypeLength = maxLength(event.parameters, 'dataType');
                    var varNameLength  = maxLength(event.parameters, 'name');

                    for (var p = 0; p < event.parameters.length; p++) {
                        var dataType = stringPad('(' + event.parameters[p]['dataType'] + ')', dataTypeLength + 2);
                        var varName  = stringPad(event.parameters[p]['name'], varNameLength);

                        docBlock.push(new LanguageComment(
                            dataType + varName + '- ' + event.parameters[p]['description']
                        ));
                    }

                    // Cache the result
                    this.pluginEventsCache[eventName] = docBlock;
                }
            }

            return block.concat(docBlock);
        },
        buildInitFunction: function () {
            var initBody = [];

            this.pluginEventsSorted.forEach(function (event) {
                initBody.push(LanguageHelpers.createFunctionCall('Register', [event]));
            });

            if (this.pluginSlashCommands.length > 0) {
                if (this.pluginEventsSorted.length > 0) {
                    initBody.push(LanguageHelpers.createNewLine());
                }

                this.pluginSlashCommands.forEach(function (command) {
                    initBody.push(LanguageHelpers.createFunctionCall('bz_registerCustomSlashCommand', [
                        LanguageHelpers.createString(command),
                        'this'
                    ]));
                });
            }

            this.pluginBuilder.implementFunction('void', 'Init', initBody);
        },
        buildCleanupFunction: function () {
            var cleanupBody = [LanguageHelpers.createFunctionCall('Flush', [])];

            if (this.pluginSlashCommands.length > 0) {
                cleanupBody.push(LanguageHelpers.createNewLine());

                this.pluginSlashCommands.forEach(function (command) {
                    cleanupBody.push(LanguageHelpers.createFunctionCall('bz_removeCustomSlashCommand', [
                        LanguageHelpers.createString(command)
                    ]));
                });
            }

            this.pluginBuilder.implementFunction('void', 'Cleanup', cleanupBody);
        },
        buildEventFunction: function () {
            var eventBlock = [];

            if (this.pluginEvents.length !== 0) {
                var block = new LanguageSwitchBlock('eventData->eventType');

                this.pluginEventsSorted.forEach(function (eventName) {
                    var event = bzEvents[eventName];
                    var eventCase = new LanguageSwitchCase(event.name);
                    
                    eventCase.defineBody(this.buildEventBlock(event.name));
                    block.addCase(eventCase);
                }.bind(this));

                eventBlock.push(block);
            }

            this.pluginBuilder.implementFunction('void', 'Event', eventBlock);
        },
        addSlashCommand: function () {
            var value = this.newSlashCommand;

            if (!value) {
                return;
            }

            if (this.pluginSlashCommands.indexOf(value) >= 0) {
                return;
            }

            this.pluginSlashCommands.push(value);
            this.newSlashCommand = '';
        },
        removeSlashCommand: function (command) {
            this.pluginSlashCommands.splice(this.pluginSlashCommands.indexOf(command), 1);
        }
    },
    computed: {
        pluginOutput: function () {
            let pluginBody = this.pluginBuilder.write(this.codeSettings);
                pluginBody = pluginBody.replace('};', "};\n\nBZ_PLUGIN(" + this.pluginClassName + ")");

            return pluginBody;
        }
    },
    watch: {
        pluginName: function () {
            this.classifyName();
            this.pluginBuilder.className = this.pluginClassName;

            // Copyright headers for GPL licenses require the project name
            if (this.pluginLicense.includes('GPL')) {
                this.buildLicenseHeader();
            }

            // Update plug-in name in code
            var pluginName = (this.pluginName.length == 0) ? 'SAMPLE_PLUGIN' : this.pluginName;

            this.pluginBuilder.implementFunction('const char*', 'Name', [
                LanguageHelpers.createLiteral('return "' + pluginName + '";')
            ]);
        },
        pluginAuthor: function () {
            this.buildLicenseHeader();
        },
        pluginLicense: function () {
            this.buildLicenseHeader()
        },
        pluginEvents: function () {
            // Duplicate the array since sorting the original will cause an endless loop due to Vue's watch functionality
            this.pluginEventsSorted = this.pluginEvents.slice();
            this.pluginEventsSorted.sort();

            this.buildInitFunction();
            this.buildEventFunction();
        },
        pluginSlashCommands: function () {
            // No more slash commands exist, so remove that setup
            if (this.pluginSlashCommands.length == 0) {
                this.pluginBuilder.removeExtends(['public', 'bz_CustomSlashCommandHandler']);
                this.pluginBuilder.removeFunction('bool', 'SlashCommand');
                this.pluginSlashCommandsConfigured = false;
            } else if (!this.pluginSlashCommandsConfigured && this.pluginSlashCommands.length == 1) {
                this.pluginBuilder.addExtends(['public', 'bz_CustomSlashCommandHandler']);
                this.pluginBuilder.declareFunction(boolSlashCommand);
                this.pluginSlashCommandsConfigured = true;
            }

            this.buildInitFunction();
            this.buildCleanupFunction();
        },
        styleIndentation: function () {
            if (this.styleIndentation == '2spaces' || this.styleIndentation == '4spaces') {
                this.codeSettings.indentWithSpaces = true;
                this.codeSettings.indentSpacesCount = (this.styleIndentation == '2spaces') ? 2 : 4;
            } else {
                this.codeSettings.indentWithSpaces = false;
            }
        },
        styleBracePlacement: function () {
            this.codeSettings.bracesOnNewLine = (this.styleBracePlacement == 'newLine');
        },
        disableDocs: function() {
            this.buildEventFunction();
        }
    }
});

//
// Let's enable `position: sticky`
//
var stickyElements = document.getElementsByClassName('js-sticky');

for (var i = stickyElements.length - 1; i >= 0; i--) {
    Stickyfill.add(stickyElements[i]);
}

//
// Initialize Foundation
//
$(document).foundation();
