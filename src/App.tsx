import React from 'react'
import type { Book, BookID, Question } from './books/types'
import { Screen } from './util/utils'
import Page from './elements/Page'
import useAppState from './hooks/useAppState'
import useAppControls from './hooks/useAppControls'
import useAppEffects from './hooks/useAppEffects'

export const DEBUG = false;

export type AppStates =
{
	book: Book | null,
	currBook: BookID,
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
	setCurrBook: React.Dispatch<React.SetStateAction<BookID>>,
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
	play: ( url: string, chapNum: number, resumeFadeInDur: number ) => void,
	pause: ( fadeOutDur: number ) => void,
	stop: ( fadeOutDur: number ) => void,
	toggleMute: () => void,
	setMusicIsPlayingTo: ( setMusicIsPlaying: boolean ) => void,
	clearGeneratedQuestions: () => void,
	resetBookProgress: () => void,
	changeCurrBook: ( bookID: string ) => void,
	getQuestions: ( questionsReset: boolean ) => Promise<void>,
}

export default function App()
{
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
		currBook, setCurrBook,
		currChap, setCurrChap,
		questions, setQuestions,
	} = useAppState();

	const states: AppStates =
	{
		book: book,
		currBook: currBook,
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

	const setStates: SetAppStates =
	{
		setBook: setBook,
		setCurrBook: setCurrBook,
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
		changeCurrBook,
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
		changeCurrBook: changeCurrBook,
		getQuestions: getQuestions,
	}

	useAppEffects(states, setStates, controls);

	return <Page book={book} states={states} controls={controls}/>
}

