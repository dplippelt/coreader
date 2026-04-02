import { createContext, useContext, useState } from "react"
import type { Dispatch, SetStateAction, ReactNode } from "react"

type SettingsContextType =
{
	questionsEnabled: boolean,
	setQuestionsEnabled: Dispatch<SetStateAction<boolean>>,
	fontSize: number,
	setFontSize: Dispatch<SetStateAction<number>>,
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export default function SettingsProvider( { children } : {children: ReactNode} )
{
	const [questionsEnabled, setQuestionsEnabled] = useState<boolean>(true);
	const [fontSize, setFontSize] = useState<number>(16);

	return (
		<SettingsContext.Provider
			value=
			{{
				questionsEnabled, setQuestionsEnabled,
				fontSize, setFontSize
			}}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings()
{
	return useContext(SettingsContext)!;
}
