import { useEffect, useMemo, useState } from 'react'
import type { Chapter as Chap } from './util/dracula.ts'
import { BOOK, getBook } from './util/utils.ts'
import Page from './elements/Page.tsx'

export type ChapterControls =
{
	next: () => void,
	prev: () => void,
	select: () => void,
	goto: ( chapNum: number ) => void,
}

export type AppStates =
{
	bookID: string,
	currChap: number,
	chapSelect: boolean,
	startMenu: boolean,
	navWidth: number,
}

export default function App()
{
	const [bookID, setBookID] = useState<string>(BOOK.dracula);
	const [currChap, setCurrChap] = useState<number>(0);
	const [chapSelect, setChapSelect] = useState<boolean>(false);
	const [startMenu, setStartMenu] = useState<boolean>(true);
	const [navWidth, setNavWidth] = useState<number>(0);

	const book: Chap[] = useMemo(() => getBook(bookID), [bookID]);

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
		setChapSelect(true);
		setStartMenu(false);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);
		setCurrChap(chapNum);
		setChapSelect(false);
		setStartMenu(false);
	}

	const controls: ChapterControls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		select: goToChapterSelect,
		goto: goToChapter,
	}

	const states: AppStates =
	{
		bookID: bookID,
		currChap: currChap,
		chapSelect: chapSelect,
		startMenu: startMenu,
		navWidth: navWidth,
	}

	return <Page book={book} states={states} controls={controls}/>
}

