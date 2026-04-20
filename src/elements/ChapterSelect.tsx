import Markdown from "react-markdown";
import type { Chapter } from "../books/types"
import type { Controls } from "../App";
import styles from './ChapterSelect.module.css'

type ChapterSelectProps =
{
	chapters: Chapter[],
	controls: Controls,
}

function capitalize( s: string ) : string
{
	for ( let i = 0; i < s.length; i++ )
	{
		if ( i === 0 || s[i - 1] === " " || ( i === 1 && s[i - 1] === "_") )
			continue;
		s = s.substring(0, i) + s[i].toLowerCase() + s.substring(i + 1);
	}
	return s;
}

export default function ChapterSelect( { chapters, controls } : ChapterSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			<div className={styles.header}>Chapters</div>
			<div className={styles.chapter} onClick={() => controls.goToChap(0)}>
				<Markdown unwrapDisallowed disallowedElements={['p']}>0. TITLE PAGE</Markdown>
			</div>
			{chapters.map((chapter, idx) => (
				<div className={styles.chapter} key={idx} onClick={() => controls.goToChap(chapter.num)}>
					<Markdown unwrapDisallowed disallowedElements={['p']}>{`${chapter.num}. ${chapter.header + ( chapter.title.length ? "." : "" )} ${capitalize(chapter.title)}`}</Markdown>
				</div>
			))}
		</>
	);
}
