import type { ChapterControls, AppStates } from "../App"
import type { Chapter as Chap } from "../util/dracula"
import StartMenu from "./StartMenu"
import Chapter from "./Chapter"
import Navigation from "./Navigation"
import ChapterSelect from "./ChapterSelect"

type PageProps =
{
	book: Chap[],
	states: AppStates,
	controls: ChapterControls,
}

export default function Page( { book, states, controls} : PageProps )
{
	if ( states.startMenu )
		return <StartMenu states={states} controls={controls} />

	if ( states.chapSelect )
		return <ChapterSelect book={book} states={states} controls={controls}/>

	return (
		<>
			<Navigation states={states} controls={controls}/>
			<Chapter chapter={book[states.currChap]} controls={controls}/>
			<Navigation states={states} controls={controls}/>
		</>
	);
}
