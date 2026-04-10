import { useEffect, useMemo, useState } from 'react'
import type { Chapter as Chap } from './books/dracula.ts'
import { musicUrls } from './books/dracula.ts'
import { getBook, Screens } from './util/utils.ts'
import Page from './elements/Page.tsx'
import { useSettings } from './elements/SettingsContext.tsx'
import useMusic from './hooks/useMusic.ts'

export type Screen = typeof Screens[keyof typeof Screens];

export type Controls =
{
	next: () => void,
	prev: () => void,
	startMenu: () => void,
	chapSelect: () => void,
	bookSelect: () => void,
	settingsMenu: () => void,
	goToChap: ( chapNum: number ) => void,
	goToBook: ( book: string ) => void,
	questions: () => void,
	goToPrevScreen: () => void,
	play: ( url: string ) => Promise<void>,
	pause: () => void,
	resume: () => void,
	stop: () => void,
}

export type AppStates =
{
	currBook: string | null,
	currChap: number,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
}

export default function App()
{
	const settings = useSettings();
	const { preload, play, pause, resume, stop } = useMusic();
	const [screen, setScreen] = useState<Screen>(Screens.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [currBook, setCurrBook] = useState<string | null>(null);
	const [currChap, setCurrChap] = useState<number>(-1);
	const [navWidth, setNavWidth] = useState<number>(0);

	const book: Chap[] = useMemo(() => getBook(currBook), [currBook]);

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

		updateNavWidth();

		window.addEventListener('resize', updateNavWidth);

		return () => window.removeEventListener('resize', updateNavWidth);
	}, [currChap]);

	useEffect(() =>
	{
		preload(musicUrls);
	}, [])

	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book.length - 1 )
			setCurrChap(currChap + 1);
		setScreen(Screens.reader);
	}

	function handlePrevChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap !== 0 )
			setCurrChap(currChap - 1);
		setScreen(Screens.reader);
	}

	function goToStart()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.startMenu);
	}

	function goToBookSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.bookSelectMenu);
	}

	function goToChapterSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.chapSelectMenu);
	}

	function goToSettings()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.settingsMenu);
	}

	function goToBook( bookID: string )
	{
		window.scrollTo(0,0);
		setCurrChap(0);
		setCurrBook(bookID);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.reader);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);
		setCurrChap(chapNum);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.reader);
	}

	function goToQuestions()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.questions);
	}

	function goToPrevScreen()
	{
		if ( prevScreens.length === 0 )
			return;

		window.scrollTo(0, 0);
		const copy = prevScreens.slice();
		let prev = copy.pop()!;
		if ( prev === Screens.questions && !settings.questionsEnabled )
			prev = copy.pop()!;
		setScreen(prev);
		setPrevScreens(copy);
	}

	const controls: Controls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		startMenu: goToStart,
		chapSelect: goToChapterSelect,
		bookSelect: goToBookSelect,
		settingsMenu: goToSettings,
		goToBook: goToBook,
		goToChap: goToChapter,
		questions: goToQuestions,
		goToPrevScreen: goToPrevScreen,
		play: play,
		pause: pause,
		resume: resume,
		stop: stop,
	}

	const states: AppStates =
	{
		currBook: currBook,
		currChap: currChap,
		screen: screen,
		prevScreens: prevScreens,
		navWidth: navWidth,
	}

	return <Page book={book} states={states} controls={controls}/>
}

