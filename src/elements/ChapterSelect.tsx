import Markdown from "react-markdown";
import type { Chapter } from "../util/dracula"
import type { ChapterControls } from "../App";
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	book: Chapter[],
	currChap: number,
	controls: ChapterControls,
}

function getText( chapNum: number, chapTitle: string): string
{
	if ( chapNum === 0 )
		return `0. TITLE SCREEN`;
	return `${chapNum}. ${chapTitle}`;
}

export default function ChapterSelect( { book, currChap, controls } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goto(currChap)}>Back</button>
			</div>
			{book.map((chapter, chapNum) => (
				<div className={styles.chapter} key={chapNum} onClick={() => controls.goto(chapNum)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{getText(chapter.num, chapter.title)}</Markdown>
				</div>
			))}
		</>
	);
}
