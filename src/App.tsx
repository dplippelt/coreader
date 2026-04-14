import { useEffect, useMemo, useState, useRef } from 'react'
import type { Book, Question } from './books/dracula.ts'
import { musicUrls } from './books/dracula.ts'
import { getBook, Screens } from './util/utils.ts'
import Page from './elements/Page.tsx'
import { useSettings } from './elements/SettingsContext.tsx'
import useMusic from './hooks/useMusic.ts'
import { systemPrompt, userPrompt } from './ai/promptInfo.ts'
import { model } from './ai/model.ts'

const DEBUG = true;

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
	toggleMute: () => void,
	setMusicIsPlayingTo: ( setMusicIsPlaying: boolean ) => void,
}

export type AppStates =
{
	currBook: string | null,
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
	const [screen, setScreen] = useState<Screen>(Screens.startMenu);
	const [prevScreens, setPrevScreens] = useState<Screen[]>([]);
	const [currBook, setCurrBook] = useState<string | null>(null);
	const [currChap, setCurrChap] = useState<number>(-1);
	const [navWidth, setNavWidth] = useState<number>(0);
	const [musicIsPlaying, setMusicIsPlaying] = useState<boolean>(false);
	const [muteOn, setMuteOn] = useState<boolean>(false);
	const [zoomLevel, setZoomLevel] = useState<number>(1);
	const [questions, setQuestions] = useState<Record<string, Question[]>>({});
	const apiKey = useRef<string>(import.meta.env.VITE_GROQ_API_KEY);

	const book: Book = useMemo(() => getBook(currBook), [currBook]);

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
		function getChapterContent()
		{
			if ( DEBUG )
				return book.chapters[currChap - 1].content.slice(0, 3000);
			return book.chapters[currChap - 1].content;
		}

		async function fetchGroq()
		{
			if ( currChap <= 0 )
				return;
			if ( questions[`chapter_${currChap}`] !== undefined )
				return;

			const response = await fetch("https://api.groq.com/openai/v1/chat/completions",
				{
					method: "POST",
					headers:
					{
						"Authorization": `Bearer ${apiKey.current}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(
					{
						model: model,
						messages:
						[
							{ role: "system", content: systemPrompt },
							{ role: "user", content: userPrompt(currChap, getChapterContent(), 5) },
						],
						response_format: { type: "json_object" },
					})
				}
			);

			const data = await response.json();
			if ( !response.ok )
			{
				console.error(`GroqError: ${JSON.stringify(data)}`);
				return;
			}

			const text = data.choices[0].message.content;
			console.log(`Groq: ${text}`);
			const parsed = JSON.parse(text);
			setQuestions(prev => ({ ...prev, [`chapter_${currChap}`]: parsed.questions }));
		}

		fetchGroq();
	}, [currChap]);

	useEffect(() =>
	{
		preload(musicUrls);
	}, [])

	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book.chapters.length - 1 )
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

	function setMusicIsPlayingTo( musicIsPlaying: boolean )
	{
		setMusicIsPlaying(musicIsPlaying);
	}

	function toggleMute()
	{
		mute();
		setMuteOn(!muteOn);
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
		setMusicIsPlayingTo: setMusicIsPlayingTo,
		toggleMute: toggleMute,
	}

	const states: AppStates =
	{
		currBook: currBook,
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

