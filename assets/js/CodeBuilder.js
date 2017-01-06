var Formatter = (function () {
    function Formatter(options) {
        this.options = options;
        this.indentation = (this.options.indentWithSpaces) ? " ".repeat(this.options.indentSpacesCount) : "\t";
    }
    return Formatter;
}());
var LanguageClass = (function () {
    function LanguageClass(className) {
        this.className = className;
        this.classHeader = [];
        this.classIncludes = [];
        this.classExtends = [];
        this.classFunctions = {};
    }
    LanguageClass.prototype.addExtends = function (classExtends) {
        this.classExtends.push(classExtends);
    };
    LanguageClass.prototype.removeExtends = function (classExtends) {
        var _this = this;
        this.classExtends.forEach(function (element, index) {
            if (element[0] === classExtends[0] && element[1] === classExtends[1]) {
                _this.classExtends.splice(index, 1);
                return true;
            }
        });
        return false;
    };
    LanguageClass.prototype.declareFunction = function (classFunction) {
        this.classFunctions[classFunction.returnType + " " + classFunction.name] = classFunction;
    };
    LanguageClass.prototype.implementFunction = function (returnType, name, body) {
        this.classFunctions[returnType + " " + name].implementFunction(body);
    };
    LanguageClass.prototype.appendFunction = function (returnType, name, body) {
        this.classFunctions[returnType + " " + name].appendFunction(body);
    };
    LanguageClass.prototype.removeFunction = function (returnType, name) {
        var functionSignature = returnType + " " + name;
        if (this.classFunctions.hasOwnProperty(functionSignature)) {
            delete this.classFunctions[functionSignature];
            return true;
        }
        return false;
    };
    LanguageClass.prototype.write = function (options) {
        var output = '';
        var formatter = new Formatter(options);
        output += this.classHeaderContent() + "\n";
        output += this.classIncludeHeaders() + "\n";
        output += this.classDefinition().write(formatter) + ";\n";
        for (var f in this.classFunctions) {
            output += "\n" + this.classFunctions[f].writeImplementation(this.className, formatter) + "\n";
        }
        return output;
    };
    LanguageClass.prototype.classHeaderContent = function () {
        return "/*\n" + this.classHeader.join('') + "*/\n";
    };
    LanguageClass.prototype.classIncludeHeaders = function () {
        var headers = [];
        for (var _i = 0, _a = this.classIncludes; _i < _a.length; _i++) {
            var i = _a[_i];
            headers.push("#include \"" + i + "\"");
        }
        return headers.join("\n") + "\n";
    };
    LanguageClass.prototype.classSignature = function () {
        var classSignature = "class " + this.className;
        if (this.classExtends.length > 0) {
            var classExtensions = [];
            for (var _i = 0, _a = this.classExtends; _i < _a.length; _i++) {
                var e = _a[_i];
                classExtensions.push(e[0] + " " + e[1]);
            }
            classSignature += " : " + classExtensions.join(', ');
        }
        return classSignature;
    };
    LanguageClass.prototype.classDefinition = function () {
        var functions = [];
        for (var k in this.classFunctions) {
            functions.push(this.classFunctions[k]);
        }
        var classBlock = new LanguageCodeBlock(this.classSignature(), functions);
        return classBlock;
    };
    return LanguageClass;
}());
var LanguageCodeBlock = (function () {
    function LanguageCodeBlock(signature, body) {
        this.signature = signature;
        this.body = body;
        this.functionCall = '';
        this.functionCallParams = [];
    }
    LanguageCodeBlock.prototype.write = function (formatter, indentCount) {
        if (indentCount === void 0) { indentCount = 0; }
        var indent = formatter.indentation.repeat(indentCount);
        var output = this.signature;
        output += (formatter.options.bracesOnNewLine === true ? "\n" + indent : " ") + "{\n";
        for (var _i = 0, _a = this.body; _i < _a.length; _i++) {
            var element = _a[_i];
            var myIndentCnt = indentCount + 1;
            output += formatter.indentation.repeat(myIndentCnt) + element.write(formatter, myIndentCnt) + "\n";
        }
        output += indent + "}";
        return output;
    };
    return LanguageCodeBlock;
}());
var LanguageComment = (function () {
    function LanguageComment(content) {
        this.content = content;
    }
    LanguageComment.prototype.write = function (options) {
        if (options === void 0) { options = {}; }
        return "// " + this.content;
    };
    return LanguageComment;
}());
var Visibility;
(function (Visibility) {
    Visibility[Visibility["public"] = 0] = "public";
    Visibility[Visibility["protected"] = 1] = "protected";
    Visibility[Visibility["private"] = 2] = "private";
})(Visibility || (Visibility = {}));
var LanguageFunction = (function () {
    function LanguageFunction(visibility, returnType, name, parameters) {
        if (parameters === void 0) { parameters = []; }
        this.visibility = visibility;
        this.returnType = returnType;
        this.name = name;
        this.parameters = parameters;
        this.body = [];
        this.parsedParams = [];
    }
    LanguageFunction.prototype.buildParameters = function () {
        var _this = this;
        if (this.parsedParams.length == 0) {
            this.parameters.forEach(function (element) {
                _this.parsedParams.push(element.returnType + " " + element.paramName);
            });
        }
        return this.parsedParams.join(', ');
    };
    LanguageFunction.prototype.implementFunction = function (body) {
        this.body = body;
    };
    LanguageFunction.prototype.appendFunction = function (body) {
        if (body instanceof Array) {
            this.body = this.body.concat(body);
        }
        else {
            this.body.push(body);
        }
    };
    LanguageFunction.prototype.writeSignature = function (className) {
        if (className === void 0) { className = ''; }
        var prefix = (className.length) ? className + "::" : '';
        return this.returnType + " " + prefix + this.name + " (" + this.buildParameters() + ")";
    };
    LanguageFunction.prototype.writeImplementation = function (className, options) {
        var codeBlock = new LanguageCodeBlock(this.writeSignature(className), this.body);
        return codeBlock.write(options);
    };
    LanguageFunction.prototype.write = function () {
        return "virtual " + this.returnType + " " + this.name + " (" + this.buildParameters() + ");";
    };
    return LanguageFunction;
}());
var LanguageHelpers = (function () {
    function LanguageHelpers() {
    }
    LanguageHelpers.createString = function (content) {
        return (new WritableObject("\"" + content + "\""));
    };
    LanguageHelpers.createLiteral = function (content) {
        return (new WritableObject(content));
    };
    LanguageHelpers.createComment = function (content) {
        return (new LanguageComment(content));
    };
    LanguageHelpers.createNewLine = function () {
        return (new WritableObject(''));
    };
    LanguageHelpers.createFunctionCall = function (name, params) {
        var functionParameters = [];
        for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
            var p = params_1[_i];
            functionParameters.push((typeof p == "string") ? p : p.write(new Formatter({}), 0));
        }
        return (new WritableObject(name + "(" + functionParameters.join(', ') + ");"));
    };
    return LanguageHelpers;
}());
var LanguageSwitchBlock = (function () {
    function LanguageSwitchBlock(condition) {
        this.condition = condition;
        this.cases = [];
    }
    LanguageSwitchBlock.prototype.addCase = function (caseStatement) {
        this.cases.push(caseStatement);
    };
    LanguageSwitchBlock.prototype.write = function (formatter, indentCount) {
        if (indentCount === void 0) { indentCount = 0; }
        var signature = "switch (" + this.condition + ")";
        var codeBlock = new LanguageCodeBlock(signature, this.cases);
        return codeBlock.write(formatter, indentCount);
    };
    return LanguageSwitchBlock;
}());
var LanguageSwitchCase = (function () {
    function LanguageSwitchCase(condition) {
        this.condition = condition;
    }
    LanguageSwitchCase.prototype.defineBody = function (body) {
        this.body = body;
    };
    LanguageSwitchCase.prototype.write = function (formatter, indentCount) {
        if (indentCount === void 0) { indentCount = 0; }
        var signature = "case " + this.condition + ":";
        var caseBlock = new LanguageCodeBlock(signature, this.body);
        var output = caseBlock.write(formatter, indentCount);
        output += "\n" + formatter.indentation.repeat(indentCount) + "break;";
        return output;
    };
    return LanguageSwitchCase;
}());
var WritableObject = (function () {
    function WritableObject(content) {
        this.content = content;
    }
    WritableObject.prototype.write = function () {
        return this.content;
    };
    return WritableObject;
}());
//# sourceMappingURL=CodeBuilder.js.map