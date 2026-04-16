import styles from './MusicButtons.module.css'

type ButtonProps =
{
	onClick: () => void,
}

export function Play( { onClick } : ButtonProps )
{
	return (
		<svg className={styles.musicButton} onClick={onClick} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
			<circle className={styles.circle} cx="75" cy="75" r="73"/>
			<g transform="translate(27, 27) scale(4)">
				<path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z"/>
			</g>
		</svg>
	);
}

export function Pause( { onClick } : ButtonProps )
{
	return (
		<svg className={styles.musicButton} onClick={onClick} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
			<circle className={styles.circle} cx="75" cy="75" r="73"/>
			<g transform="translate(25, 27) scale(4)">
				<rect x="14" y="3" width="6" height="18" rx="1"/>
				<rect x="5" y="3" width="6" height="18" rx="1"/>
			</g>
		</svg>
	);
}

export function SoundOn( { onClick } : ButtonProps )
{
	return (
		<svg className={styles.musicButton} onClick={onClick} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
			<circle className={styles.circle} cx="75" cy="75" r="73"/>
			<g transform="translate(26, 27) scale(4)">
				<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
				<g transform="translate(-1, 0)">
					<path fill='none' stroke='#ffffff' strokeWidth='2' d="M16 9a5 5 0 0 1 0 6"/>
					<path fill='none' stroke='#ffffff' strokeWidth='2' d="M19.364 18.364a9 9 0 0 0 0-12.728"/>
				</g>
			</g>
		</svg>
	);
}

export function SoundOff( { onClick } : ButtonProps )
{
	return (
		<svg className={styles.musicButton} onClick={onClick} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
			<circle className={styles.circle} cx="75" cy="75" r="73"/>
			<g transform="translate(26, 27) scale(4)">
				<path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/>
				<g transform="translate(-1, 0)">
					<line fill='none' stroke='#ffffff' strokeWidth='2' x1="22" x2="16" y1="9" y2="15"/>
					<line fill='none' stroke='#ffffff' strokeWidth='2' x1="16" x2="22" y1="9" y2="15"/>
				</g>
			</g>
		</svg>
	);
}
