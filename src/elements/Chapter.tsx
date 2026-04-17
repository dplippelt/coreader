import Markdown from 'react-markdown'
import type { Chapter } from '../books/types'
import styles from './Chapter.module.css'
import { useSettings } from './SettingsContext.tsx'

type ChapterProps =
{
	chapter: Chapter,
}

export default function Chapter( { chapter } : ChapterProps )
{
	const settings = useSettings();
	const paragraphs: string[] = chapter.content.split(/\n\n+/);

	return (
		<div style={{fontSize: `${settings.fontSize}px`}} className={`${styles.chapter} chapter-ref`}>
			<h1>{chapter.header}</h1>
			<h2><Markdown unwrapDisallowed disallowedElements={['p']}>{chapter.title}</Markdown></h2>
			{paragraphs.map((para, i) => (
				<Markdown key={i}>{para}</Markdown>
			))}
		</div>
	);
}
