const vscode = require('vscode');

function activate(context) {
    const provider = vscode.languages.registerCompletionItemProvider(
        { scheme: 'file', language: 'planet' },
        {
            provideCompletionItems(document) {
                const variables = [];
                const varRegex = /var\s+(\w+)/g;

                for (let i = 0; i < document.lineCount; i++) {
                    const lineText = document.lineAt(i).text;
                    let match;
                    while ((match = varRegex.exec(lineText)) !== null) {
                        variables.push(match[1]);
                    }
                }

                const functions = [];
                const defRegex = /def\s+(\w+)/g;

                for (let i = 0; i < document.lineCount; i++) {
                    const lineText = document.lineAt(i).text;
                    let match;
                    while ((match = defRegex.exec(lineText)) !== null) {
                        functions.push(match[1]);
                    }
				}

                const completionItems = [];
                
                const keywords = [
					'var', 'if', 'else', 'elif', 'print', 'while', 'execute', 'def', 'get_data',
					'return', 'import', 'random', 'type', 'round', 'get_score', 'set_score',
					'append', 'del', 'len', 'is_module', 'divide', 'multiply', 'int', 'float',
					'double', 'bool', 'string', 'entity'
				];
                keywords.forEach(keyword => {
                    const item = new vscode.CompletionItem(keyword, vscode.CompletionItemKind.Method);
                    switch (keyword) {
                        case 'if':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `if (\${1|${variables.join(',')}|}) {\n\t$0\n}` 
                                : 'if () {\n\t$0\n}');
                            break;
                        case 'else':
                            item.insertText = new vscode.SnippetString('else {\n\t$0\n}');
                            break;
                        case 'elif':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `else if (\${1|${variables.join(',')}|}) {\n\t$0\n}`
                                : 'else if () {\n\t$0\n}');
                            break;
                        case 'print':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `print(\${1|${variables.join(',')}|})` 
                                : 'print()');
                            break;
                        case 'while':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `while (\${1|${variables.join(',')}|}) {\n\t$0\n}` 
                                : 'while () {\n\t$0\n}');
                            break;
                        case 'execute':
                            item.insertText = new vscode.SnippetString('execute (${1|as,at,unless,if|}) {\n\t$0\n}');
                            break;
                        case 'def':
                            item.insertText = new vscode.SnippetString('def $1() {\n\t$0\n}');
                            break;
                        case 'return':
                            item.insertText = new vscode.SnippetString('return ${1}');
                            break;
                        case 'import':
                            item.insertText = new vscode.SnippetString('import ${1}');
                            break;
						case 'random':
							item.insertText = 'random()';
							break;
						case 'type':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `type(\${1|${variables.join(',')}|})`
                                : 'type()');
							break;
						case 'round':
							item.insertText = new vscode.SnippetString('round($1)');
							break;
						case 'get_score':
							item.insertText = new vscode.SnippetString('get_score("$1", "$2")');
							break;
						case 'set_score':
                            item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `set_score("\$1", "\$2", \${3|${variables.join(',')}|})`
                                : 'set_score("$1", "$2", $3)');
							break;
						case 'get_data':
							item.insertText = new vscode.SnippetString('get_data("$1", "$2", "$3")');
							break;
						case 'append':
							item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `append(\${1|${variables.join(',')}|}, $2)`
                                : 'append($1, $2)');
							break;
						case 'del':
							item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `del(\${1|${variables.join(',')}|})`
                                : 'del($1)');
							break;
						case 'len':
							item.insertText = new vscode.SnippetString(variables.length > 0 
                                ? `len(\${1|${variables.join(',')}|})`
                                : 'len($1)');
							break;
						case 'is_module':
							item.insertText = 'is_module()';
							break;
						case 'divide':
							item.insertText = new vscode.SnippetString('divide($1, $2)');
							break;
						case 'multiply':
							item.insertText = new vscode.SnippetString('multiply($1, $2)');
							break;
						case 'int':
							item.insertText = new vscode.SnippetString('int($1)');
							break;
						case 'float':
							item.insertText = new vscode.SnippetString('float($1)');
							break;
						case 'int':
							item.insertText = new vscode.SnippetString('int($1)');
							break;
						case 'double':
							item.insertText = new vscode.SnippetString('double($1)');
							break;
						case 'bool':
							item.insertText = new vscode.SnippetString('bool($1)');
							break;
						case 'string':
							item.insertText = new vscode.SnippetString('string($1)');
							break;
                        case 'entity':
							item.insertText = new vscode.SnippetString('entity("$1")');
							break;
                    }
                    completionItems.push(item);
                });

                variables.forEach(variable => {
                    const variableCompletion = new vscode.CompletionItem(variable, vscode.CompletionItemKind.Variable);
                    completionItems.push(variableCompletion);
                });

                functions.forEach(func => {
                    const functionCompletion = new vscode.CompletionItem(func, vscode.CompletionItemKind.Function);
                    completionItems.push(functionCompletion);
                });

                return completionItems;
            }
        }
    );

    context.subscriptions.push(provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
