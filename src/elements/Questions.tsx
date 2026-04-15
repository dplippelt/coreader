import styles from './Questions.module.css'
import type { Controls, AppStates } from '../App'
import type { Question } from '../books/dracula'
import { useSettings } from './SettingsContext'
import { useState } from 'react'

type ButtonProps =
{
	controls: Controls,
}

type HeaderProps =
{
	states: AppStates,
}

type QuestionsProps =
{
	questions: Question[],
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

function Header( { states } : HeaderProps )
{
	return <div className={styles.header}>{`Questions Chapter ${states.currChap}`}</div>;
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
					<label className={styles.response}>Answer: </label>
					<input type="text" name={`q${idx}`} defaultValue={""}/>
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

		console.log(Object.fromEntries(data));

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
				<div key={idx} style={{fontSize: `${settings.fontSize}px`, ...(feedback[idx] === false ? {color: "red"} : {})}}>
					<div className={styles.question}>{question.question}</div>
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

export default function Questions( { questions, states, controls } : QuestionsProps )
{
	if ( questions === undefined )
		controls.getQuestions();

	return (
		<>
			<Buttons controls={controls}/>
			<Header states={states}/>
			{
				questions === undefined
				? <LoadingScreen/>
				: <Qs questions={questions} controls={controls}/>
			}
		</>
	)
}
