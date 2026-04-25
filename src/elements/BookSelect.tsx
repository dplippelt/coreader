import styles from './BookSelect.module.css'
import type { Controls } from '../App'
import books from '../books/index.ts'

type BookSelectProps =
{
	controls: Controls
}

type BooksProps =
{
	controls: Controls
}

type ButtonMenu =
{
	controls: Controls
}

function ButtonMenu( { controls } : ButtonMenu )
{
	return (
		<div className={styles.buttonMenu}>
			<button onClick={() => controls.goToPrevScreen()}>Back</button>
		</div>
	);
}

function Header()
{
	return <div className={styles.header}>Books</div>;
}

function Books( { controls } : BooksProps )
{
	return (
		<>
			{books.map((book, idx) => (
				<div key={idx} className={styles.book} onClick={() => { controls.setCurrBook(book); controls.goToChapSelect() }}>{book}</div>
			))}
		</>
	);
}

export default function BookSelect( { controls } : BookSelectProps )
{
	return (
		<>
			<ButtonMenu controls={controls}/>
			<Header/>
			<Books controls={controls}/>
		</>
	);
}
