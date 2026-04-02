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
			<button onClick={() => controls.startMenu()}>Start Menu</button>
			<button onClick={() => controls.next()}>Skip</button>
		</div>
	);
}

function Header( { states } : HeaderProps )
{
	return <div className={styles.header}>{`Questions Chapter ${states.currChap}`}</div>;
}

function ResponseField( { question, idx } : { question: Question, idx: number } )
{
	switch ( question.type )
	{
		case "multiple choice":
			return (
				<>
					{question.options?.map((op, i) => (
						<label key={i}><input className={styles.response} key={i} type="radio" name={`q${idx}`} value={op}/> {op}</label>
					))}
				</>
			);
		case "true-false":
			return (
				<>
					<label><input className={styles.response} type="radio" name={`q${idx}`} value={"true"}/> True</label>
					<label><input className={styles.response} type="radio" name={`q${idx}`} value={"false"}/> False</label>
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
	const [feedback, setFeedback] = useState<boolean>(false);
	const settings = useSettings();

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

	return (
		<form>
			{questions.map((question, idx) => (
				<div key={idx} style={{fontSize: `${settings.fontSize}px`}}>
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
			{feedback && <div className={styles.feedback}>{correct ? "Correct!" : "Incorrect!"}</div>}
		</form>
	);
}

export default function Questions( { questions, states, controls } : QuestionsProps )
{
	return (
		<>
			<Buttons controls={controls}/>
			<Header states={states}/>
			<Qs questions={questions} controls={controls}/>
		</>
	)
}
