import type { AppStates, Controls } from "../App"
import styles from "./TrackSelect.module.css"
import { getBookMusic } from "../books/utils"
import { MiniPlay } from "./MusicButtons"

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
}

type TrackListProps =
{
	states: AppStates,
	controls: Controls,
}

function Menu( { controls } : MenuProps )
{
	return (
		<div className={styles.menu}>
			<button onClick={controls.toggleTrackSelect}>Close</button>
		</div>
	);
}

function TrackList( { states, controls } : TrackListProps )
{
	const trackList = Object.values(getBookMusic(states.currBook));

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
					<div>{track.artist} - {track.title}</div>
				</div>
			))}
		</div>
	);
}

function Window(  { states, controls } : WindowProps )
{
	return (
		<div className={styles.window}>
			<Menu controls={controls}/>
			<TrackList states={states} controls={controls}/>
		</div>
	)
}

export default function TrackSelect( { states, controls } : TrackSelectProps )
{
	return (
		<div className={styles.background}>
			<Window states={states} controls={controls}/>
		</div>
	)
}
