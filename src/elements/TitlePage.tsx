import type { Title } from '../books/types.ts'
import type { Controls } from '../App.tsx'
import styles from './TitlePage.module.css'

type TitlePageProps =
{
	titlePage: Title,
	controls: Controls,
}

export default function TitlePage( { titlePage, controls } : TitlePageProps )
{
	return (
		<div className={styles.info} onClick={controls.next}>
			<div className={styles.title}>{titlePage.title}</div>
			<div className={styles.author}>{titlePage.author}</div>
		</div>
	);
}
