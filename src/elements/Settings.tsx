import type { Controls } from "../App"
import styles from './Settings.module.css'
import { useSettings } from "./SettingsContext"

type SettingsProps =
{
	controls: Controls,
}

export default function Settings( { controls } : SettingsProps )
{
	const settings = useSettings();

	return (
		<>
			<div className={styles.buttonMenu}>
				<button onClick={() => controls.goToPrevScreen()}>Back</button>
			</div>
			<div className={styles.menuHeader}>Settings</div>
			<div className={styles.settings}>

				<label htmlFor="chapterQs">Enable comprehension questions:</label>
				<input
					id="chapterQs"
					type="checkbox"
					checked={settings.questionsEnabled}
					onChange={(e) => settings.setQuestionsEnabled(e.target.checked)}/>

				<label>Font size:</label>
				<div className={styles.slider}>
					<input
						type="range"
						min={12}
						max={42}
						value={settings.fontSize}
						onChange={(e) => settings.setFontSize(Number(e.target.value))}/>
					<input
						style={{marginLeft: "1rem"}}
						type="number"
						min={12}
						max={42}
						value={settings.fontSize}
						onChange={(e) => settings.setFontSize(Number(e.target.value))}/>
				</div>

				<label htmlFor="music">Enable music:</label>
				<input
					id="music"
					type="checkbox"
					checked={settings.musicEnabled}
					onChange={(e) => settings.setMusicEnabled(e.target.checked)}/>

				<label>Music volume:</label>
				<div className={styles.slider}>
					<input
						type="range"
						min={0}
						max={100}
						value={Math.floor(settings.volume * 100)}
						onChange={(e) => settings.setVolume(Number(e.target.value) / 100)}/>
					<input
						style={{marginLeft: "1rem"}}
						type="number"
						min={0}
						max={100}
						value={Math.floor(settings.volume * 100)}
						onChange={(e) => settings.setVolume(Number(e.target.value) / 100)}/>
				</div>
			</div>
		</>
	)
}
