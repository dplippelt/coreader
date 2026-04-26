import { useEffect } from "react"
import type { AppStates, Controls, SetAppStates } from "../App"
import { updateBooks } from "../util/utils"
import { Screen } from "../util/utils"
import { useSettings } from "../elements/SettingsContext"
import useMusic from "./useMusic"
import { musicUrls } from "../books/types"

export default function useAppEffects( states: AppStates, setStates: SetAppStates, controls: Controls )
{
	const settings = useSettings();
	const { preload } = useMusic();

	useEffect(() =>
	{
		function initBooks()
		{
			const stored = localStorage.getItem("books");
			const books = stored ? JSON.parse(stored) : {};

			try
			{
				const bookUpdated = updateBooks(books);
				if ( bookUpdated && states.book )
					controls.setCurrBook(states.book.id);
			}
			catch ( e )
			{
				console.error(e);
				if ( e instanceof Error )
					setStates.setError(e);
				else
					setStates.setError(new Error(String(e)));
				setStates.setScreen(Screen.error);
			}

			localStorage.setItem("books", JSON.stringify(books));
		}

		initBooks();
	}, []);

	useEffect(() =>
	{
		function updateNavWidth()
		{
			const chapter = document.querySelector('.chapter-ref');
			if ( !chapter )
				return;

			const { left } = chapter.getBoundingClientRect();
			setStates.setNavWidth(left - 20);
		}

		function updateZoomLevel()
		{
			setStates.setZoomLevel(window.devicePixelRatio);
		}

		updateNavWidth();
		updateZoomLevel();

		window.addEventListener('resize', updateNavWidth);
		window.addEventListener('resize', updateZoomLevel);

		return () => { window.removeEventListener('resize', updateNavWidth); window.removeEventListener('resize', updateZoomLevel); };
	}, [states.currChap]);

	useEffect(() =>
	{
		localStorage.setItem("settings", JSON.stringify(settings));
	}, [settings]);

	useEffect(() =>
	{
		localStorage.setItem("questions", JSON.stringify(states.questions));
	}, [states.questions]);

	useEffect(() =>
	{
		localStorage.setItem("book", JSON.stringify(states.book));
	}, [states.book]);

	useEffect(() =>
	{
		localStorage.setItem("currChap", states.currChap.toString());
	}, [states.currChap]);

	useEffect(() =>
	{
		preload(musicUrls);
	}, [])

	useEffect(() =>
	{
		controls.getQuestions();
	}, [states.currChap, states.book]);
}
