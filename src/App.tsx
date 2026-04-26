import React, { useEffect } from 'react'
import type { Book, Question } from './books/types'
import { musicUrls } from './books/types'
import { Screen, updateBooks } from './util/utils'
import Page from './elements/Page'
import { useSettings } from './elements/SettingsContext'
import useMusic from './hooks/useMusic'
import useAppState from './hooks/useAppState'
import useAppControls from './hooks/useAppControls'

export const DEBUG = true;

export type Controls =
{
	next: () => void,
	prev: () => void,
	goToStart: () => void,
	goToChapSelect: () => void,
	goToBookSelect: () => void,
	goToCredits: () => void,
	goToSettings: () => void,
	goToChap: ( chapNum: number ) => void,
	goToQuestions: () => void,
	goToPrevScreen: () => void,
	play: ( url: string, resumeFadeInDur: number ) => void,
	pause: ( fadeOutDur: number ) => void,
	stop: ( fadeOutDur: number ) => void,
	toggleMute: () => void,
	setMusicIsPlayingTo: ( setMusicIsPlaying: boolean ) => void,
	clearGeneratedQuestions: () => void,
	resetBookProgress: () => void,
	setCurrBook: ( bookID: string ) => void,
	getQuestions: () => Promise<void>,
}

export type AppStates =
{
	book: Book | null,
	currChap: number,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
	zoomLevel: number,
	prevMusic: string | null,
	error: Error | null,
	musicIsPlaying: boolean,
	muteOn: boolean,
	questions: Record<string, Record<string, Question[]>>,
}

export type SetAppStates =
{
	setBook: React.Dispatch<React.SetStateAction<Book | null>>,
	setCurrChap: React.Dispatch<React.SetStateAction<number>>,
	setScreen: React.Dispatch<React.SetStateAction<Screen>>,
	setPrevScreens: React.Dispatch<React.SetStateAction<Screen[]>>,
	setNavWidth: React.Dispatch<React.SetStateAction<number>>,
	setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
	setPrevMusic: React.Dispatch<React.SetStateAction<string | null>>,
	setError: React.Dispatch<React.SetStateAction<Error | null>>,
	setMusicIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
	setMuteOn: React.Dispatch<React.SetStateAction<boolean>>,
	setQuestions: React.Dispatch<React.SetStateAction<Record<string, Record<string, Question[]>>>>,
}

export default function App()
{
	const settings = useSettings();
	const { preload } = useMusic();
	const
	{
		screen, setScreen,
		prevScreens, setPrevScreens,
		navWidth, setNavWidth,
		musicIsPlaying, setMusicIsPlaying,
		muteOn, setMuteOn,
		zoomLevel, setZoomLevel,
		prevMusic, setPrevMusic,
		error, setError,
		book, setBook,
		currChap, setCurrChap,
		questions, setQuestions,
	} = useAppState();

	useEffect(() =>
	{
		function initBooks()
		{
			const stored = localStorage.getItem("books");
			const books = stored ? JSON.parse(stored) : {};

			try
			{
				const bookUpdated = updateBooks(books);
				if ( bookUpdated && book )
					setCurrBook(book.id);
			}
			catch ( e )
			{
				console.error(e);
				if ( e instanceof Error )
					setError(e);
				else
					setError(new Error(String(e)));
				setScreen(Screen.error);
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
			setNavWidth(left - 20);
		}

		function updateZoomLevel()
		{
			setZoomLevel(window.devicePixelRatio);
		}

		updateNavWidth();
		updateZoomLevel();

		window.addEventListener('resize', updateNavWidth);
		window.addEventListener('resize', updateZoomLevel);

		return () => { window.removeEventListener('resize', updateNavWidth); window.removeEventListener('resize', updateZoomLevel); };
	}, [currChap]);

	useEffect(() =>
	{
		localStorage.setItem("settings", JSON.stringify(settings));
	}, [settings]);

	useEffect(() =>
	{
		localStorage.setItem("questions", JSON.stringify(questions));
	}, [questions]);

	useEffect(() =>
	{
		localStorage.setItem("book", JSON.stringify(book));
	}, [book]);

	useEffect(() =>
	{
		localStorage.setItem("currChap", currChap.toString());
	}, [currChap]);

	useEffect(() =>
	{
		preload(musicUrls);
	}, [])

	useEffect(() =>
	{
		getQuestions();
	}, [currChap, book]);

	const states: AppStates =
	{
		book: book,
		currChap: currChap,
		screen: screen,
		prevScreens: prevScreens,
		navWidth: navWidth,
		zoomLevel: zoomLevel,
		prevMusic: prevMusic,
		error: error,
		musicIsPlaying: musicIsPlaying,
		muteOn: muteOn,
		questions: questions,
	}

	const setStates :SetAppStates =
	{
		setBook: setBook,
		setCurrChap: setCurrChap,
		setScreen: setScreen,
		setPrevScreens: setPrevScreens,
		setNavWidth: setNavWidth,
		setZoomLevel: setZoomLevel,
		setPrevMusic: setPrevMusic,
		setError: setError,
		setMusicIsPlaying: setMusicIsPlaying,
		setMuteOn: setMuteOn,
		setQuestions: setQuestions,
	}

	const
	{
		handleNextChapter,
		handlePrevChapter,
		goToStart,
		goToChapterSelect,
		goToBookSelect,
		goToCredits,
		goToSettings,
		goToChapter,
		goToQuestions,
		goToPrevScreen,
		play,
		pause,
		stop,
		toggleMute,
		setMusicIsPlayingTo,
		clearGeneratedQuestions,
		resetBookProgress,
		setCurrBook,
		getQuestions,
	} = useAppControls(states, setStates);

	const controls: Controls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		goToStart: goToStart,
		goToChapSelect: goToChapterSelect,
		goToBookSelect: goToBookSelect,
		goToSettings: goToSettings,
		goToCredits: goToCredits,
		goToChap: goToChapter,
		goToQuestions: goToQuestions,
		goToPrevScreen: goToPrevScreen,
		play: play,
		pause: pause,
		stop: stop,
		setMusicIsPlayingTo: setMusicIsPlayingTo,
		toggleMute: toggleMute,
		clearGeneratedQuestions: clearGeneratedQuestions,
		resetBookProgress: resetBookProgress,
		setCurrBook: setCurrBook,
		getQuestions: getQuestions,
	}

	return <Page book={book} states={states} controls={controls}/>
}

