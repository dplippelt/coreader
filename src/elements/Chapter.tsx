import Markdown from 'react-markdown'
import type { Chapter } from '../books/dracula.ts'
import type { Controls } from '../App.tsx'
import styles from './Chapter.module.css'
import { useSettings } from './SettingsContext.tsx'

type ChapterProps =
{
	chapter: Chapter,
	controls: Controls,
}

export default function Chapter( { chapter, controls } : ChapterProps )
{
	const settings = useSettings();
	const paragraphs: string[] = chapter.content.split(/\n\n+/);

	if ( chapter.num === 0 )
		return <div className={styles.title} onClick={controls.next}>{chapter.title}</div>;

	return (
		<div style={{fontSize: `${settings.fontSize}px`}} className={`${styles.chapter} chapter-ref`}>
			<h1>CHAPTER {chapter.num}</h1>
			<h2><Markdown unwrapDisallowed disallowedElements={['p']}>{chapter.title}</Markdown></h2>
			{paragraphs.map((para, i) => (
				<Markdown key={i}>{para}</Markdown>
			))}
		</div>
	);
}
