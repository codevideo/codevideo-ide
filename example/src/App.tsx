import React, { useState } from 'react';
import { IDE } from "@fullstackcraftllc/codevideo-ide"
import { IAction } from '@fullstackcraftllc/codevideo-types';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';

const tutorialActions: IAction[] = [
  // Initial setup explanation
  {
    name: "author-speak-before",
    value: "Today, we're going to learn about how to use the console.log function in JavaScript."
  },
  {
    name: "author-speak-before",
    value: "Let's first create a src folder."
  },
  {
    name: "file-explorer-create-folder",
    value: "src"
  },
  {
    name: "author-speak-before",
    value: "and now let's create a hello-world.js file inside it."
  },
  {
    name: "file-explorer-create-file",
    value: "src/hello-world.js"
  },

  // Opening and editing the first file
  {
    name: "author-speak-before",
    value: "Let's open up hello-world.js now..."
  },
  {
    name: "file-explorer-open-file", // how to constitute with 'click-filename'?
    value: "src/hello-world.js"
  },
  {
    name: "mouse-click-editor",
    value: "1"
  },
  {
    name: "editor-type",
    value: "console.log('Hello, world!');"
  },
  {
    name: "editor-save",
    value: "1"
  },

  // Terminal operations
  {
    name: "author-speak-before",
    value: "Now we'll open up a terminal and run this file."
  },
  {
    name: "terminal-open",
    value: "1"
  },
  {
    name: "mouse-click-terminal",
    value: "1"
  },
  {
    name: "terminal-type",
    value: "node src/hello-world.js"
  },
  {
    name: "terminal-enter",
    value: "1"
  },

  // Creating utility module
  {
    name: "author-speak-before",
    value: "Let's create a utilities module for our logger."
  },
  {
    name: "file-explorer-create-folder",
    value: "src/utils"
  },
  {
    name: "file-explorer-create-file",
    value: "src/utils/logger.js"
  },
  {
    name: "file-explorer-open-file",
    value: "src/utils/logger.js"
  },
  {
    name: "mouse-click-editor",
    value: "1"
  },
  {
    name: "editor-type",
    value: "export const log = (message) => {\n    console.log(message);\n}"
  },
  {
    name: "editor-save",
    value: "1"
  },

  // Updating main file
  {
    name: "mouse-click-filename",
    value: "src/hello-world.js"
  },
  {
    name: "mouse-click-editor",
    value: "1"
  },
  {
    name: "editor-backspace",
    value: "40"
  },
  {
    name: "editor-type",
    value: "const { log } = require('./utils/logger');\n\nlog('Hello, world!');"
  },
  {
    name: "editor-save",
    value: "1"
  },

  // Final run
  {
    name: "mouse-click-terminal",
    value: "1"
  },
  {
    name: "terminal-type",
    value: "node src/hello-world.js"
  },
];

function App() {
  const [actionIndex, setActionIndex] = useState(0);
  return (
    <>
      {/* buttons to increment and decrement */}
      <button onClick={() => setActionIndex(actionIndex - 1)}>Previous</button>
      <button onClick={() => setActionIndex(actionIndex + 1)}>Next</button>
      <ErrorBoundary>
      <IDE
        mode="step"
        actions={tutorialActions}
        currentActionIndex={actionIndex}
        course={{
          id: 'test-course',
          name: 'Test Course',
          description: 'Test Description',
          primaryLanguage: 'javascript',
          lessons: []
        }}
      />
      </ErrorBoundary>
    </>
  );
}

export default App;
