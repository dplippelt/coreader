import { useEffect, useRef, useState } from "react"
import type { Controls } from "../App"
import styles from "./Notepad.module.css"

type NotepadControls =
{
	toggleNotepad: () => void;
	setShowSave: React.Dispatch<React.SetStateAction<boolean>>,
	setShowLoad: React.Dispatch<React.SetStateAction<boolean>>,
	setShowDelete: React.Dispatch<React.SetStateAction<boolean>>,
}

type NotepadProps =
{
	controls: Controls,
}

type WindowProps =
{
	controls: NotepadControls,
	textRef: React.RefObject<HTMLTextAreaElement | null>,
}

type MenuProps =
{
	controls: NotepadControls,
	textRef: React.RefObject<HTMLTextAreaElement | null>,
}

type TextAreaProps =
{
	textRef: React.RefObject<HTMLTextAreaElement | null>,
}

type SaveQueryProps =
{
	controls: NotepadControls,
	textRef: React.RefObject<HTMLTextAreaElement | null>,
}

type LoadQueryProps =
{
	controls: NotepadControls,
	textRef: React.RefObject<HTMLTextAreaElement | null>,
}

type DeleteQueryProps =
{
	controls: NotepadControls,
}

type NotepadFile =
{
	fileName: string,
	content: string,
}

function Menu( { controls, textRef } : MenuProps )
{
	function handleNew()
	{
		if ( textRef.current )
		{
			textRef.current.value = "";
			localStorage.setItem("notepadContent", "");
		}
	}

	return (
		<div className={styles.menu}>
			<button onClick={handleNew}>New</button>
			<button onClick={() => controls.setShowSave(true)}>Save</button>
			<button onClick={() => controls.setShowLoad(true)}>Load</button>
			<button onClick={() => controls.setShowDelete(true)}>Remove</button>
			<button onClick={controls.toggleNotepad}>Close</button>
		</div>
	);
}

function TextArea( { textRef } : TextAreaProps )
{
	const timeOutRef = useRef<NodeJS.Timeout | undefined>(undefined);

	function handleChange( e: React.ChangeEvent<HTMLTextAreaElement> )
	{
		clearTimeout(timeOutRef.current);
		timeOutRef.current = setTimeout(() => localStorage.setItem("notepadContent", e.target.value), 500);
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
			ref={textRef}
			defaultValue={localStorage.getItem("notepadContent") || ""}
			onChange={(e) => handleChange(e)}
			onKeyDown={(e) => handleTab(e)}>
		</textarea>
	)
}

function Window( { controls, textRef } : WindowProps )
{
	return (
		<div className={styles.window}>
			<Menu controls={controls} textRef={textRef}/>
			<TextArea textRef={textRef}/>
		</div>
	);
}

function SaveQuery( { controls, textRef } : SaveQueryProps )
{
	const fileName = useRef<string>("");

	function handleSave( fileName: string )
	{
		if ( textRef.current )
		{
			const stored = localStorage.getItem("notepadFiles");
			const files = stored ? JSON.parse(stored) : {};
			files[`${fileName}`] = { fileName: fileName, content: textRef.current.value };

			console.log("textRef.current: ", textRef.current, "\nfileName: ", fileName, "\nfiles: ", files);
			localStorage.setItem("notepadFiles", JSON.stringify(files));
			controls.setShowSave(false);
		}
	}

	return (
		<div className={styles.queryWindow}>
			<div className={styles.query}>File name:</div>
			<input
				type="text"
				defaultValue=""
				onChange={(e) => fileName.current = e.target.value}
				autoFocus/>
			<div className={styles.queryButtonMenu}>
				<button className={styles.queryButton} onClick={() => handleSave(fileName.current)}>Confirm</button>
				<button className={styles.queryButton} onClick={() => controls.setShowSave(false)}>Cancel</button>
			</div>
		</div>
	);
}

function LoadQuery( { controls, textRef } : LoadQueryProps )
{
	const stored = localStorage.getItem("notepadFiles");
	const files: Record<string, NotepadFile>  = stored ? JSON.parse(stored) : {};
	const fileName = useRef<string>(Object.values(files)[0]?.fileName ?? "");

	function handleLoad( fileName: string )
	{
		if ( textRef.current )
		{
			textRef.current.value = files[`${fileName}`].content || "";
			localStorage.setItem("notepadContent", textRef.current.value);
			controls.setShowLoad(false);
		}
	}

	return (
		<div className={styles.queryWindow}>
			<div className={styles.query}>Select a file:</div>
			<select className={styles.querySelect} onChange={(e) => fileName.current = e.target.value}>
				{ Object.values(files).map((file, idx) =>
					<option key={idx} value={file.fileName}>{file.fileName}</option> ) }
			</select>
			<div className={styles.queryButtonMenu}>
				<button className={styles.queryButton} onClick={() => handleLoad(fileName.current)}>Confirm</button>
				<button className={styles.queryButton} onClick={() => controls.setShowLoad(false)}>Cancel</button>
			</div>
		</div>
	);
}

function DeleteQuery ( { controls } : DeleteQueryProps )
{
	const stored = localStorage.getItem("notepadFiles");
	const files: Record<string, NotepadFile> = stored ? JSON.parse(stored) : {};
	const selectedFileNames = useRef<string[]>([]);

	function getSelected( e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement> )
	{
		const selected = Array.from(e.target.selectedOptions);
		selectedFileNames.current = selected.map(file => file.value);
	}

	function handleDelete()
	{
		for ( const fileName of selectedFileNames.current )
			delete files[fileName];
		localStorage.setItem("notepadFiles", JSON.stringify(files));
		controls.setShowDelete(false);
	}

	return (
		<div className={styles.queryWindow}>
			<div className={styles.query}>Select files:</div>
			<select multiple className={styles.querySelectMultiple} onChange={getSelected}>
				{ Object.values(files).map((file, idx) =>
					<option key={idx} value={file.fileName}>{file.fileName}</option> ) }
			</select>
			<div className={styles.queryButtonMenu}>
				<button className={styles.queryButton} onClick={() => handleDelete()}>Confirm</button>
				<button className={styles.queryButton} onClick={() => controls.setShowDelete(false)}>Cancel</button>
			</div>
		</div>
	);
}

export default function Notepad( { controls } : NotepadProps )
{
	const textRef = useRef<HTMLTextAreaElement | null>(null);
	const [showSave, setShowSave] = useState<boolean>(false);
	const [showLoad, setShowLoad] = useState<boolean>(false);
	const [showDelete, setShowDelete] = useState<boolean>(false);

	const npControls: NotepadControls =
	{
		toggleNotepad: controls.toggleNotepad,
		setShowSave: setShowSave,
		setShowLoad: setShowLoad,
		setShowDelete: setShowDelete,
	}

	// to block scroll on the chapter text
	useEffect(() =>
	{
		document.body.style.overflow = "hidden";
		return () => { document.body.style.overflow = ""; };
	}, []);

	return (
		<div className={styles.background}>
			<Window controls={npControls} textRef={textRef}/>
			{ showSave || showLoad || showDelete ? <div className={styles.queryBackground}/> : <></> }
			{ showSave ? <SaveQuery controls={npControls} textRef={textRef}/> : <></> }
			{ showLoad ? <LoadQuery controls={npControls} textRef={textRef}/> : <></> }
			{ showDelete ? <DeleteQuery controls={npControls}/> : <></> }
		</div>
	);
}
