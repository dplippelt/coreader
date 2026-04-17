import styles from './BookSelect.module.css'
import type { AppStates, Controls } from '../App'
import { useRef, type ChangeEvent } from 'react'
import JSZip from 'jszip'
import { XMLParser } from 'fast-xml-parser'
import type { Chapter } from '../books/dracula'

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

function getCleanText( html: string ) : string
{
	return html
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/ +/g, " ")
		.trim();
}

async function processBook( file: File ) : Promise<void | null>
{
	const zip = await JSZip.loadAsync(file);
	const containerXml = await zip.file("META-INF/container.xml")?.async("string");
	if ( !containerXml )
		return null;

	const xmlParser = new XMLParser({ ignoreAttributes: false });
	const containerParsed = xmlParser.parse(containerXml);
	const opfPath: string = containerParsed.container.rootfiles.rootfile["@_full-path"];
	if ( !opfPath )
		return null;

	const opfXml = await zip.file(opfPath)?.async("string");
	if ( !opfXml )
		return null;

	const opfParsed = xmlParser.parse(opfXml);
	const items : [] = opfParsed.package.manifest.item;
	const navItem = items.find(i => i["@_properties"] === "nav");
	if ( !navItem )
		return null;

	const OEBPSdir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
	const navPath = OEBPSdir + navItem["@_href"];
	const navHtml = await zip.file(navPath)?.async("string");

	console.log(navHtml);




	// const spine: [] = opfParsed.package.spine.itemref;
	// const idRefs: string[] = [];
	// for ( let item of spine )
	// 	idRefs.push(item["@_idref"]);

	// const items : [] = opfParsed.package.manifest.item;
	// const OEBPSdir = opfPath.substring(0, opfPath.lastIndexOf("/") + 1);
	// const chapHtmlPaths: string[] = [];
	// for ( let idRef of idRefs )
	// {
	// 	const item = items.find(i => i["@_id"] === idRef);
	// 	const chapHtmlPath = OEBPSdir + item!["@_href"];
	// 	chapHtmlPaths.push(chapHtmlPath);
	// }

	// const chapters: Chapter[] = [];
	// for ( let i = 0; i < chapHtmlPaths.length; i++ )
	// {
	// 	const html = await zip.file(chapHtmlPaths[i])?.async("string");
	// 	const content = getCleanText(html!);
	// 	chapters.push({ num: i, title: `Chapter {}`, content: chap_content, questions: questions, music: music });

	// }

	// console.log(chapHtmlPaths);


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
