import type { Controls, AppStates } from "../App"
import type { Chapter as Chap } from "../books/dracula"
import { Screens } from "../util/utils"
import StartMenu from "./StartMenu"
import Chapter from "./Chapter"
import Navigation from "./Navigation"
import ChapterSelect from "./ChapterSelect"
import BookSelect from "./BookSelect"
import Settings from "./Settings"
import Questions from "./Questions"
import { useSettings } from "./SettingsContext"
import { useEffect, useRef } from 'react'

type PageProps =
{
	book: Chap[],
	states: AppStates,
	controls: Controls,
}

function playMusic( chapter: Chap, states: AppStates, controls: Controls )
{
	const prevMusicRef = useRef<string | null>(null);

	useEffect(() =>
	{
		if ( states.screen === Screens.reader && prevMusicRef.current !== chapter.music )
		{
			controls.stop();
			prevMusicRef.current = null;
			if ( states.screen === Screens.reader && chapter.music )
			{
				controls.play(chapter.music);
				prevMusicRef.current = chapter.music;
			}
		}
		else if ( states.screen !== Screens.reader )
			controls.pause();
		else
			controls.resume();
	}, [chapter?.num, states.screen]);
}

export default function Page( { book, states, controls} : PageProps )
{
	const settings = useSettings();
	const currChap = book[states.currChap];

	playMusic(currChap, states, controls);

	switch (states.screen)
	{
		case Screens.startMenu:
			return <StartMenu states={states} controls={controls}/>;
		case Screens.bookSelectMenu:
			return <BookSelect controls={controls}/>;
		case Screens.chapSelectMenu:
			{ return states.currBook ? <ChapterSelect book={book} controls={controls}/> : <BookSelect controls={controls}/> };
		case Screens.settingsMenu:
			return <Settings controls={controls}/>;
		case Screens.questions:
			if ( !settings.questionsEnabled )
			{
				controls.next();
				return;
			}
			return <Questions key={states.currChap} questions={currChap.questions} states={states} controls={controls}/>
		case Screens.reader:
			return (
				<>
					<Navigation states={states} controls={controls}/>
					<Chapter chapter={currChap} controls={controls}/>
					<Navigation states={states} controls={controls}/>
				</>
			);
		default:
			return;
	}
}
