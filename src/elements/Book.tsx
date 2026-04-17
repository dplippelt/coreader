import type { AppStates, Controls } from "../App"
import type { Book } from "../books/types"
import TitlePage from "./TitlePage"
import Chapter from "./Chapter"

type BookProps =
{
	book: Book | null,
	states: AppStates,
	controls: Controls,
}

export default function Book( { book, states, controls } : BookProps )
{
	if ( states.currChap === 0 )
		return <TitlePage titlePage={book!.title} controls={controls}/>

	return <Chapter chapter={book!.chapters[states.currChap - 1]}/>
}
