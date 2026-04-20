import { useEffect } from 'react'
import type { Book, Question } from './books/types'
import { musicUrls } from './books/types'
import { Screen } from './util/utils.ts'
import Page from './elements/Page.tsx'
import { useSettings } from './elements/SettingsContext.tsx'
import useMusic from './hooks/useMusic.ts'
import useAppState from './hooks/useAppState.ts'
import { systemPrompt, userPrompt } from './ai/promptInfo.ts'
import { model } from './ai/model.ts'
import dracula from './books/dracula/dracula.ts'
import frankstein from './books/frankenstein/frankenstein.ts'

export const DEBUG = true;

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
	pause: ( fadeOutDur: number ) => void,
	resume: ( fadeInDur: number ) => void,
	stop: () => void,
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
	musicIsPlaying: boolean,
	muteOn: boolean,
	questions: Record<string, Record<string, Question[]>>,
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

			if ( !books["dracula"] )
				books["dracula"] = dracula();
			if ( !books["frankenstein"] )
				books["frankenstein"] = frankstein();

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

	async function getQuestions()
	{
		function setStaticQuestions()
		{
			setQuestions(prev =>
			({
				...prev,
				[book!.id]:
				{
					...prev[book!.id],
					[`chapter_${currChap}`]: book!.chapters[currChap - 1].questions
				}
			}));
		}

		function setAIQuestions( questions: Question[] )
		{
			setQuestions(prev =>
			({
				...prev,
				[book!.id]:
				{
					...prev[book!.id],
					[`chapter_${currChap}`]: questions
				}
			}));
		}

		if ( currChap <= 0 )
			return;
		if ( questions[book!.id] !== undefined && questions[book!.id][`chapter_${currChap}`] !== undefined )
			return;
		if ( !settings.aiQuestionsEnabled )
			return setStaticQuestions();

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
			return setStaticQuestions();
		}

		const text = data.choices[0].message.content;
		const parsed = JSON.parse(text);
		setAIQuestions(parsed.questions);
	}

	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book!.chapters.length - 1 )
			setCurrChap(currChap + 1);
		setScreen(Screen.reader);
	}

	function handlePrevChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap !== 0 )
			setCurrChap(currChap - 1);
		setScreen(Screen.reader);
	}

	function goToStart()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.startMenu);
	}

	function goToBookSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.bookSelectMenu);
	}

	function goToChapterSelect()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.chapSelectMenu);
	}

	function goToSettings()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.settingsMenu);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);
		setCurrChap(chapNum);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.reader);
	}

	function goToQuestions()
	{
		window.scrollTo(0, 0);
		setPrevScreens([...prevScreens, screen]);
		setScreen(Screen.questions);
	}

	function goToPrevScreen()
	{
		if ( prevScreens.length === 0 )
			return;

		window.scrollTo(0, 0);

		const copy = prevScreens.slice();
		let prev = copy.pop()!;
		if ( prev === Screen.questions && !settings.questionsEnabled )
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
		setCurrChap(-1);
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
		getQuestions: getQuestions,
	}

	const states: AppStates =
	{
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

