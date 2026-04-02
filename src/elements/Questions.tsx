import styles from './Questions.module.css'
import type { Controls, AppStates } from '../App'
import type { Question } from '../books/dracula'
import { useSettings } from './SettingsContext'

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
				<div className={styles.textResponse}>
					<label className={styles.response}>Answer: </label>
					<input type="text" name={`q${idx}`} defaultValue={""}/>
				</div>
			);
		default:
			return <></>;
	}
}

function Qs( { questions, states, controls } : QuestionsProps )
{
	const settings = useSettings();

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
				<button type="button" onClick={() => states.correct ? controls.next() : controls.checkAnswers(questions)}>
					{states.correct ? "Next Chapter" : "Check Answers"}
				</button>
			</div>
			{states.feedback && <div className={styles.feedback}>{states.correct ? "Correct!" : "Incorrect!"}</div>}
		</form>
	);
}

export default function Questions( { questions, states, controls } : QuestionsProps )
{
	const settings = useSettings();

	if ( !settings.questionsEnabled )
		controls.next();

	return (
		<>
			<Buttons controls={controls}/>
			<Header states={states}/>
			<Qs questions={questions} states={states} controls={controls}/>
		</>
	)
}
