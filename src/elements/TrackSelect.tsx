import type { AppStates, Controls } from "../App"
import styles from "./TrackSelect.module.css"
import { getBookMusic } from "../books/utils"
import { MiniPlay } from "./MusicButtons"
import { useRef, type RefObject } from "react"

type TrackSelectProps =
{
	states: AppStates,
	controls: Controls,
}

type MenuProps =
{
	controls: Controls,
}

type WindowProps =
{
	states: AppStates,
	controls: Controls,
	textRefs: RefObject<Map<string, HTMLSpanElement>>,
	wrapperRefs: RefObject<Map<string, HTMLDivElement>>,
}

type TrackListProps =
{
	states: AppStates,
	controls: Controls,
	textRefs: RefObject<Map<string, HTMLSpanElement>>,
	wrapperRefs: RefObject<Map<string, HTMLDivElement>>,
}

function Menu( { controls } : MenuProps )
{
	return (
		<div className={styles.menu}>
			<button onClick={controls.toggleTrackSelect}>Close</button>
		</div>
	);
}

function TrackList( { states, controls, textRefs, wrapperRefs } : TrackListProps )
{
	const trackList = Object.values(getBookMusic(states.currBook));

	function handleMouseEnter( url: string )
	{
		const textRef = textRefs.current.get(url);
		const wrapperRef = wrapperRefs.current.get(url);
		const scrollWidth = textRef!.scrollWidth;
		const containerWidth = wrapperRef!.offsetWidth;
		const scrollDistance = scrollWidth - containerWidth;

		if ( scrollDistance <= 0 )
		{
			textRef!.style.setProperty('--scroll-distance', `0px`);
			textRef!.style.setProperty('--scroll-duration', `0s`);
			return;
		}

		const scrollSpeed = 30;
		const scrollDuration = scrollDistance / scrollSpeed;
		textRef!.style.setProperty('--scroll-distance', `-${scrollDistance}px`);
		textRef!.style.setProperty('--scroll-duration', `${scrollDuration}s`);
	}

	return (
		<div className={styles.trackList}>
			{ trackList.map((track) =>
			(
				<div key={track.url} className={styles.track}>
					<div className={styles.miniPlayButton}>
						<MiniPlay onClick={() =>
							{
								controls.play(track.url, 0.5);
								controls.setMusicIsPlayingTo(true);
								controls.changeCurrTrack(track) }
							}
						/>
					</div>
					<div ref={ (el) => { if (el) wrapperRefs.current.set(track.url, el) } } className={styles.trackTextWrapper} onMouseEnter={() => handleMouseEnter(track.url)}>
						<span ref={ (el) => { if (el) textRefs.current.set(track.url, el) } } className={styles.trackText}>{track.artist} - {track.title}</span>
					</div>
				</div>
			))}
		</div>
	);
}

function Window(  { states, controls, textRefs, wrapperRefs } : WindowProps )
{
	return (
		<div className={styles.window}>
			<Menu controls={controls}/>
			<TrackList states={states} controls={controls} textRefs={textRefs} wrapperRefs={wrapperRefs}/>
		</div>
	)
}

export default function TrackSelect( { states, controls } : TrackSelectProps )
{
	const textRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
	const wrapperRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	return (
		<div className={styles.background}>
			<Window states={states} controls={controls} textRefs={textRefs} wrapperRefs={wrapperRefs}/>
		</div>
	)
}
