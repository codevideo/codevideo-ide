import { IAction, IFileStructure } from '@fullstackcraftllc/codevideo-types';
import React, { useEffect, useRef, useState } from 'react';

interface IMouseOverlayProps {
  mouseVisible: boolean;
  actions: Array<IAction>;
  actionIndex?: number;
  fileStructure: IFileStructure;
  className?: string;
}

export const MouseOverlay = (props: IMouseOverlayProps) => {
  const { mouseVisible, actions, actionIndex, fileStructure, className } = props;
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!actionIndex) return;
    const currentAction = actions[actionIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    // TODO: think maybe from a different way - we should be able to retrieve the x and y coordinates directly from state from the editor!
    // For this switch, let the MouseActions from the codevideo-types package guide you
    switch (currentAction.name) {
      case 'mouse-click-terminal':
        newPosition = { x: window.innerWidth / 2, y: window.innerHeight - 75 };
        break;
      case 'mouse-click-editor':
        // Get middle of editor div
        newPosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        break;
      // case 'click-file':
      // use the file structure to get the middle x and y position of the file

      // Add more cases as needed
    }

    setMousePosition(newPosition);
  }, [actionIndex, actions]);

  if (!mouseVisible) return null;

  return (
    <div
      ref={overlayRef}
      className={`fixed pointer-events-none z-50 ${className}`}
      style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
        transition: 'transform 0.3s ease-out'
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M 0,0 L 0,20 L 4.5,15.5 L 8.75,23 L 11,22 L 6.75,15 L 13.75,15 Z"
          fill="black"
          stroke="white"
          stroke-width="1.5"
          stroke-linejoin="rounded"
        />
      </svg>
    </div>
  );
};
