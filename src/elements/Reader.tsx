import type { Book as Bk } from "../books/types"
import { useSettings } from "./SettingsContext"
import Book from "./Book"
import Navigation from "./Navigation"
import MusicPlayer from "./MusicPlayer"
import NotepadMenu from "./NotepadMenu"
import type { AppStates, Controls } from "../App"

type ReaderProps =
{
	book: Bk | null,
	states: AppStates,
	controls: Controls,
}

export default function Reader( { book, states, controls } : ReaderProps )
{
	const settings = useSettings();

	return (
		<>
			<Navigation states={states} controls={controls}/>
			<Book book={book} states={states} controls={controls}/>
			<Navigation states={states} controls={controls}/>
			{ settings.musicEnabled && states.currChap > 0 ? <MusicPlayer states={states} controls={controls}/> : <></> }
			<NotepadMenu/>
		</>
	);
}
