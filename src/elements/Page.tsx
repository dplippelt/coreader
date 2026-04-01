import type { Controls, AppStates } from "../App"
import type { Chapter as Chap } from "../books/dracula"
import { Screens } from "../util/utils"
import StartMenu from "./StartMenu"
import Chapter from "./Chapter"
import Navigation from "./Navigation"
import ChapterSelect from "./ChapterSelect"
import BookSelect from "./BookSelect"

type PageProps =
{
	book: Chap[],
	states: AppStates,
	controls: Controls,
}

export default function Page( { book, states, controls} : PageProps )
{
	switch (states.screen)
	{
		case Screens.startMenu:
			return <StartMenu states={states} controls={controls}/>;
		case Screens.bookSelectMenu:
			return <BookSelect controls={controls}/>;
		case Screens.chapSelectMenu:
			{ return states.bookID ? <ChapterSelect book={book} controls={controls}/> : <BookSelect controls={controls}/> };
		case Screens.reader:
			return (
				<>
					<Navigation states={states} controls={controls}/>
					<Chapter chapter={book[states.currChap]} controls={controls}/>
					<Navigation states={states} controls={controls}/>
				</>
			);
		default:
			return;
	}
}
