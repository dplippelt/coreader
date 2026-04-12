import { createContext, useContext, useState } from "react"
import type { Dispatch, SetStateAction, ReactNode } from "react"

type SettingsContextType =
{
	questionsEnabled: boolean,
	setQuestionsEnabled: Dispatch<SetStateAction<boolean>>,
	fontSize: number,
	setFontSize: Dispatch<SetStateAction<number>>,
	musicEnabled: boolean,
	setMusicEnabled: Dispatch<SetStateAction<boolean>>,
	volume: number,
	setVolume: Dispatch<SetStateAction<number>>,
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export default function SettingsProvider( { children } : {children: ReactNode} )
{
	const [questionsEnabled, setQuestionsEnabled] = useState<boolean>(true);
	const [fontSize, setFontSize] = useState<number>(16);
	const [musicEnabled, setMusicEnabled] = useState<boolean>(true);
	const [volume, setVolume] = useState<number>(0.5);

	return (
		<SettingsContext.Provider
			value=
			{{
				questionsEnabled, setQuestionsEnabled,
				fontSize, setFontSize,
				musicEnabled, setMusicEnabled,
				volume, setVolume,
			}}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings()
{
	return useContext(SettingsContext)!;
}
