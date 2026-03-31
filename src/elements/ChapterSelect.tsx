import Markdown from "react-markdown";
import type { Chapter } from "../util/dracula"
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	book: Chapter[],
	currChap: number,
	goToChapter: (chap: number) => void,
}

function getText( chapNum: number, chapTitle: string): string
{
	if ( chapNum === 0 )
		return `0. TITLE SCREEN`;
	return `${chapNum}. ${chapTitle}`;
}

export default function ChapterSelect( { book, currChap, goToChapter } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => goToChapter(currChap)}>Back</button>
			</div>
			{book.map((chapter, chapNum) => (
				<div className={styles.chapter} key={chapNum} onClick={() => goToChapter(chapNum)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{getText(chapter.num, chapter.title)}</Markdown>
				</div>
			))}
		</>
	);
}
