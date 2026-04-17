import styles from './BookSelect.module.css'
import type { AppStates, Controls } from '../App'
import { useRef, type ChangeEvent } from 'react'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'

type BookSelectProps =
{
	states: AppStates,
	controls: Controls
}

type BooksProps =
{
	states: AppStates,
	controls: Controls
}

type ButtonMenu =
{
	controls: Controls
}

function cleanFileName( fileName: string ) : string | null
{
	const idx = fileName.indexOf(".epub");;
	if ( idx === -1 )
		return null;

	fileName = fileName.substring(0, idx);
	return fileName[0].toUpperCase() + fileName.slice(1);;
}

async function processBook( file: File ) : Promise<void | null>
{
	const zip = await JSZip.loadAsync(file);
	const xmlContainer = await zip.file("META-INF/container.xml")?.async("string");
	if ( !xmlContainer )
		return null;

	const xmlParser = new XMLParser({ ignoreAttributes: false });
	const parsed = xmlParser.parse(xmlContainer);
	const opfPath = parsed.container.rootfiles.rootfile["@_full-path"];
	if ( !opfPath )
		return null;



	return;
}

function ButtonMenu( { controls } : ButtonMenu )
{
	const inputRef = useRef<HTMLInputElement>(null);

	function onChange( event: ChangeEvent<HTMLInputElement> )
	{
		const file = event.target.files?.[0];
		if ( !file )
			return;

		const fileName = cleanFileName(file.name);
		if ( !fileName )
			return;

		processBook(file);
		controls.addBookToIndex(fileName);
	}

	return (
		<div className={styles.buttonMenu}>
			<button onClick={() => controls.goToPrevScreen()}>Back</button>
			<input type="file" ref={inputRef} id="bookUpload" accept=".epub" style={{ display: "none" }} onChange={onChange}/>
			<button onClick={() => inputRef.current?.click()}>Upload Book</button>
		</div>
	);
}

function Header()
{
	return <div className={styles.menuHeader}>Books</div>;
}

function Books( { states, controls } : BooksProps )
{
	return (
		<>
			{states.booksIndex.map((book, idx) => (
				<div key={idx} className={styles.book} onClick={() => { controls.setCurrBook(book.toLowerCase()); controls.goToChapSelect() }}>{book}</div>
			))}
		</>
	);
}

export default function BookSelect( { states, controls } : BookSelectProps )
{
	return (
		<>
			<ButtonMenu controls={controls}/>
			<Header/>
			<Books states={states} controls={controls}/>
		</>
	);
}
