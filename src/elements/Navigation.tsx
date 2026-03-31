import styles from './Navigation.module.css'
import type { ChapterControls } from '../App';

type NavigationProps =
{
	currChap: number,
	controls: ChapterControls,
}

type ButtonsProps =
{
	currChap: number,
	controls: ChapterControls,
}

function getButtonText( currChap: number )
{
	return currChap === 1 ? "Title Screen" : "Prev Chapter";
}

function Buttons( { currChap, controls } : ButtonsProps )
{
	return (
		<>
			<button onClick={() => controls.prev(currChap)}>{getButtonText(currChap)}</button>
			<button onClick={() => controls.select()}>Chapter Select</button>
			<button onClick={() => controls.next(currChap)}>Next Chapter</button>
		</>
	)
}

export default function Navigation( { currChap, controls } : NavigationProps )
{
	if ( currChap === 0 )
		return <div className={styles.titleMenu} onClick={controls.title}></div>

	return (
		<div className={styles.buttonMenu}>
			<Buttons currChap={currChap} controls={controls}/>
			<div className={styles.invNavLeft} onClick={() => controls.prev(currChap)}></div>
			<div className={styles.invNavRight} onClick={() => controls.next(currChap)}></div>
		</div>
	);
}
