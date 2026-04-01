import Markdown from "react-markdown";
import type { Chapter } from "../books/dracula"
import type { Controls } from "../App";
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	book: Chapter[],
	controls: Controls,
}

function getText( chapNum: number, chapTitle: string): string
{
	if ( chapNum === 0 )
		return `0. TITLE SCREEN`;
	return `${chapNum}. ${chapTitle}`;
}

export default function ChapterSelect( { book, controls } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			{book.map((chapter, chapNum) => (
				<div className={styles.chapter} key={chapNum} onClick={() => controls.goToChap(chapNum)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{getText(chapter.num, chapter.title)}</Markdown>
				</div>
			))}
		</>
	);
}
