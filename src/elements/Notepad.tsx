import type { Controls } from "../App"
import styles from "./Notepad.module.css"

type NotepadProps =
{
	controls: Controls,
}

type WindowProps =
{
	controls: Controls,
}

type MenuProps =
{
	controls: Controls,
}

function Menu( { controls } : MenuProps )
{
	return (
		<div className={styles.menu}>
			<button onClick={controls.toggleNotepad}>Close</button>
		</div>
	);
}

function TextArea()
{
	return (
		<textarea className={styles.textArea} onChange={(e) => console.log(e.target.value)}></textarea>
	)
}

function Window( { controls } : WindowProps )
{
	return (
		<div className={styles.window}>
			<Menu controls={controls}/>
			<TextArea/>
		</div>
	);
}

export default function Notepad( { controls } : NotepadProps )
{
	return (
		<div className={styles.background}>
			<Window controls={controls}/>
		</div>
	);
}
