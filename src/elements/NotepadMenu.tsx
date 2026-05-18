import type { AppStates, Controls } from "../App"
import styles from "./NotepadMenu.module.css"

type NotepadButtonProps =
{
	onClick: () => void,
}

type NotepadMenuProps =
{
	states: AppStates,
	controls: Controls
}

function NotepadButton( { onClick } : NotepadButtonProps )
{
	return (
		<svg className="roundButton" onClick={onClick} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
			<circle className="roundButtonCircle" cx="75" cy="75" r="73"/>
			<g transform="translate(27, 27) scale(4)">
				<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/>
				<path d="M2 6h4"/>
				<path d="M2 10h4"/>
				<path d="M2 14h4"/>
				<path d="M2 18h4"/>
				<path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>
			</g>
		</svg>
	);
}

function notepadMenuStyle( zoomLevel: number ) : string
{
	let style = styles.notepadButtonMenu;

	if ( zoomLevel >= 1.5 )
		style = style.concat(` ${styles.notepadButtonMenuZoomed}`);
	if ( zoomLevel >= 2.22 )
		style = style.concat(` ${styles.notepadButtonMenuZoomedMore}`);

	return style;
}

export default function NotepadMenu( { states, controls } : NotepadMenuProps )
{
	return (
		<div className={notepadMenuStyle(states.zoomLevel)}>
			<NotepadButton onClick={controls.toggleNotepad}/>
		</div>
	);
}
