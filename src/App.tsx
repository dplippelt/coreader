import React from 'react'
import type { Book, BookID, MusicTrack, Question } from './books/types'
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
	currTrack: MusicTrack,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
	zoomLevel: number,
	error: Error | null,
	notepadVis: boolean,
	trackSelectVis: boolean,
	musicIsPlaying: boolean,
	muteOn: boolean,
	questions: Record<string, Record<string, Question[]>>,
	diff: number,
	flipped: boolean,
}

export type SetAppStates =
{
	setBook: React.Dispatch<React.SetStateAction<Book | null>>,
	setCurrBook: React.Dispatch<React.SetStateAction<BookID>>,
	setCurrChap: React.Dispatch<React.SetStateAction<number>>,
	setCurrTrack: React.Dispatch<React.SetStateAction<MusicTrack>>,
	setScreen: React.Dispatch<React.SetStateAction<Screen>>,
	setPrevScreens: React.Dispatch<React.SetStateAction<Screen[]>>,
	setNavWidth: React.Dispatch<React.SetStateAction<number>>,
	setZoomLevel: React.Dispatch<React.SetStateAction<number>>,
	setError: React.Dispatch<React.SetStateAction<Error | null>>,
	setNotepadVis: React.Dispatch<React.SetStateAction<boolean>>,
	setTrackSelectVis: React.Dispatch<React.SetStateAction<boolean>>,
	setMusicIsPlaying: React.Dispatch<React.SetStateAction<boolean>>,
	setMuteOn: React.Dispatch<React.SetStateAction<boolean>>,
	setQuestions: React.Dispatch<React.SetStateAction<Record<string, Record<string, Question[]>>>>,
	setDiff: React.Dispatch<React.SetStateAction<number>>,
	setFlipped: React.Dispatch<React.SetStateAction<boolean>>,
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
	playChapterAudio: ( url: string, chapNum: number, resumeFadeInDur: number ) => void,
	play: ( url: string, resumeFadeInDur: number ) => void,
	pause: ( fadeOutDur: number ) => void,
	stop: ( fadeOutDur: number ) => void,
	toggleMute: () => void,
	setMusicIsPlayingTo: ( setMusicIsPlaying: boolean ) => void,
	clearGeneratedQuestions: () => void,
	resetBookProgress: () => void,
	changeCurrBook: ( bookID: string ) => void,
	getQuestions: ( questionsReset: boolean ) => Promise<void>,
	toggleNotepad: () => void,
	toggleTrackSelect: () => void,
	changeCurrTrack: ( track: MusicTrack ) => void,
	continueReading: ( currTrack: MusicTrack ) => void,
	updateDiff: ( diff: number ) => void,
	toggleFlipped: () => void,
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
		error, setError,
		notepadVis, setNotepadVis,
		trackSelectVis, setTrackSelectVis,
		currTrack, setCurrTrack,
		book, setBook,
		currBook, setCurrBook,
		currChap, setCurrChap,
		questions, setQuestions,
		diff, setDiff,
		flipped, setFlipped,
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
		error: error,
		notepadVis: notepadVis,
		trackSelectVis: trackSelectVis,
		currTrack: currTrack,
		musicIsPlaying: musicIsPlaying,
		muteOn: muteOn,
		questions: questions,
		diff: diff,
		flipped: flipped,
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
		setError: setError,
		setNotepadVis: setNotepadVis,
		setTrackSelectVis: setTrackSelectVis,
		setCurrTrack: setCurrTrack,
		setMusicIsPlaying: setMusicIsPlaying,
		setMuteOn: setMuteOn,
		setQuestions: setQuestions,
		setDiff: setDiff,
		setFlipped: setFlipped,
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
		playChapterAudio,
		play,
		pause,
		stop,
		toggleMute,
		setMusicIsPlayingTo,
		clearGeneratedQuestions,
		resetBookProgress,
		changeCurrBook,
		getQuestions,
		toggleNotepad,
		toggleTrackSelect,
		changeCurrTrack,
		continueReading,
		updateDiff,
		toggleFlipped,
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
		playChapterAudio: playChapterAudio,
		play: play,
		pause: pause,
		stop: stop,
		setMusicIsPlayingTo: setMusicIsPlayingTo,
		toggleMute: toggleMute,
		clearGeneratedQuestions: clearGeneratedQuestions,
		resetBookProgress: resetBookProgress,
		changeCurrBook: changeCurrBook,
		getQuestions: getQuestions,
		toggleNotepad: toggleNotepad,
		toggleTrackSelect: toggleTrackSelect,
		changeCurrTrack: changeCurrTrack,
		continueReading: continueReading,
		updateDiff: updateDiff,
		toggleFlipped: toggleFlipped,
	}

	useAppEffects(states, setStates, controls);

	return <Page book={book} states={states} controls={controls}/>
}

