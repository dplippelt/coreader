import { useEffect, useMemo, useState } from 'react'
import type { Chapter as Chap } from './books/dracula.ts'
import type { Question } from './books/dracula.ts'
import { getBook, Screens } from './util/utils.ts'
import Page from './elements/Page.tsx'

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
	checkAnswers: ( questions: Question[] ) => void,
}

export type AppStates =
{
	currBook: string | null,
	currChap: number,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
	correct: boolean,
	feedback: boolean,
}

export default function App()
{
	const [screen, setScreen] = useState<Screen>(Screens.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [currBook, setCurrBook] = useState<string | null>(null);
	const [currChap, setCurrChap] = useState<number>(-1);
	const [navWidth, setNavWidth] = useState<number>(0);
	const [correct, setCorrect] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<boolean>(false);

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
		{
			setCorrect(false);
			setFeedback(false);
			setCurrChap(currChap + 1);
		}
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
		const prev = copy.pop()!;
		setScreen(prev);
		setPrevScreens(copy);
	}

	function checkAnswers( questions: Question[] )
	{
		const form = document.querySelector('form');
		const data = new FormData(form!);

		console.log(Object.fromEntries(data));

		setFeedback(true);

		for ( let i = 0; i < questions.length; i++ )
		{
			if ( data.get(`q${i}`) !== questions[i].answer )
				return;
		}


		setCorrect(true);
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
		checkAnswers: checkAnswers,
	}

	const states: AppStates =
	{
		currBook: currBook,
		currChap: currChap,
		screen: screen,
		prevScreens: prevScreens,
		navWidth: navWidth,
		correct: correct,
		feedback: feedback,
	}

	return <Page book={book} states={states} controls={controls}/>
}

