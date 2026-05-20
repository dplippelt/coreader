import { useRef } from "react"
import { useSettings } from "../elements/SettingsContext"

export default function useMusic()
{
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const currentChap = useRef<number | null>(null);
	const currentUrl = useRef<string | null>(null);
	const pauseTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const stopTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const startPlaybackTimeOutIDRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const initPlayTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const fadeInIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const fadeOutIntervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
	const fadeInAudio = useRef<HTMLAudioElement | null>(null);
	const fadeOutEndTime = useRef<number>(0);
	const muteOnRef = useRef<boolean>(false);
	const settings = useSettings();

	function fadeOut( audio: HTMLAudioElement, duration: number )
	{
		clearInterval(fadeOutIntervalRef.current);
		const startVolume = audio.volume;
		const interval = 10;
		const steps = duration * 1000 / interval;
		const decr = startVolume / steps;
		fadeOutIntervalRef.current = setInterval(() =>
			{
				audio.volume = Math.max(0, audio.volume - decr);
				if ( audio.volume === 0 )
					clearInterval(fadeOutIntervalRef.current);
			}, interval);
	}

	function fadeIn( audio: HTMLAudioElement, duration: number )
	{
		if ( fadeInAudio.current )
			fadeOut(fadeInAudio.current, 1.5);
		fadeInAudio.current = audio;

		clearInterval(fadeInIntervalRef.current);
		const targetVolume = settings.volume;
		const interval = 10;
		const steps = duration * 1000 / interval;
		const incr = (targetVolume - audio.volume) / steps;
		fadeInIntervalRef.current = setInterval(() =>
			{
				audio.volume = Math.min(targetVolume, audio.volume + incr);
				if ( audio.volume === targetVolume )
				{
					clearInterval(fadeInIntervalRef.current);
					fadeInAudio.current = null;
				}
			}, interval);
	}

	// used when opening a new chapter
	function playChapterAudio( url: string, chapNum: number, resumeFadeInDur: number )
	{
		// Fetch chapter audio and hint browser to buffer aggressively
		const chapterAudio = new Audio(url);
		const sameChap: boolean = currentChap.current === chapNum;
		chapterAudio.preload = 'auto';

		// Clear pending pause() calls so the audio track does not get paused after the current one starts playing
		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		// Stop the track that was previously playing if it's not the same one we want to start playing
		// Or resume if it is the same one.
		if ( audioRef.current && !sameChap )
			stop(4);
		else if ( audioRef.current )
			return resume(resumeFadeInDur);

		const delay = Math.max(0, fadeOutEndTime.current - Date.now() / 1000);

		function initPlay()
		{
			chapterAudio.play();
			initPlayTimeoutRef.current = setTimeout(() => chapterAudio.pause(), 10);
		}

		function startPlayback()
		{
			// set the new track as the current track
			audioRef.current = chapterAudio;
			currentChap.current = chapNum;
			currentUrl.current = url;

			// Set starting volume to 0 and if mute is off let the music fade in.
			audioRef.current.volume = 0;
			if ( !muteOnRef.current )
				fadeIn(audioRef.current, 4);

			// Let the audio track loop, and start playback
			audioRef.current!.loop = true;

			clearTimeout(initPlayTimeoutRef.current);

			audioRef.current!.play();
			fadeOutEndTime.current = 0;
		}

		// If we are switching tracks 'initialize' the new track playing and pausing it straight away (to get around autoplay blocking)
		if ( !sameChap || delay > 0 )
			initPlay();

		// Abort previous pending startPlayback to avoid multiple audio tracks playing simultaneously
		clearTimeout(startPlaybackTimeOutIDRef.current);

		// If the previous track is still fading out wait for it to finish before starting the new track
		if ( delay )
			startPlaybackTimeOutIDRef.current = setTimeout(startPlayback, delay * 1000);
		else
			startPlayback();
	}

	// used for play buttons and when hitting continue reading
	function play( url: string, resumeFadeInDur: number )
	{
		// Fetch audio and hint browser to buffer aggressively
		const audio = new Audio(url);
		const sameAudio: boolean = currentUrl.current === url;
		audio.preload = 'auto';

		// Clear pending pause() calls so the audio track does not get paused after the current one starts playing
		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		// Stop the track that was previously playing if it's not the same one we want to start playing
		// Or resume if it is the same one.
		if ( audioRef.current && !sameAudio )
			stop(1);
		else if ( audioRef.current )
			return resume(resumeFadeInDur);

		const delay = Math.max(0, fadeOutEndTime.current - Date.now() / 1000);

		function initPlay()
		{
			audio.play();
			initPlayTimeoutRef.current = setTimeout(() => audio.pause(), 10);
		}

		function startPlayback()
		{
			// set the new track as the current track
			audioRef.current = audio;
			currentUrl.current = url;

			// Set starting volume to 0 and if mute is off let the music fade in.
			audioRef.current.volume = 0;
			if ( !muteOnRef.current )
				fadeIn(audioRef.current, 4);

			// Let the audio track loop, and start playback
			audioRef.current!.loop = true;

			clearTimeout(initPlayTimeoutRef.current);

			audioRef.current!.play();
			fadeOutEndTime.current = 0;
		}

		// If we are switching tracks 'initialize' the new track playing and pausing it straight away (to get around autoplay blocking)
		if ( !sameAudio || delay > 0 )
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
		if ( !audioRef.current )
			return;

		fadeOut(audioRef.current, fadeOutDur);
		fadeOutEndTime.current = Date.now() / 1000 + fadeOutDur;

		pauseTimeOutIDRef.current = setTimeout(() =>
			audioRef.current!.pause(), fadeOutDur * 1000);
	}

	function resume( fadeInDur: number )
	{
		if ( !audioRef.current )
			return;

		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		if ( !muteOnRef.current )
			fadeIn(audioRef.current, fadeInDur);

		audioRef.current!.play();
	}

	function stop( fadeOutDur: number )
	{
		const audio = audioRef.current;

		if ( !audio )
			return;

		if ( pauseTimeOutIDRef.current !== undefined )
		{
			clearTimeout(pauseTimeOutIDRef.current);
			pauseTimeOutIDRef.current = undefined;
		}

		if ( fadeOutEndTime.current === 0 )
		{
			fadeOut(audio, fadeOutDur);
			fadeOutEndTime.current = Date.now() / 1000 + fadeOutDur;
		}

		stopTimeOutIDRef.current = setTimeout(() => {
			audio!.currentTime = 0;
			audio!.pause();
		}, fadeOutDur * 1000);
	}

	function mute()
	{
		if ( !audioRef.current )
			return;

		clearInterval(fadeInIntervalRef.current);
		clearInterval(fadeOutIntervalRef.current);

		const fadeDur = 0.2;

		if ( !muteOnRef.current )
			fadeOut(audioRef.current, fadeDur);
		else
			fadeIn(audioRef.current, fadeDur);

		muteOnRef.current = !muteOnRef.current;
	}

	return { playChapterAudio, play, pause, stop, mute };
}
