import { useEffect, useMemo, useState } from 'react'
import type { Chapter as Chap } from './books/dracula.ts'
import { getBook, Screens } from './util/utils.ts'
import Page from './elements/Page.tsx'

export type Screen = typeof Screens[keyof typeof Screens];

export type Controls =
{
	next: () => void,
	prev: () => void,
	chapSelect: () => void,
	bookSelect: () => void,
	goToChap: ( chapNum: number ) => void,
	goToBook: ( book: string ) => void,
	goToPrevScreen: () => void,
}

export type AppStates =
{
	bookID: string | null,
	currChap: number,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
}

export default function App()
{
	const [screen, setScreen] = useState<Screen>(Screens.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [currBook, setCurrBook] = useState<string | null>(null);
	const [currChap, setCurrChap] = useState<number>(0);
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


	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book.length - 1 )
			setCurrChap(currChap + 1);
	}

	function handlePrevChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap !== 0 )
			setCurrChap(currChap - 1);
	}

	function goToChapterSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.chapSelectMenu);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);
		setCurrChap(chapNum);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.reader);
	}

	function goToBookSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.bookSelectMenu);
	}

	function goToBook( book: string )
	{
		window.scrollTo(0,0);
		setCurrChap(0);
		setCurrBook(book);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screens.reader);
	}

	function goToPrevScreen()
	{
		if ( prevScreens.length === 0 )
			return;

		window.scrollTo(0, 0);
		const prev = prevScreens.pop()!;
		setScreen(prev);
		setPrevScreens(prevScreens.slice(0, prevScreens.length - 1));
	}

	const controls: Controls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		chapSelect: goToChapterSelect,
		bookSelect: goToBookSelect,
		goToChap: goToChapter,
		goToBook: goToBook,
		goToPrevScreen: goToPrevScreen,
	}

	const states: AppStates =
	{
		bookID: currBook,
		currChap: currChap,
		screen: screen,
		prevScreens: prevScreens,
		navWidth: navWidth,
	}

	return <Page book={book} states={states} controls={controls}/>
}

