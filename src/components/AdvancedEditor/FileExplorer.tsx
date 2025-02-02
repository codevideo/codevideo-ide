import React, { JSX } from 'react';
import { IFileStructure } from '@fullstackcraftllc/codevideo-types';
import { MouseOverlay } from './MouseOverlay/MouseOverlay';
import { getFileIcon } from './FileIcons/FileIcons';

export interface IFileExplorerProps {
    currentFile: string | null
    fileStructure: IFileStructure
}

export function FileExplorer(props: IFileExplorerProps) {
    const { currentFile, fileStructure } = props;

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
        <div>
            <div className="h-full border-r border-slate-600">
                <div className="p-4 border-b border-slate-600">
                    <h3 className="text-slate-200 font-semibold">Explorer</h3>
                </div>
                <div className="p-2">{renderFileTree(fileStructure)}</div>
            </div>
        </div>
    );
}
