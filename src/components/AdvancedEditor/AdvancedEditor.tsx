import React, { useState, useRef, useEffect, JSX } from 'react';
import { MouseOverlay } from './MouseOverlay/MouseOverlay';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import { Resizable } from 're-resizable';
import * as monaco from 'monaco-editor';
import { getFileIcon } from './FileIcons/FileIcons';
import { Terminal } from './Terminal/Terminal';
import Monokai from "monaco-themes/themes/Monokai.json";
import { GUIMode, IAction, ICourse, IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';

interface AdvancedEditorProps {
  mode: GUIMode;
  course: ICourse
  actions: Array<IAction>;
  currentActionIndex?: number; // used for step mode
}

// use local static files
loader.config({ paths: { vs: "/vs" } });

export function AdvancedEditor(props: AdvancedEditorProps) {
  const { mode, course, actions, currentActionIndex } = props;
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>(undefined);
  const [sidebarWidth, setSidebarWidth] = useState(250);

  const readOnly = mode === 'step' || mode === 'replay';
  const primaryLanguage = course.primaryLanguage;

  // codevideo-virtual-ide can get us the current code from the actions
  const virtualIDE = new VirtualIDE({withInitialTerminal: true, withInitialAuthor: true});
  virtualIDE.applyActions(actions);
  const courseSnapshot = virtualIDE.getCourseSnapshot();

  // for the file explorer
  const fileStructure = courseSnapshot.editorSnapshot.fileStructure;

  // for the editors
  const openFiles = courseSnapshot.editorSnapshot.openFiles;
  const currentFile = courseSnapshot.editorSnapshot.currentFile
  const currentCode = virtualIDE.getFileContents(currentFile || '');
  const currentCaretPosition = courseSnapshot.editorSnapshot.currentCaretPosition;
  const currentHighlightCoordinates = courseSnapshot.editorSnapshot.currentHighlightCoordinates;

  // for the caption overlay
  const captionText = courseSnapshot.authorSnapshot.currentSpeechCaption;

  const handleEditorDidMount = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoEditorRef.current = editor;

    // Set the model with the current code and language
    const model = monaco.editor.createModel(
      currentCode,
      primaryLanguage
    );
    editor.setModel(model);

    // Ensure theme is applied after a short delay
    monaco.editor.defineTheme(
      "Monokai",
      Monokai as monaco.editor.IStandaloneThemeData
    );
    setTimeout(() => {
      monaco.editor.setTheme('Monokai');
    }, 1);
  };

  // caret position effect
  useEffect(() => {
    if (monacoEditorRef.current) {
      monacoEditorRef.current.setPosition({
        lineNumber: currentCaretPosition.row,
        column: currentCaretPosition.col
      });

      monacoEditorRef.current.revealPositionInCenter({
        lineNumber: currentCaretPosition.row,
        column: currentCaretPosition.col
      });
    }
  }, [currentCaretPosition]);

  // highlight effect
  useEffect(() => {
    if (monacoEditorRef.current && currentHighlightCoordinates) {
      monacoEditorRef.current.createDecorationsCollection([
        {
          range: new monaco.Range(
            currentHighlightCoordinates.start.row,
            currentHighlightCoordinates.start.col,
            currentHighlightCoordinates.end.row,
            currentHighlightCoordinates.end.col
          ),
          options: { inlineClassName: 'highlighted-code' }
        }
      ]);
    }
  }, [currentHighlightCoordinates]);


  const renderFileTree = (structure: IFileStructure, path: string = ''): JSX.Element[] => {
    return Object.entries(structure).map(([name, item]) => {
      const fullPath = path ? `${path}/${name}` : name;
      const isDirectory = item.type === 'directory';

      return (
        <div key={fullPath} className="ml-4">
          <div
            className={`flex items-center gap-2 p-1 rounded hover:bg-slate-700 cursor-pointer ${currentFile === fullPath ? 'bg-slate-700' : ''
              }`}
          >
            <span className="text-slate-400">
              {isDirectory ? '📁' : getFileIcon(name)}
            </span>
            <span className="text-slate-200">{name}</span>
          </div>
          {isDirectory && item.children && renderFileTree(item.children, fullPath)}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-lg overflow-hidden relative">
      <MouseOverlay mouseVisible={true} actions={actions} actionIndex={currentActionIndex} fileStructure={fileStructure} />
      {/* Tabs */}
      <div className="flex border-b border-slate-700 bg-slate-900">
        {openFiles.map(file => (
          <div
            key={file}
            className={`flex items-center px-4 py-2 border-r border-slate-700 cursor-pointer ${currentFile === file ? 'bg-slate-800' : 'bg-slate-900'
              }`}

          >
            <span className="text-slate-300">{file.split('/').pop()}</span>
            <button
              className="ml-2 text-slate-500 hover:text-slate-300"

            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex flex-1 flex-col">
        <div className='flex flex-1'>
          {/* File Tree Sidebar */}
          <div>
            <Resizable
              size={{ width: sidebarWidth, height: '100%' }}
              onResizeStop={(e, direction, ref, d) => {
                setSidebarWidth(sidebarWidth + d.width);
              }}
              minWidth={200}
              maxWidth={400}
              enable={{ right: true }}
            >
              <div className="h-full border-r border-slate-600">
                <div className="p-4 border-b border-slate-600">
                  <h3 className="text-slate-200 font-semibold">Explorer</h3>
                </div>
                <div className="p-2">{renderFileTree(fileStructure)}</div>
              </div>
            </Resizable>
          </div>

          {/* Editor */}
          <div className="flex-1 relative">
            <Editor
              value={readOnly ? currentCode : undefined}
              defaultLanguage={primaryLanguage}
              options={{
                automaticLayout: true,
                minimap: { enabled: true },
                scrollBeyondLastLine: false,
                fontSize: 14,
                fontFamily: 'Fira Code, monospace',
                fontLigatures: true,
                readOnly,
                lineNumbers: 'on',
                renderWhitespace: 'selection',
                bracketPairColorization: { enabled: true },
                matchBrackets: 'never',
                formatOnPaste: true,
                formatOnType: true
              }}
              onMount={handleEditorDidMount}
            />

            {/* Caption Overlay */}
            {captionText && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-black bg-opacity-75 text-white">
                <div className="container mx-auto max-w-4xl">
                  <p className="text-lg leading-relaxed">{captionText}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-[#1e1e1e] border-t border-gray-700 h-[150px]">
        <div className="flex items-center justify-between p-1 bg-[#252526] border-b border-gray-700">
          <span className="text-gray-300 text-sm px-2">Terminal</span>
        </div>
        <Terminal
          className="h-full" actions={actions} actionIndex={currentActionIndex} />
      </div>
    </div>
  );
}

export default AdvancedEditor;
