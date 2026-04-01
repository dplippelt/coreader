import styles from './BookSelect.module.css'
import type { Controls } from '../App'
import books from '../books/index.ts'

type BookSelectProps =
{
	controls: Controls
}

export default function BookSelect( { controls } : BookSelectProps )
{
	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			<div className={styles.menuHeader}>Books</div>
			{books.map((book, idx) => (
				<div key={idx} className={styles.book} onClick={() => controls.goToBook(book)}>{book}</div>
			))}
		</>
	)
}
