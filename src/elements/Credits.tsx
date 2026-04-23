import type { Controls } from '../App'
import styles from './Credits.module.css'
import credits from '../books/musicCredits.json'

type CreditsProps =
{
	controls: Controls
}

export default function Credits( { controls } : CreditsProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			<div className={styles.header}>Credits</div>
			<div className={styles.credits}>
				{ credits.map((credit, idx) =>
					(
						<div className={styles.credit} key={idx}>
							<a href={credit.url}>{credit.artist}</a>
							<em>{credit.title}</em>
						</div>
					))
				}
			</div>
		</>
	);
}
