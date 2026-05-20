import styles from './Navigation.module.css'
import type { Controls, AppStates } from '../App';
import { useSettings } from './SettingsContext'

type NavigationProps =
{
	states: AppStates,
	controls: Controls,
}

type ButtonsProps =
{
	states: AppStates,
	controls: Controls,
}

type InvNavProps =
{
	states: AppStates,
	controls: Controls,
}

function getButtonText( currChap: number )
{
	return currChap === 1 ? "Title Page" : "Prev Chapter";
}

function Buttons( { states, controls } : ButtonsProps )
{
	const settings = useSettings();

	return (
		<>
			<button className='button1' onClick={() => controls.prev()}>{getButtonText(states.currChap)}</button>
			<button className='button2' onClick={() => controls.goToStart()}>Start Menu</button>
			<button className='button3' onClick={() => controls.goToChapSelect()}>Chapter Select</button>
			<button className='button4' onClick={() => settings.questionsEnabled ? controls.goToQuestions() : controls.next()}>{settings.questionsEnabled ? "End Chapter" : "Next Chapter"}</button>
		</>
	)
}

function InvNav( { states, controls } : InvNavProps )
{
	const settings = useSettings();

	return (
		<>
			<div style={{width: states.navWidth}} className={styles.invNavLeft} onClick={() => controls.prev()}></div>
			<div style={{width: states.navWidth}} className={styles.invNavRight} onClick={() => settings.questionsEnabled ? controls.goToQuestions() : controls.next()}></div>
		</>
	)
}

export default function Navigation( { states, controls } : NavigationProps )
{
	if ( states.currChap === 0 )
		return <div className={styles.titleMenu} onClick={controls.next}></div>

	return (
		<div className={styles.buttonMenu}>
			<Buttons states={states} controls={controls}/>
			<InvNav states={states} controls={controls}/>
		</div>
	);
}
