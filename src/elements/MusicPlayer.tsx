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
				controls.resume();
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
			controls.toggleMute();
			break;
		case ButtonType.soundOff:
			controls.toggleMute();
			break;
		default:
			return;
	}
}

function musicPlayerStyle( zoomLevel: number ) : string
{
	let style = styles.musicPlayer;

	if ( zoomLevel >= 1.5 )
		style = style.concat(` ${styles.musicPlayerZoomed}`);
	if ( zoomLevel >= 2.22 )
		style = style.concat(` ${styles.musicPlayerZoomedMore}`);

	return style;
}

export default function MusicPlayer( { states, controls } : MusicPlayerProps )
{
	const settings = useSettings();

	return (
		<div className={musicPlayerStyle(states.zoomLevel)}>
			<MusicButton type={`${ButtonType.play}`} onClick={ () => buttonBehavior(ButtonType.play, states, controls, settings) }/>
			<MusicButton type={`${ButtonType.pause}`} onClick={ () => buttonBehavior(ButtonType.pause, states, controls, settings) }/>
			{ states.muteOn
				? <MusicButton type={`${ButtonType.soundOff}`} onClick={ () => buttonBehavior(ButtonType.soundOff, states, controls, settings) }/>
				: <MusicButton type={`${ButtonType.soundOn}`} onClick={ () => buttonBehavior(ButtonType.soundOn, states, controls, settings) }/>
			}
		</div>
	);
}
