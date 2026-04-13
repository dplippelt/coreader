import type { Controls, AppStates } from "../App"
import type { Book as Bk, Chapter as Chap } from "../books/dracula"
import { Screens } from "../util/utils"
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
	book: Bk,
	states: AppStates,
	controls: Controls,
}

function playMusic( chapter: Chap | null, states: AppStates, controls: Controls )
{
	const prevMusicRef = useRef<string | null>(null);
	const settings = useSettings();

	console.log(`prevMusicRef: ${prevMusicRef.current}`);

	useEffect(() =>
	{
		if ( !settings.musicEnabled )
			return;

		const currScreen = states.screen;
		const prevScreen = states.prevScreens[states.prevScreens.length - 1];

		if ( !chapter )
			controls.pause();
		else if ( prevMusicRef.current && !states.musicIsPlaying )
			controls.pause();
		else if ( currScreen === Screens.reader && prevMusicRef.current !== chapter.music )
		{
			controls.stop();
			prevMusicRef.current = null;
			if ( currScreen === Screens.reader && chapter.music )
			{
				controls.play(chapter.music, states.muteOn);
				controls.setMusicIsPlayingTo(true);
				prevMusicRef.current = chapter.music;
			}
		}
		else if ( currScreen === Screens.reader )
			controls.resume(states.muteOn);
		else if ( prevScreen === Screens.reader )
			controls.pause();
	}, [chapter?.num, states.screen]);

	console.log(`musicIsPlaying: ${states.musicIsPlaying}`);
}

export default function Page( { book, states, controls} : PageProps )
{
	const settings = useSettings();
	const currChap: Chap | null = !states.currChap ? null : book.chapters[states.currChap - 1];

	playMusic(currChap, states, controls);

	switch (states.screen)
	{
		case Screens.startMenu:
			return <StartMenu states={states} controls={controls}/>;
		case Screens.bookSelectMenu:
			return <BookSelect controls={controls}/>;
		case Screens.chapSelectMenu:
			{ return states.currBook ? <ChapterSelect chapters={book.chapters} controls={controls}/> : <BookSelect controls={controls}/> };
		case Screens.settingsMenu:
			return <Settings controls={controls}/>;
		case Screens.questions:
			if ( !settings.questionsEnabled )
			{
				controls.next();
				return;
			}
			return <Questions key={states.currChap} questions={currChap!.questions} states={states} controls={controls}/>
		case Screens.reader:
			return (
				<>
					<MusicPlayer states={states} controls={controls}/>
					<Navigation states={states} controls={controls}/>
					<Book book={book} states={states} controls={controls}/>
					<Navigation states={states} controls={controls}/>
				</>
			);
		default:
			return;
	}
}
