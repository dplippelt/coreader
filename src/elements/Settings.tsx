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
				<div className={styles.fontSize}>
					<input
						type="range"
						min={12}
						max={28}
						value={settings.fontSize}
						onChange={(e) => settings.setFontSize(Number(e.target.value))}/>
					<input
						style={{marginLeft: "1rem"}}
						type="number"
						min={12}
						max={28}
						value={settings.fontSize}
						onChange={(e) => settings.setFontSize(Number(e.target.value))}/>
				</div>
			</div>
		</>
	)
}
