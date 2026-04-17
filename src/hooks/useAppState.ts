import { useState } from "react";
import { Screens } from "../util/utils";
import type { Screen } from "../App";
import type { Book, Question } from "../books/dracula";

function getDraculaFromStorage() : Book | null
{
	const stored = localStorage.getItem("books");
	const books = stored ? JSON.parse(stored) : null;
	if ( !books )
		return null;
	return books["dracula"];
}

export default function useAppState()
{
	const [screen, setScreen] = useState<Screen>(Screens.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [navWidth, setNavWidth] = useState<number>(0);
	const [musicIsPlaying, setMusicIsPlaying] = useState<boolean>(false);
	const [muteOn, setMuteOn] = useState<boolean>(false);
	const [zoomLevel, setZoomLevel] = useState<number>(1);

	const [book, setBook] = useState<Book | null>(() =>
		{
			const stored = localStorage.getItem("book");
			const book = stored ? JSON.parse(stored) : getDraculaFromStorage();
			return book;
		});

	const [currChap, setCurrChap] = useState<number>(() =>
		{
			const stored = localStorage.getItem("currChap");
			const currChap = stored ? Number(stored) : -1;
			return currChap;
		});

	const [questions, setQuestions] = useState<Record<string, Question[]>>(() =>
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
				book, setBook,
				currChap, setCurrChap,
				questions, setQuestions,
			}
}
