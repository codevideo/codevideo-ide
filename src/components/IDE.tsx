import * as React from 'react';
import { IAction, GUIMode, ICourse, IMouseSnapshot } from "@fullstackcraftllc/codevideo-types"
import { Mouse } from "@fullstackcraftllc/codevideo-mouse"
import AdvancedEditor from './AdvancedEditor/AdvancedEditor';
import { useState } from 'react';

export interface IIDEProps {
    mode?: GUIMode;
    course?: ICourse;
    actions?: Array<IAction>;
    currentActionIndex?: number; // used for step mode
    startActionIndex?: number; // used for playback mode
    endActionIndex?: number; // used for playback mode
}

export function IDE(props: IIDEProps) {
    // pull off props with sensible defaults
    const { mode = 'step', course = { id: '', name: '', description: '', primaryLanguage: '', lessons: [] }, actions = [], currentActionIndex = 0 } = props;
    const [recordedActions, setRecordedActions] = useState<Array<IAction>>([]);
    const [recordedMouseSnapshots, setRecordedMouseSnapshots] = useState<Array<IMouseSnapshot>>([]);
    const [recordedEditorSnapshots, setRecordedEditorSnapshots] = useState<Array<string>>([]);

    return (
        <>
            <AdvancedEditor
                mode={mode}
                course={course}
                actions={actions}
                currentActionIndex={currentActionIndex}
            />
            {/* TODO: mouse is chalked, for now we can rely on mouseoverlay i think */}
            {/* <Mouse
                mode={mode}
                actions={actions}
                // currentActionIndex={currentActionIndex}
                setRecordedMouseAction={(action) => setRecordedActions([...recordedActions, action])}
                setRecordedSnapshots={(snapshots) => setRecordedMouseSnapshots(snapshots)}
            /> */}
        </>
    );
}
