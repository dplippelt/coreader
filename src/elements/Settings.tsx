import type { ChangeEvent } from "react"
import type { Controls } from "../App"
import styles from './Settings.module.css'
import { useSettings } from "./SettingsContext"

type SettingsProps =
{
	controls: Controls,
}

type CheckboxProps =
{
	label: string,
	id: string,
	setting: boolean,
	onChange: ( e: ChangeEvent<HTMLInputElement, HTMLInputElement> ) => void,
}

type SliderProps =
{
	label: string,
	min: number,
	max: number,
	setting: number,
	onChange: ( e: ChangeEvent<HTMLInputElement, HTMLInputElement> ) => void,
}

type DropdownProps =
{
	label: string,
	options: { value: string, label:string }[],
	setting: string,
	onChange: ( e: ChangeEvent<HTMLSelectElement, HTMLSelectElement> ) => void,
}

type ButtonProps =
{
	label: string,
	buttonText: string,
	onClick: () => void,
}

function Checkbok( { label, id, setting, onChange } : CheckboxProps )
{
	return (
		<>
			<label htmlFor={id}>{label}</label>
			<input
				id={id}
				type="checkbox"
				checked={setting}
				onChange={onChange}/>
		</>
	);
}

function Slider( { label, min, max, setting, onChange } : SliderProps )
{
	return (
		<>
			<label>{label}</label>
			<div className={styles.slider}>
				<input
					type="range"
					min={min}
					max={max}
					value={setting}
					onChange={onChange}/>
				<input
					style={{marginLeft: "1rem"}}
					type="number"
					min={min}
					max={max}
					value={setting}
					onChange={onChange}/>
			</div>
		</>
	);
}

function Dropdown( { label, options, setting, onChange } : DropdownProps )
{
	return (
		<>
			<label>{label}</label>
			<select
				value={setting}
				onChange={onChange}
			>
				{ options.map((opt) =>
					<option key={opt.value} value={opt.value}>{opt.label}</option> ) }
			</select>
		</>
	);
}

function Button( { label, buttonText, onClick } : ButtonProps )
{
	return (
		<>
			<label>{label}</label>
			<button className={styles.settingButton} onClick={onClick}>{buttonText}</button>
		</>
	);
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

				<Checkbok
					label="Enable comprehension questions:"
					id="chapterQs"
					setting={settings.questionsEnabled}
					onChange={(e) => settings.setQuestionsEnabled(e.target.checked)}/>

				<Dropdown
					label="Question generation mode:"
					options={[ { value: "static", label: "Static questions" }, { value: "ai", label: "AI generated questions" } ]}
					setting={settings.aiQuestionsEnabled ? "ai" : "static"}
					onChange={(e) => settings.setAiQuestionsEnabled( e.target.value === "ai" ? true : false )}/>

				<Button
					label="Clear generated questions:"
					buttonText="Reset"
					onClick={() => controls.clearGeneratedQuestions()}/>

				<Slider
					label="Font size:"
					min={12}
					max={42}
					setting={settings.fontSize}
					onChange={(e) => settings.setFontSize(Number(e.target.value))}/>

				<Checkbok
					label="Enable music:"
					id="music"
					setting={settings.musicEnabled}
					onChange={(e) => settings.setMusicEnabled(e.target.checked)}/>

				<Slider
					label="Music volume:"
					min={0}
					max={100}
					setting={Math.floor(settings.volume * 100)}
					onChange={(e) => settings.setVolume(Number(e.target.value) / 100)}/>

				<Button
					label="Reset settings to default:"
					buttonText="Reset"
					onClick={settings.resetSettings}/>

			</div>
		</>
	)
}
