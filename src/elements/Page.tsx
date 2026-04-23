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

type PageProps =
{
	book: Bk | null,
	states: AppStates,
	controls: Controls,
}

export default function Page( { book, states, controls} : PageProps )
{
	const settings = useSettings();
	const currChap: Chap | null = states.currChap === -1 ? null : book!.chapters[states.currChap - 1];

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
