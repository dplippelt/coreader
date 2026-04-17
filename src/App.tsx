import { useEffect } from 'react'
import type { Book, Question } from './books/dracula.ts'
import { musicUrls } from './books/dracula.ts'
import { Screens } from './util/utils.ts'
import Page from './elements/Page.tsx'
import { useSettings } from './elements/SettingsContext.tsx'
import useMusic from './hooks/useMusic.ts'
import useAppState from './hooks/useAppState.ts'
import { systemPrompt, userPrompt } from './ai/promptInfo.ts'
import { model } from './ai/model.ts'
import dracula from './books/dracula.ts'

export const DEBUG = true;

export type Screen = typeof Screens[keyof typeof Screens];

export type Controls =
{
	next: () => void,
	prev: () => void,
	goToStart: () => void,
	goToChapSelect: () => void,
	goToBookSelect: () => void,
	goToSettings: () => void,
	goToChap: ( chapNum: number ) => void,
	goToQuestions: () => void,
	goToPrevScreen: () => void,
	play: ( url: string ) => Promise<void>,
	pause: () => void,
	resume: () => void,
	stop: () => void,
	toggleMute: () => void,
	setMusicIsPlayingTo: ( setMusicIsPlaying: boolean ) => void,
	clearGeneratedQuestions: () => void,
	resetBookProgress: () => void,
	setCurrBook: ( bookID: string ) => void,
	addBookToIndex: ( bookID: string ) => void,
	getQuestions: () => Promise<void>,
}

export type AppStates =
{
	booksIndex: string[],
	book: Book | null,
	currChap: number,
	screen: Screen,
	prevScreens: Screen[],
	navWidth: number,
	zoomLevel: number,
	musicIsPlaying: boolean,
	muteOn: boolean,
	questions: Record<string, Question[]>,
}

export default function App()
{
	const settings = useSettings();
	const { preload, play, pause, resume, stop, mute } = useMusic();
	const
	{
		screen, setScreen,
		prevScreens, setPrevScreens,
		navWidth, setNavWidth,
		musicIsPlaying, setMusicIsPlaying,
		muteOn, setMuteOn,
		zoomLevel, setZoomLevel,
		booksIndex, setBooksIndex,
		book, setBook,
		currChap, setCurrChap,
		questions, setQuestions,
	} = useAppState();

	useEffect(() =>
	{
		dracula();
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
		localStorage.setItem("booksIndex", JSON.stringify(booksIndex));
	}, [booksIndex]);

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
		getQuestions();
	}, [currChap]);

	async function getQuestions()
	{
		if ( currChap <= 0 )
			return;
		if ( questions[`chapter_${currChap}`] !== undefined )
			return;
		if ( !settings.aiQuestionsEnabled )
			return setQuestions(prev => ({ ...prev, [`chapter_${currChap}`]: book!.chapters[currChap - 1].questions }));

		function getChapterContent()
		{
			if ( DEBUG )
				return book!.chapters[currChap - 1].content.slice(0, 3000);
			return book!.chapters[currChap - 1].content;
		}

		const response = await fetch("/api/groq",
			{
				method: "POST",
				headers:
				{
					"Content-Type": "application/json",
				},
				body: JSON.stringify(
				{
					model: model,
					systemPrompt: systemPrompt,
					userPrompt: userPrompt(currChap, getChapterContent(), 5),
				})
			}
		);

		const data = await response.json();
		if ( !response.ok )
		{
			console.error(`GroqError: ${JSON.stringify(data)}`);
			return setQuestions(prev => ({ ...prev, [`chapter_${currChap}`]: book!.chapters[currChap - 1].questions }));
		}

		const text = data.choices[0].message.content;
		const parsed = JSON.parse(text);
		setQuestions(prev => ({ ...prev, [`chapter_${currChap}`]: parsed.questions }));
	}

	useEffect(() =>
	{
		preload(musicUrls);
	}, [])

	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book!.chapters.length - 1 )
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

	function setMusicIsPlayingTo( musicIsPlaying: boolean )
	{
		setMusicIsPlaying(musicIsPlaying);
	}

	function toggleMute()
	{
		mute();
		setMuteOn(!muteOn);
	}

	function clearGeneratedQuestions()
	{
		setQuestions({});
	}

	function resetBookProgress()
	{
		setCurrChap(-1);
		setBook(null);
	}

	function setCurrBook( bookID: string )
	{
		const stored = localStorage.getItem("books");
		const books = stored ? JSON.parse(stored) : null;

		if ( !books )
			setBook(null);
		else
			setBook(books[bookID]);
	}

	function addBookToIndex( bookID: string )
	{
		setBooksIndex(prev => [...prev, bookID]);
	}

	const controls: Controls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		goToStart: goToStart,
		goToChapSelect: goToChapterSelect,
		goToBookSelect: goToBookSelect,
		goToSettings: goToSettings,
		goToChap: goToChapter,
		goToQuestions: goToQuestions,
		goToPrevScreen: goToPrevScreen,
		play: play,
		pause: pause,
		resume: resume,
		stop: stop,
		setMusicIsPlayingTo: setMusicIsPlayingTo,
		toggleMute: toggleMute,
		clearGeneratedQuestions: clearGeneratedQuestions,
		resetBookProgress: resetBookProgress,
		setCurrBook: setCurrBook,
		addBookToIndex: addBookToIndex,
		getQuestions: getQuestions,
	}

	const states: AppStates =
	{
		booksIndex: booksIndex,
		book: book,
		currChap: currChap,
		screen: screen,
		prevScreens: prevScreens,
		navWidth: navWidth,
		zoomLevel: zoomLevel,
		musicIsPlaying: musicIsPlaying,
		muteOn: muteOn,
		questions: questions,
	}

	return <Page book={book} states={states} controls={controls}/>
}

