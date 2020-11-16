// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const natural = require('natural');
const stopword = require('stopword');
const cp = require('child_process');

// var searchString;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	vscode.commands.registerCommand('stackoverflowextension.start', function() {
		const panel = vscode.window.createWebviewPanel('mainpage', 'Search Engine', vscode.ViewColumn.One, {enableScripts: true});
		const pathhtml = vscode.Uri.file(path.join(context.extensionPath, 'app.html'));
		const currentPath = vscode.Uri.file(path.join(context.extensionPath)).path;
		panel.webview.html = fs.readFileSync(pathhtml.fsPath, 'utf-8');
			
		
		panel.webview.onDidReceiveMessage(message => {
			switch(message.command)
			{
				case 'alert':
					MainFunction(message.text, currentPath);
					vscode.window.showErrorMessage(message.text);
					return;
				}
			});
		panel.webview.postMessage({ command: 'refactor' });

	});

}

// Could not use spacy
/**
 * @param {string} message
 * @param {string} currentPath
 */
function MainFunction(message, currentPath)
{	
	const tokeniser = new natural.WordTokenizer();
	var tokens = tokeniser.tokenize(message);
	for(var i=0;i<tokens.length;i++)
	{
		// Got lower case tokens
		// Punctuations already removed
		tokens[i] = tokens[i].toLowerCase();
	}

	// To remove stopwords
	const afterremovingstopwords = stopword.removeStopwords(tokens);
	console.log(afterremovingstopwords);

	// TODO: Add condition for python3 or python
	// CMD: python_script/bin/python3 script.py afterremovingstopwords currentpath
	cp.exec(currentPath + '/python_script/bin/python3 ' + currentPath + '/python_script/script.py ' + afterremovingstopwords + " " + currentPath, (err, stdout, _) => {

		if (err) {
			console.log('error: ' + err);
		}
		else
		{
			console.log('data:', stdout);
		}

	});

}


exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}