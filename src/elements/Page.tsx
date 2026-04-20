import type { Controls, AppStates } from "../App"
import type { Book as Bk, Chapter as Chap } from "../books/types"
import { Screen } from "../util/utils"
import StartMenu from "./StartMenu"
import Book from "./Book"
import Navigation from "./Navigation"
import ChapterSelect from "./ChapterSelect"
import BookSelect from "./BookSelect"
import Settings from "./Settings"
import Questions from "./Questions"
import MusicPlayer from "./MusicPlayer"
import { useSettings } from "./SettingsContext"
import { useEffect, useRef } from 'react'

type PageProps =
{
	book: Bk | null,
	states: AppStates,
	controls: Controls,
}

function playMusic( chapter: Chap | null, states: AppStates, controls: Controls )
{
	const prevMusicRef = useRef<string | null>(null);
	const settings = useSettings();

	useEffect(() =>
	{
		if ( !settings.musicEnabled )
			return;

		const currScreen = states.screen;
		const prevScreen = states.prevScreens[states.prevScreens.length - 1];

		if ( !chapter )
			controls.pause(2);
		else if ( prevMusicRef.current && !states.musicIsPlaying )
			controls.pause(2);
		else if ( currScreen === Screen.reader && prevMusicRef.current !== chapter.music )
		{
			controls.stop();
			prevMusicRef.current = null;
			if ( currScreen === Screen.reader && chapter.music )
			{
				controls.play(chapter.music);
				controls.setMusicIsPlayingTo(true);
				prevMusicRef.current = chapter.music;
			}
		}
		else if ( currScreen === Screen.reader )
			controls.resume(2);
		else if ( prevScreen === Screen.reader )
			controls.pause(2);
	}, [chapter?.num, states.screen]);
}

export default function Page( { book, states, controls} : PageProps )
{
	const settings = useSettings();
	const currChap: Chap | null = states.currChap === -1 ? null : book!.chapters[states.currChap - 1];

	playMusic(currChap, states, controls);

	switch (states.screen)
	{
		case Screen.startMenu:
			return <StartMenu states={states} controls={controls}/>;
		case Screen.bookSelectMenu:
			return <BookSelect controls={controls}/>;
		case Screen.chapSelectMenu:
			return <ChapterSelect chapters={book!.chapters} controls={controls}/>;
		case Screen.settingsMenu:
			return <Settings controls={controls}/>;
		case Screen.questions:
			if ( !settings.questionsEnabled )
			{
				controls.next();
				return;
			}

			const questions = states.questions[book!.id][`chapter_${states.currChap}`];

			return <Questions key={states.currChap} header={currChap!.header} questions={questions} controls={controls}/>
		case Screen.reader:
			return (
				<>
					<Navigation states={states} controls={controls}/>
					<Book book={book} states={states} controls={controls}/>
					<Navigation states={states} controls={controls}/>
					{ settings.musicEnabled && states.currChap > 0 ? <MusicPlayer states={states} controls={controls}/> : <></> }
				</>
			);
		default:
			return;
	}
}
