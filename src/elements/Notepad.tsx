import { useRef } from "react"
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
	const notepadContent = localStorage.getItem("notepadTemp") ?? "";
	const timeOutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	function handleChange( e: React.ChangeEvent<HTMLTextAreaElement> )
	{
		clearTimeout(timeOutRef.current);
		timeOutRef.current = setTimeout(() => localStorage.setItem("notepadTemp", e.target.value), 500);
	}

	function handleTab( e: React.KeyboardEvent<HTMLTextAreaElement> )
	{
		if ( e.key === "Tab" )
		{
			e.preventDefault();
			const target = e.target as HTMLTextAreaElement;
			const startIdx = target.selectionStart;
			const endIdx = target.selectionEnd;
			target.value = target.value.substring(0, startIdx) + "\t" + target.value.substring(endIdx);
			target.selectionStart = startIdx + 1;
			target.selectionEnd = target.selectionStart;
		}
	}

	return (
		<textarea
			className={styles.textArea}
			defaultValue={notepadContent}
			onChange={(e) => handleChange(e)}
			onKeyDown={(e) => handleTab(e)}>
		</textarea>
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
