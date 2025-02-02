import { IAction, IFileStructure } from '@fullstackcraftllc/codevideo-types';
import React, { useEffect, useRef, useState } from 'react';
import { debounce } from '../../../utils/debounce';

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
  const dimensionsRef = useRef({ width: 0, height: 0 });

  // Cache window dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      dimensionsRef.current = {
        width: window.innerWidth,
        height: window.innerHeight
      };
    };
    
    updateDimensions();
    const handleResize = debounce(updateDimensions, 250);
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!actionIndex) return;
    const currentAction = actions[actionIndex];
    if (!currentAction) return;

    let newPosition = { x: mousePosition.x, y: mousePosition.y };

    switch (currentAction.name) {
      case 'mouse-click-terminal':
        newPosition = { 
          x: dimensionsRef.current.width / 2, 
          y: dimensionsRef.current.height - 75 
        };
        break;
      case 'mouse-click-editor':
        newPosition = { 
          x: dimensionsRef.current.width / 2, 
          y: dimensionsRef.current.height / 2 
        };
        break;
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
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
