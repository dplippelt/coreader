import { useState } from "react"
import { Screen } from "../util/utils"
import { BookID, type Book, type Question } from "../books/types"
import booksJSON from "../data/books.json"
const books = booksJSON as Record<string, Book>

export default function useAppState()
{
	const [screen, setScreen] = useState<Screen>(Screen.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [navWidth, setNavWidth] = useState<number>(0);
	const [musicIsPlaying, setMusicIsPlaying] = useState<boolean>(true);
	const [muteOn, setMuteOn] = useState<boolean>(false);
	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [prevMusic, setPrevMusic] = useState<string | null>(null);
	const [error, setError] = useState<Error | null>(null);

	const [currBook, setCurrBook] = useState<BookID>(() =>
		{
			const stored = localStorage.getItem("currBook") as BookID | null;
			const currBook = stored ? stored : BookID.none;
			return currBook;
		});

	const [book, setBook] = useState<Book | null>( currBook !== BookID.none ? books[currBook] : null );

	const [currChap, setCurrChap] = useState<number>(() =>
		{
			const stored = localStorage.getItem("currChap");
			const currBook = localStorage.getItem("currBook") as BookID | null;
			if ( !stored || !currBook || currBook === BookID.none )
				return -1;
			return Number(stored);
		});

	const [questions, setQuestions] = useState<Record<string, Record<string, Question[]>>>(() =>
		{
			const stored = localStorage.getItem("questions");
			const questions = stored ? JSON.parse(stored) : {};
			return questions;
		});

	return	{
				screen, setScreen,
				prevScreens, setPrevScreens,
				navWidth, setNavWidth,
				musicIsPlaying, setMusicIsPlaying,
				muteOn, setMuteOn,
				zoomLevel, setZoomLevel,
				prevMusic, setPrevMusic,
				error, setError,
				book, setBook,
				currBook, setCurrBook,
				currChap, setCurrChap,
				questions, setQuestions,
			}
}
