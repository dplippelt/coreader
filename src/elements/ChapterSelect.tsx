import Markdown from "react-markdown";
import type { Chapter } from "../books/dracula"
import type { Controls } from "../App";
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	chapters: Chapter[],
	controls: Controls,
}

export default function ChapterSelect( { chapters, controls } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			<div className={styles.menuHeader}>Chapters</div>
			<div className={styles.chapter} onClick={() => controls.goToChap(0)}>
				<Markdown unwrapDisallowed disallowedElements={['p']}>0. TITLE PAGE</Markdown>
			</div>
			{chapters.map((chapter, idx) => (
				<div className={styles.chapter} key={idx} onClick={() => controls.goToChap(chapter.num)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{`${chapter.num}. ${chapter.title}`}</Markdown>
				</div>
			))}
		</>
	);
}
