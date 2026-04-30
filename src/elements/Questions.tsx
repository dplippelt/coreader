import styles from './Questions.module.css'
import type { AppStates, Controls } from '../App'
import type { Book, Question } from '../books/types'
import { useSettings } from './SettingsContext'
import { useState } from 'react'
import NotepadMenu from './NotepadMenu'
import Notepad from './Notepad'

type ButtonProps =
{
	controls: Controls,
}

type HeaderProps =
{
	header: string,
}

type QuestionsProps =
{
	book: Book | null,
	states: AppStates,
	controls: Controls,
}

type QsProps =
{
	questions: Question[],
	controls: Controls,
}

function Buttons( { controls } : ButtonProps )
{
	return (
		<div className={styles.buttonMenu}>
			<button onClick={() => controls.goToPrevScreen()}>Back</button>
			<button onClick={() => controls.goToStart()}>Start Menu</button>
			<button onClick={() => controls.next()}>Skip</button>
		</div>
	);
}

function Header( { header } : HeaderProps )
{
	return <div className={styles.header}>{`Questions ${header}`}</div>;
}

function capitalize( s: string )
{
	return s[0].toUpperCase() + s.slice(1);
}

function ResponseField( { question, idx } : { question: Question, idx: number } )
{
	switch ( question.type )
	{
		case "multiple choice":
			return (
				<>
					{question.options?.map((op, i) => (
						<label className={styles.label} key={i}><input key={i} type="radio" name={`q${idx}`} value={op}/>{capitalize(op)}</label>
					))}
				</>
			);
		case "true-false":
			return (
				<>
					<label className={styles.label}><input type="radio" name={`q${idx}`} value={"true"}/>True</label>
					<label className={styles.label}><input type="radio" name={`q${idx}`} value={"false"}/>False</label>
				</>
			);
		case "text":
			return (
				<div>
					<label className={styles.textInputLabel}>Answer: </label>
					<input className={styles.textInputBox} type="text" name={`q${idx}`} defaultValue={""}/>
				</div>
			);
		default:
			return <></>;
	}
}

function Qs( { questions, controls } : QsProps )
{
	const [correct, setCorrect] = useState<boolean>(false);
	const [giveFeedback, setGiveFeedback] = useState<boolean>(false);
	const [feedback, setFeedback] = useState<boolean[]>([]);
	const settings = useSettings();

	function checkAnswers( questions: Question[] )
	{
		const form = document.querySelector('form');
		const data = new FormData(form!);
		const fb: boolean[] = [];

		for ( let i = 0; i < questions.length; i++ )
		{
			const response: (string | undefined) = data.get(`q${i}`)?.toString();
			if ( response === undefined )
			{
				fb.push(false);
				continue;
			}

			if ( !response.toLowerCase().includes(questions[i].answer.toLowerCase()) )
			{
				fb.push(false);
				continue;
			}

			fb.push(true);
		}

		if ( fb.find((q) => q === false) === undefined )
			setCorrect(true);
		setFeedback(fb);
		setGiveFeedback(true);
	}

	return (
		<form>
			{questions.map((question, idx) => (
				<div key={idx} style={{fontSize: `${settings.fontSize}px`}}>
					<div className={`${styles.question} ${feedback[idx] === false ? styles.incorrect : ""}`}>{question.question}</div>
					<div className={styles.responseBox}>
						<ResponseField question={question} idx={idx}/>
					</div>
				</div>
			))}
			<div className={styles.buttonMenu}>
				<button type="button" onClick={() => correct ? controls.next() : checkAnswers(questions)}>
					{correct ? "Next Chapter" : "Check Answers"}
				</button>
			</div>
			{giveFeedback && <div className={styles.feedback}>{correct ? "Correct!" : "Incorrect!"}</div>}
		</form>
	);
}

function LoadingScreen()
{
	return <div className={styles.loading}>Loading questions...</div>
}

export default function Questions( { book, states, controls } : QuestionsProps )
{
	const settings = useSettings();

	if ( !settings.questionsEnabled )
	{
		controls.next();
		return;
	}

	const header: string = book!.chapters[states.currChap - 1].header;
	const questions = states.questions[states.currBook] !== undefined ? states.questions[states.currBook][`chapter_${states.currChap}`] : undefined;

	return (
		<>
			<Buttons controls={controls}/>
			<Header header={header}/>
			{
				questions === undefined
				? <LoadingScreen/>
				: <Qs questions={questions} controls={controls}/>
			}
			<NotepadMenu controls={controls}/>
			{ states.notepadVis ? <Notepad controls={controls}/> : <></> }
		</>
	)
}
