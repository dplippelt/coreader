import type { Controls, AppStates } from "../App"
import type { Book as Bk } from "../books/types"
import { Screen } from "../util/utils"
import StartMenu from "./StartMenu"
import Reader from "./Reader"
import ChapterSelect from "./ChapterSelect"
import BookSelect from "./BookSelect"
import Settings from "./Settings"
import Credits from "./Credits"
import Questions from "./Questions"
import Error from "./Error"

type PageProps =
{
	book: Bk | null,
	states: AppStates,
	controls: Controls,
}

export default function Page( { book, states, controls} : PageProps )
{
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
		case Screen.credits:
			return <Credits controls={controls}/>;
		case Screen.questions:
			return <Questions key={states.currChap} book={book} states={states} controls={controls}/>;
		case Screen.reader:
			return <Reader book={book} states={states} controls={controls}/>;
		default:
			return <Error states={states}/>;
	}
}
