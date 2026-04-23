import styles from './Error.module.css'
import type { AppStates } from '../App'

type ErrorProps =
{
	states: AppStates,
}

export default function Error( { states } : ErrorProps )
{
	return (
		<div className={styles.info}>
			<div className={styles.error}>Fatal application error</div>
			<div className={styles.errorDetails}>{ states.error ? states.error.message : "Unknown error" }</div>
		</div>
	);
}
