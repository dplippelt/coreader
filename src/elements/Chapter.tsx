import Markdown from 'react-markdown'
import type { Chapter } from '../util/dracula.ts'
import type { ChapterControls } from '../App.tsx'
import styles from './Chapter.module.css'

type ChapterProps =
{
	chapter: Chapter,
	controls: ChapterControls,
}

export default function Chapter( { chapter, controls } : ChapterProps )
{
	const paragraphs: string[] = chapter.content.split(/\n\n+/);

	if ( chapter.num === 0 )
		return <div className={styles.title} onClick={controls.next}>{chapter.title}</div>;

	return (
		<div className={styles.chapter}>
			<h1>CHAPTER {chapter.num}</h1>
			<h2><Markdown unwrapDisallowed disallowedElements={['p']}>{chapter.title}</Markdown></h2>
			{paragraphs.map((para, i) => (
				<Markdown key={i}>{para}</Markdown>
			))}
		</div>
	);
}
