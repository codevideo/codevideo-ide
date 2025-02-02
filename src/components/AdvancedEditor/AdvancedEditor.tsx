import React, { useState, useRef, useEffect, JSX } from 'react';
import { MouseOverlay } from './MouseOverlay/MouseOverlay';
import Editor, { Monaco, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import { Terminal } from './Terminal/Terminal';
import Monokai from "monaco-themes/themes/Monokai.json";
import { GUIMode, IAction, ICourse, IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { VirtualIDE } from '@fullstackcraftllc/codevideo-virtual-ide';
import { debounce } from '../../utils/debounce';
import { FileExplorer } from './FileExplorer';

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
  const virtualIDE = new VirtualIDE({ withInitialTerminal: true, withInitialAuthor: true });
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

  // resize observer needs to be in its own useEffect or we get infinite resizing when consumed
  useEffect(() => {
    if (!monacoEditorRef.current) return;
    
    const resizeObserver = new ResizeObserver(debounce(() => {
      if (monacoEditorRef.current) {
        monacoEditorRef.current.layout();
      }
    }, 100));
  
    const editorElement = monacoEditorRef.current.getDomNode();
    if (editorElement) {
      resizeObserver.observe(editorElement);
    }
  
    return () => {
      resizeObserver.disconnect();
    };
  }, []);


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
          {/* File Explorer */}
          <FileExplorer currentFile={currentFile} fileStructure={fileStructure}/>

          {/* Editor */}
          <div className="flex-1 relative">
            <Editor
              value={readOnly ? currentCode : undefined}
              defaultLanguage={primaryLanguage}
              options={{
                automaticLayout: false,
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
      {/* Terminal */}
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
