import { Play, Pause, SoundOn, SoundOff, TrackSelect } from "./MusicButtons"
import styles from "./MusicPlayer.module.css"
import type { AppStates, Controls } from "../App"
import type { SettingsContextType } from "./SettingsContext"
import { useSettings } from "./SettingsContext"
import { useEffect, useRef, type Ref } from "react"

type MusicPlayerProps =
{
	states: AppStates,
	controls: Controls
}

type MusicPlayerButtonsProps =
{
	states: AppStates,
	controls: Controls
	musicPlayerButtonRef: Ref<HTMLDivElement>,
}

type NowPlayingProps =
{
	states: AppStates,
	nowPlayingRef: Ref<HTMLDivElement>,
	nowPlayingSpanRef: Ref<HTMLSpanElement>,
}

enum ButtonType
{
	play,
	pause,
	soundOn,
	soundOff,
	trackSelect,
}

function buttonBehavior( type: ButtonType, states: AppStates, controls: Controls, settings: SettingsContextType )
{
	switch (type)
	{
		case ButtonType.play:
			if ( settings.musicEnabled && !states.musicIsPlaying )
			{
				controls.play(states.currTrack.url, 0.5);
				controls.setMusicIsPlayingTo(true);
				controls.changeCurrTrack(states.currTrack);
			}
			break;
		case ButtonType.pause:
			if ( settings.musicEnabled && states.musicIsPlaying )
			{
				controls.pause(0.5);
				controls.setMusicIsPlayingTo(false);
			}
			break;
		case ButtonType.soundOn:
			controls.toggleMute();
			break;
		case ButtonType.soundOff:
			controls.toggleMute();
			break;
		case ButtonType.trackSelect:
			controls.toggleTrackSelect();
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

function musicPlayerButtonStyle( zoomLevel: number ) : string
{
	let style = styles.musicPlayerButtons;

	if ( zoomLevel >= 1.5 )
		style = style.concat(` ${styles.musicPlayerButtonsZoomed}`);

	return style;
}

function nowPlayingStyle( zoomLevel: number ) : string
{
	let style = styles.nowPlaying;

	if ( zoomLevel >= 1.5 )
		style = style.concat(` ${styles.nowPlayingZoomed}`);

	return style;
}

function MusicPlayerButtons( { states, controls, musicPlayerButtonRef } : MusicPlayerButtonsProps )
{
	const settings = useSettings();

	return (
		<div className={musicPlayerButtonStyle(states.zoomLevel)} ref={musicPlayerButtonRef}>
			{ states.musicIsPlaying
				? <Pause onClick={ () => buttonBehavior(ButtonType.pause, states, controls, settings) }/>
				: <Play onClick={ () => buttonBehavior(ButtonType.play, states, controls, settings) }/>
			}
			{ states.muteOn
				? <SoundOff onClick={ () => buttonBehavior(ButtonType.soundOff, states, controls, settings) }/>
				: <SoundOn onClick={ () => buttonBehavior(ButtonType.soundOn, states, controls, settings) }/>
			}
			<TrackSelect onClick={ () => buttonBehavior(ButtonType.trackSelect, states, controls, settings) }/>
		</div>
	);
}

function NowPlaying( { states, nowPlayingRef, nowPlayingSpanRef } : NowPlayingProps )
{
	return (
		<div className={nowPlayingStyle(states.zoomLevel)} ref={nowPlayingRef}>
			<span ref={nowPlayingSpanRef}>{ `${states.currTrack.artist} - ${states.currTrack.title}` }</span>
		</div>
	);
}

export default function MusicPlayer( { states, controls } : MusicPlayerProps )
{
	const musicPlayerButtonRef = useRef<HTMLDivElement>(null);
	const nowPlayingRef = useRef<HTMLDivElement>(null);
	const nowPlayingSpanRef = useRef<HTMLSpanElement>(null);

	useEffect(() =>
	{
		if ( !musicPlayerButtonRef.current || !nowPlayingRef.current || !nowPlayingSpanRef.current )
			return

		const obs = new ResizeObserver(() =>
		{
			nowPlayingRef.current!.style.width = `${musicPlayerButtonRef.current!.offsetWidth}px`;

			const scrollWidth = nowPlayingSpanRef.current!.scrollWidth;
			const containerWidth = nowPlayingRef.current!.offsetWidth;
			const scrollDistance = scrollWidth - containerWidth;
			if ( scrollDistance <= 0 )
				return;

			const scrollSpeed = 30; // pixels per second
			const scrollDuration = scrollDistance / scrollSpeed;
			nowPlayingSpanRef.current!.style.setProperty('--scroll-distance', `-${scrollDistance}px`);
			nowPlayingSpanRef.current!.style.setProperty('--scroll-duration', `${scrollDuration}s`);
		});

		obs.observe(musicPlayerButtonRef.current);
		return () => obs.disconnect();
	}, [])

	return (
		<div className={musicPlayerStyle(states.zoomLevel)}>
			<MusicPlayerButtons states={states} controls={controls} musicPlayerButtonRef={musicPlayerButtonRef}/>
			<NowPlaying states={states} nowPlayingRef={nowPlayingRef} nowPlayingSpanRef={nowPlayingSpanRef}/>
		</div>
	);
}
