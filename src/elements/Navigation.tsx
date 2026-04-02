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
	return currChap === 1 ? "Title Screen" : "Prev Chapter";
}

function Buttons( { states, controls } : ButtonsProps )
{
	const settings = useSettings();

	return (
		<>
			<button onClick={() => controls.prev()}>{getButtonText(states.currChap)}</button>
			<button onClick={() => controls.startMenu()}>Start Menu</button>
			<button onClick={() => controls.chapSelect()}>Chapter Select</button>
			<button onClick={() => settings.questionsEnabled ? controls.questions() : controls.next()}>{settings.questionsEnabled ? "End Chapter" : "Next Chapter"}</button>
		</>
	)
}

function InvNav( { states, controls } : InvNavProps )
{
	const settings = useSettings();

	return (
		<>
			<div style={{width: states.navWidth}} className={styles.invNavLeft} onClick={() => controls.prev()}></div>
			<div style={{width: states.navWidth}} className={styles.invNavRight} onClick={() => settings.questionsEnabled ? controls.questions() : controls.next()}></div>
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
