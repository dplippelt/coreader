import styles from './StartMenu.module.css'
import type { Controls, AppStates } from '../App'

type StartMenuProps =
{
	states: AppStates,
	controls: Controls,
}

type ButtonProps =
{
	states: AppStates,
	controls: Controls,
}

function Header()
{
	return <div className={styles.appTitle}>My Reader</div>
}

function Buttons( { states, controls } : ButtonProps )
{
	return (
		<>
			<button className={styles.startMenuButton} onClick={controls.goToBookSelect}>Book Selection</button>
			<button className={styles.startMenuButton} onClick={controls.goToChapSelect}>Chapter Selection</button>
			<button className={styles.startMenuButton} onClick={controls.goToSettings}>Settings</button>
			{ states.currChap !== -1 ? <button className={styles.startMenuButton} onClick={controls.goToPrevScreen}>Continue Reading</button> : <></> }
		</>
	)
}

export default function StartMenu( { states, controls } : StartMenuProps )
{
	return (
		<>
			<Header />
			<Buttons states={states} controls={controls}/>
		</>
	)
}
