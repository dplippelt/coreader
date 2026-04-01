import styles from './Navigation.module.css'
import type { ChapterControls } from '../App';

type NavigationProps =
{
	currChap: number,
	controls: ChapterControls,
	navWidth: number,
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
			<button onClick={() => controls.prev()}>{getButtonText(currChap)}</button>
			<button onClick={() => controls.select()}>Chapter Select</button>
			<button onClick={() => controls.next()}>Next Chapter</button>
		</>
	)
}

export default function Navigation( { currChap, controls, navWidth } : NavigationProps )
{
	if ( currChap === 0 )
		return <div className={styles.titleMenu} onClick={controls.next}></div>

	return (
		<div className={styles.buttonMenu}>
			<Buttons currChap={currChap} controls={controls}/>
			<div style={{width: navWidth}} className={styles.invNavLeft} onClick={() => controls.prev()}></div>
			<div style={{width: navWidth}} className={styles.invNavRight} onClick={() => controls.next()}></div>
		</div>
	);
}
