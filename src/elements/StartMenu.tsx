import styles from './StartMenu.module.css'
import type { Controls } from '../App'

type StartMenuProps =
{
	controls: Controls,
}

type ButtonProps =
{
	controls: Controls,
}

function Header()
{
	return <div className={styles.appTitle}>My Reader</div>
}

function Buttons( { controls } : ButtonProps )
{
	return (
		<>
			<button className={styles.startMenuButton} onClick={controls.bookSelect}>Book Selection</button>
			<button className={styles.startMenuButton} onClick={controls.chapSelect}>Chapter Selection</button>
			<button className={styles.startMenuButton}>Settings</button>
		</>
	)
}

export default function StartMenu( { controls } : StartMenuProps )
{
	return (
		<>
			<Header />
			<Buttons controls={controls}/>
		</>
	)
}
