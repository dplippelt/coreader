import MusicButton from "./MusicButtons"
import { ButtonType } from "./MusicButtons"
import styles from "./MusicPlayer.module.css"
import type { AppStates, Controls } from "../App"
import type { SettingsContextType } from "./SettingsContext"
import { useSettings } from "./SettingsContext"

type MusicPlayerProps =
{
	states: AppStates,
	controls: Controls
}

function buttonBehavior( type: ButtonType, states: AppStates, controls: Controls, settings: SettingsContextType )
{
	switch (type)
	{
		case ButtonType.play:
			if ( settings.musicEnabled && !states.musicIsPlaying )
			{
				controls.resume(states.muteOn);
				controls.setMusicIsPlayingTo(true);
			}
			break;
		case ButtonType.pause:
			if ( settings.musicEnabled && states.musicIsPlaying )
			{
				controls.pause();
				controls.setMusicIsPlayingTo(false);
			}
			break;
		case ButtonType.soundOn:
			controls.setMuteTo(true);
			break;
		case ButtonType.soundOff:
			controls.setMuteTo(false);
			break;
		default:
			return;
	}
}

export default function MusicPlayer( { states, controls } : MusicPlayerProps )
{
	const settings = useSettings();

	return (
		<div className={styles.musicPlayer}>
			<MusicButton type={`${ButtonType.play}`} pressed={false} onClick={ () => buttonBehavior(ButtonType.play, states, controls, settings) } />
			<MusicButton type={`${ButtonType.pause}`} pressed={false} onClick={ () => buttonBehavior(ButtonType.pause, states, controls, settings) } />
			{ states.muteOn
				? <MusicButton type={`${ButtonType.soundOff}`} pressed={false} onClick={ () => buttonBehavior(ButtonType.soundOff, states, controls, settings) } />
				: <MusicButton type={`${ButtonType.soundOn}`} pressed={false} onClick={ () => buttonBehavior(ButtonType.soundOn, states, controls, settings) } />
			}
		</div>
	);
}
