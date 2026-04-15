import { createContext, useContext, useState } from "react"
import type { Dispatch, SetStateAction, ReactNode } from "react"

export type SettingsContextType =
{
	questionsEnabled: boolean,
	setQuestionsEnabled: Dispatch<SetStateAction<boolean>>,
	aiQuestionsEnabled: boolean,
	setAiQuestionsEnabled: Dispatch<SetStateAction<boolean>>,
	fontSize: number,
	setFontSize: Dispatch<SetStateAction<number>>,
	musicEnabled: boolean,
	setMusicEnabled: Dispatch<SetStateAction<boolean>>,
	volume: number,
	setVolume: Dispatch<SetStateAction<number>>,
	resetSettings: () => void,
}

type Settings =
{
	questionsEnabled: boolean,
	aiQuestionsEnabled: boolean,
	fontSize: number,
	musicEnabled: boolean,
	volume: number,
}

const defaultSettings: Settings =
{
	questionsEnabled: true,
	aiQuestionsEnabled: true,
	fontSize: 24,
	musicEnabled: true,
	volume: 0.5,
};

const SettingsContext = createContext<SettingsContextType | null>(null);

function loadSettings()
{
	const stored = localStorage.getItem("settings");
	const settings = stored ? JSON.parse(stored) : defaultSettings;
	return settings;
}

export default function SettingsProvider( { children } : {children: ReactNode} )
{
	const [settings] = useState<Settings>(loadSettings());
	const [questionsEnabled, setQuestionsEnabled] = useState<boolean>(settings.questionsEnabled);
	const [aiQuestionsEnabled, setAiQuestionsEnabled] = useState<boolean>(settings.aiQuestionsEnabled);
	const [fontSize, setFontSize] = useState<number>(settings.fontSize);
	const [musicEnabled, setMusicEnabled] = useState<boolean>(settings.musicEnabled);
	const [volume, setVolume] = useState<number>(settings.volume);

	function resetSettings()
	{
		setQuestionsEnabled(defaultSettings.questionsEnabled);
		setAiQuestionsEnabled(defaultSettings.aiQuestionsEnabled);
		setFontSize(defaultSettings.fontSize);
		setMusicEnabled(defaultSettings.musicEnabled);
		setVolume(defaultSettings.volume);
	}

	return (
		<SettingsContext.Provider
			value=
			{{
				questionsEnabled, setQuestionsEnabled,
				aiQuestionsEnabled, setAiQuestionsEnabled,
				fontSize, setFontSize,
				musicEnabled, setMusicEnabled,
				volume, setVolume,
				resetSettings,
			}}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings()
{
	return useContext(SettingsContext)!;
}
