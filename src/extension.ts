'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

let config = vscode.workspace.getConfiguration('pruga')

const SHOW_INFORMATION_MESSAGE = config["showInformationMessage"] || false

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pruga-vscode-builder" is now active!');

    const projectPath: string = vscode.workspace.rootPath
    let terminal = vscode.window.createTerminal('pruga-terminal') 
    terminal.show()
    terminal.sendText(`cd ${projectPath}`)

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable_build_all = vscode.commands.registerCommand('pruga.build', () => {
        terminal.sendText(`npm run clean`)
        terminal.sendText(`npm run compile-typescript`)
        terminal.sendText(`npm run compile-php`)
        terminal.sendText(`npm run compile-elm`)
        terminal.sendText(`cp ./src/favicon.ico ./build/dev/favicon.ico`)

        if(SHOW_INFORMATION_MESSAGE) {
            vscode.window.showInformationMessage('Пруга: project is build')
        }
        
    });

    let disposable_compile_file = vscode.commands.registerTextEditorCommand('pruga.compile', (editor, editorEdit) => {
        const document = editor.document

        document.save()
            .then(
                () => {
                    terminal.sendText(`npm run compile-${document.languageId}`)
                }
            )
            .then(
                () => {
                    vscode.commands.executeCommand('pruga.preview', vscode.ViewColumn.Two)
                    // vscode.commands.executeCommand('vscode.previewHtml', `http://localhost/${path.basename(rootPath)}`, vscode.ViewColumn.Two)
                    // vscode.commands.executeCommand('vscode.previewHtml', previewUri, vscode.ViewColumn.Two)
                    .then(
                        success => console.log(`Пруга executeCommand pruga.preview OK ${success}.`),
                        // then error
                        err => vscode.window.showErrorMessage(`Пруга executeCommand pruga.preview ERROR ${err}.`)
                        )
                }
            )
            .then(
                () => {
                    if(SHOW_INFORMATION_MESSAGE) {
                        vscode.window.showInformationMessage(`Пруга: project file is compiled`)
                    }
                }
            )
            
        
    });

    context.subscriptions.push(disposable_build_all);
    context.subscriptions.push(disposable_compile_file);
}

// this method is called when your extension is deactivated
export function deactivate() {
}