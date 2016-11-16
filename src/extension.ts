'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const rootPath = vscode.workspace.rootPath;

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pruga-vscode-builder" is now active!');

    let terminal = vscode.window.createTerminal('pruga-terminal') 
    terminal.show()
    terminal.sendText(`cd ${rootPath}`)

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable_build_all = vscode.commands.registerCommand('pruga.build', () => {
        const config = vscode.workspace.getConfiguration('pruga')
        const SHOW_INFO = `${config.get('showLevel')}` == "info"

        // terminal.sendText(config.get('clean'))
        terminal.sendText(`${config.get('clean')}`)

        const compile = config.get('compile')

        for(let item in compile) {
            terminal.sendText(compile[item])
        }

        const copy = config.get('copy.static')

        for(let item in copy) {
            terminal.sendText(copy[item])
        }

        if(SHOW_INFO) {
            vscode.window.showInformationMessage('Пруга builder: project is build')
        }
        
    });

    let disposable_compile_file = vscode.commands.registerTextEditorCommand('pruga.compile', (editor, editorEdit) => {
        const config = vscode.workspace.getConfiguration('pruga')
        const document = editor.document

        const SHOW_INFO = `${config.get('showLevel')}` == "info"

        document.save()
            .then(
                () => {
                    const key = `compile.${document.languageId}`
                    const command = config.get(key)
                    if(command) {
                        terminal.sendText(`${command}`)
                    }
                    else{
                        vscode.window.showErrorMessage(`Command for ${document.languageId} is not defined.`)
                    }
                    
                }
            )
            .then(
                () => {
                    vscode.commands.executeCommand('pruga.preview', vscode.ViewColumn.Two)
                    .then(
                        success => console.log(`Пруга builder executeCommand pruga.preview OK ${success}.`),
                        // then error
                        err => vscode.window.showErrorMessage(`Пруга builder executeCommand pruga.preview ERROR ${err}.`)
                        )
                }
            )
            .then(
                () => {
                    if(SHOW_INFO) {
                        vscode.window.showInformationMessage(`Пруга builder: project file is compiled`)
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