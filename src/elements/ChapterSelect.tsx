import Markdown from "react-markdown";
import type { Chapter } from "../util/dracula"
import type { ChapterControls, AppStates } from "../App";
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	book: Chapter[],
	states: AppStates,
	controls: ChapterControls,
}

function getText( chapNum: number, chapTitle: string): string
{
	if ( chapNum === 0 )
		return `0. TITLE SCREEN`;
	return `${chapNum}. ${chapTitle}`;
}

export default function ChapterSelect( { book, states, controls } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goto(states.currChap)}>Back</button>
			</div>
			{book.map((chapter, chapNum) => (
				<div className={styles.chapter} key={chapNum} onClick={() => controls.goto(chapNum)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{getText(chapter.num, chapter.title)}</Markdown>
				</div>
			))}
		</>
	);
}
