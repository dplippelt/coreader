import Markdown from 'react-markdown'
import type { Chapter } from '../util/dracula.ts'
import './Chapter.css'

type ChapterProps =
{
	chapter: Chapter,
}

export default function Chapter( { chapter } : ChapterProps )
{
	const paragraphs: string[] = chapter.content.split(/\n\n+/);

	return (
		<div className="chapter" >
			<h1>CHAPTER {chapter.num}</h1>
			<h2><Markdown unwrapDisallowed disallowedElements={['p']}>{chapter.title}</Markdown></h2>
			{paragraphs.map((para, i) => (
				<Markdown key={i}>{para}</Markdown>
			))}
		</div>
	);
}
