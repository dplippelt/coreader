import { Play, Pause, SoundOn, SoundOff } from "./MusicButtons"
import styles from "./MusicPlayer.module.css"
import type { AppStates, Controls } from "../App"
import type { SettingsContextType } from "./SettingsContext"
import { useSettings } from "./SettingsContext"
import { useEffect, useRef } from "react"

type MusicPlayerProps =
{
	states: AppStates,
	controls: Controls
}

enum ButtonType
{
	play,
	pause,
	soundOn,
	soundOff,
}

function buttonBehavior( type: ButtonType, states: AppStates, controls: Controls, settings: SettingsContextType )
{
	switch (type)
	{
		case ButtonType.play:
			if ( settings.musicEnabled && !states.musicIsPlaying )
			{
				const chapter = states.book!.chapters[states.currChap - 1];
				controls.play(chapter.music.url, states.currChap, 0.5);
				controls.setMusicIsPlayingTo(true);
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
		default:
			return;
	}
}

function getNowPlaying( states: AppStates ) : string
{
	const music = states.book!.chapters[states.currChap - 1].music;

	return `${music.artist} - ${music.title}`;
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

export default function MusicPlayer( { states, controls } : MusicPlayerProps )
{
	const settings = useSettings();
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
			<div className={musicPlayerButtonStyle(states.zoomLevel)} ref={musicPlayerButtonRef}>
				{ states.musicIsPlaying
					? <Pause onClick={ () => buttonBehavior(ButtonType.pause, states, controls, settings) }/>
					: <Play onClick={ () => buttonBehavior(ButtonType.play, states, controls, settings) }/>
				}
				{ states.muteOn
					? <SoundOff onClick={ () => buttonBehavior(ButtonType.soundOff, states, controls, settings) }/>
					: <SoundOn onClick={ () => buttonBehavior(ButtonType.soundOn, states, controls, settings) }/>
				}
			</div>
			<div className={nowPlayingStyle(states.zoomLevel)} ref={nowPlayingRef}>
				<span ref={nowPlayingSpanRef}>{ getNowPlaying(states) }</span>
			</div>
		</div>

	);
}
