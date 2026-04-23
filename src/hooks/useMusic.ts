import { useRef } from "react"
import { useSettings } from "../elements/SettingsContext"

export default function useMusic()
{
	const ctxRef = useRef<AudioContext | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
	const pauseTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const stopTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const startPlaybackTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const fadeOutEndTime = useRef<number>(0);
	const muteOnRef = useRef<boolean>(false);
	const settings = useSettings();

	function preload( urls: string[] )
	{
		for ( const url of urls )
		{
			audioCacheRef.current[url] = new Audio(url);
		}
	}

	function play( url: string, resumeFadeInDur: number )
	{
		// If no audio context yet exists create one and an accompanying gain node for fine grained volume control
		if ( !ctxRef.current )
		{
			ctxRef.current = new AudioContext;
			gainRef.current = ctxRef.current!.createGain();
			gainRef.current.connect(ctxRef.current!.destination);
		}

		// In case context gets suspended by browser due to e.g. inactivity -> resume
		if ( ctxRef.current.state === "suspended" )
			ctxRef.current.resume();

		// If required audio element was not cached yet, create it and add it to the cache
		if ( !audioCacheRef.current[url] )
			audioCacheRef.current[url] = new Audio(url);

		// Clear pending pause() calls so the audio track does not get paused after the current one starts playing
		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		// need to check if same chapter instead of same track..!!!
		const sameTrack: boolean = audioRef.current === audioCacheRef.current[url];

		// Stop the track that was previously playing if it's not the same one we want to start playing
		// Or resume if it if it is the same one.
		if ( audioRef.current && !sameTrack )
			stop(4);
		else if ( audioRef.current )
			return resume(resumeFadeInDur);

		const playFadeInDur = 4;
		const delay = Math.max(0, fadeOutEndTime.current - ctxRef.current.currentTime);
		const startTime = ctxRef.current.currentTime + delay;

		function initPlay()
		{
			audioCacheRef.current[url].play();
			audioCacheRef.current[url].pause();
		}

		function startPlayback()
		{
			// set the new track as the current track
			audioRef.current = audioCacheRef.current[url];

			// Create source node ("Speakers") for the audio element and connect the gain node (volume control) to it.
			if ( !srcRef.current || srcRef.current.mediaElement !== audioRef.current )
			{
				srcRef.current = ctxRef.current!.createMediaElementSource(audioRef.current);
				srcRef.current.connect(gainRef.current!);
			}

			// Set starting volume to 0 and if mute is off let the music fade in.
			gainRef.current!.gain.setValueAtTime(0, ctxRef.current!.currentTime);
			if ( !muteOnRef.current )
				gainRef.current!.gain.linearRampToValueAtTime(settings.volume, startTime + playFadeInDur);

			// Let the audio track loop, and start playback
			audioRef.current!.loop = true;
			audioRef.current!.play();
		}

		// If we are switching tracks 'initialize' the new track playing and pausing it straight away (to get around autoplay blocking)
		if ( !sameTrack )
			initPlay();

		// Abort previous pending startPlayback to avoid multiple audio tracks playing simultaneously
		clearTimeout(startPlaybackTimeOutIDRef.current);

		// If the previous track is still fading out wait for it to finish before starting the new track
		if ( delay )
			startPlaybackTimeOutIDRef.current = setTimeout(startPlayback, delay * 1000);
		else
			startPlayback();
	}

	function pause( fadeOutDur: number )
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		fadeOutEndTime.current = ctxRef.current.currentTime + fadeOutDur;

		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, fadeOutEndTime.current);
		pauseTimeOutIDRef.current = setTimeout(() => audioRef.current!.pause(), fadeOutDur * 1000);
	}

	function resume( fadeInDur: number )
	{
		if ( !ctxRef.current || !audioRef.current || !gainRef.current )
			return;

		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		gainRef.current!.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current!.gain.linearRampToValueAtTime(settings.volume, ctxRef.current.currentTime + fadeInDur);
		audioRef.current!.play();
	}

	function stop( fadeOutDur: number )
	{
		console.log('stop() called, audioRef:', audioRef.current?.src);

		if ( !ctxRef.current || !audioRef.current || !gainRef.current )
			return;

		if ( pauseTimeOutIDRef.current !== undefined )
		{
			clearTimeout(pauseTimeOutIDRef.current);
			pauseTimeOutIDRef.current = undefined;
			gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		}

		fadeOutEndTime.current = ctxRef.current.currentTime + fadeOutDur;

		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, fadeOutEndTime.current);

		stopTimeOutIDRef.current = setTimeout(() => {
			audioRef.current!.currentTime = 0;
			audioRef.current!.pause();
		}, fadeOutDur * 1000);
	}

	function mute()
	{
		console.log(`volume: ${settings.volume}`);
		if ( !ctxRef.current || !gainRef.current )
			return;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);

		const fadeOutInDur = 0.2;

		if ( !muteOnRef.current )
		{
			gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
			gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeOutInDur);
		}
		else
		{
			gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
			gainRef.current.gain.linearRampToValueAtTime(settings.volume, ctxRef.current.currentTime + fadeOutInDur);
		}

		muteOnRef.current = !muteOnRef.current;
	}

	return { preload, play, pause, stop, mute };
}
