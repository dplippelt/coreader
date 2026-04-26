import { model } from "../ai/model"
import { systemPrompt, userPrompt } from "../ai/promptInfo"
import type { AppStates, SetAppStates } from "../App"
import type { Question } from "../books/types"
import { useSettings } from "../elements/SettingsContext"
import { Screen } from "../util/utils"
import { DEBUG } from "../App"
import useMusic from "./useMusic"

export default function useAppControls( states: AppStates, setStates: SetAppStates )
{
	const settings = useSettings();
	const { play, pause, stop, mute } = useMusic();

	async function getQuestions()
	{
		function setStaticQuestions()
		{
			setStates.setQuestions(prev =>
			({
				...prev,
				[states.book!.id]:
				{
					...prev[states.book!.id],
					[`chapter_${states.currChap}`]: states.book!.chapters[states.currChap - 1].questions
				}
			}));
		}

		function setAIQuestions( questions: Question[] )
		{
			setStates.setQuestions(prev =>
			({
				...prev,
				[states.book!.id]:
				{
					...prev[states.book!.id],
					[`chapter_${states.currChap}`]: questions
				}
			}));
		}

		if ( states.currChap <= 0 )
			return;
		if ( states.questions[states.book!.id] !== undefined && states.questions[states.book!.id][`chapter_${states.currChap}`] !== undefined )
			return;
		if ( !settings.aiQuestionsEnabled )
			return setStaticQuestions();

		function getChapterContent()
		{
			if ( DEBUG )
				return states.book!.chapters[states.currChap - 1].content.slice(0, 3000);
			return states.book!.chapters[states.currChap - 1].content;
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
					userPrompt: userPrompt(states.currChap, getChapterContent(), 5),
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

	function startPlay( chapNum: number )
	{
		if ( chapNum === -1 || !settings.musicEnabled )
			return;

		const chapter = states.book!.chapters[chapNum];

		if ( states.musicIsPlaying && chapter.music )
		{
			play(chapter.music, chapNum, 2);
			setStates.setPrevMusic(chapter.music);
		}
		else
			setStates.setPrevMusic(chapter.music ?? null);
	}

	function handleNextChapter()
	{
		goToChapter(states.currChap + 1);
	}

	function handlePrevChapter()
	{
		goToChapter(states.currChap - 1);
	}

	function goToStart()
	{
		window.scrollTo(0, 0);
		pause(2);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.startMenu);
	}

	function goToBookSelect()
	{
		window.scrollTo(0, 0);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.bookSelectMenu);
	}

	function goToChapterSelect()
	{
		window.scrollTo(0, 0);
		pause(2);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.chapSelectMenu);
	}

	function goToSettings()
	{
		window.scrollTo(0, 0);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.settingsMenu);
	}

	function goToCredits()
	{
		window.scrollTo(0, 0);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.credits);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);

		if ( chapNum === 0 )
			pause(2);
		else
			startPlay(chapNum - 1);

		setStates.setCurrChap(chapNum);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.reader);
	}

	function goToQuestions()
	{
		window.scrollTo(0, 0);
		pause(2);
		setStates.setPrevScreens([...states.prevScreens, states.screen]);
		setStates.setScreen(Screen.questions);
	}

	function goToPrevScreen()
	{
		if ( states.prevScreens.length === 0 )
			return;

		window.scrollTo(0, 0);

		const copy = states.prevScreens.slice();
		let prev = copy.pop()!;
		if ( prev === Screen.questions && !settings.questionsEnabled )
			prev = copy.pop()!;

		setStates.setScreen(prev);
		setStates.setPrevScreens(copy);
	}

	function setMusicIsPlayingTo( musicIsPlaying: boolean )
	{
		setStates.setMusicIsPlaying(musicIsPlaying);
	}

	function toggleMute()
	{
		mute();
		setStates.setMuteOn(!states.muteOn);
	}

	function clearGeneratedQuestions()
	{
		setStates.setQuestions({});
	}

	function resetBookProgress()
	{
		setStates.setCurrChap(-1);
		setStates.setBook(null);
	}

	function setCurrBook( bookID: string )
	{
		const stored = localStorage.getItem("books");
		const books = stored ? JSON.parse(stored) : null;

		if ( !books )
			setStates.setBook(null);
		else
			setStates.setBook(books[bookID]);
		setStates.setCurrChap(-1);
	}

	return {
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
	}
}
