import { useRef } from "react"
import { useSettings } from "../elements/SettingsContext"

export default function useMusic()
{
	const ctxRef = useRef<AudioContext | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
	const pauseTimeOutIDRef = useRef<number | undefined>(undefined);
	const stopTimeOutIDRef = useRef<number | undefined>(undefined);
	const fadeOutEndTime = useRef<number>(0);
	const settings = useSettings();

	function preload( urls: string[] )
	{
		for ( const url of urls )
		{
			audioCacheRef.current[url] = new Audio(url);
		}
	}

	async function play( url: string, muteOn: boolean )
	{
		if ( !ctxRef.current )
			ctxRef.current = new AudioContext;

		// In case context gets suspended by browser due to e.g. inactivity -> resume
		if ( ctxRef.current.state === "suspended" )
			await ctxRef.current.resume();

		// If required audio element was not cached yet, create it and add it to the cache
		if ( !audioCacheRef.current[url] )
			audioCacheRef.current[url] = new Audio(url);

		clearTimeout(stopTimeOutIDRef.current);
		stopTimeOutIDRef.current = undefined;
		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		const fadeInDur = 4;
		const delay = Math.max(0, fadeOutEndTime.current - ctxRef.current.currentTime);
		const startTime = ctxRef.current.currentTime + delay;

		setTimeout(async () => {

			// Reset and pause track that was previously playing
			if ( audioRef.current )
			{
				audioRef.current.currentTime = 0;
				audioRef.current.pause();
			}

			audioRef.current = audioCacheRef.current[url];

			if ( !srcRef.current || srcRef.current.mediaElement !== audioRef.current )
			{
				srcRef.current = ctxRef.current!.createMediaElementSource(audioRef.current);
				gainRef.current = ctxRef.current!.createGain();

				srcRef.current.connect(gainRef.current);
				gainRef.current.connect(ctxRef.current!.destination);
			}

			if ( !muteOn )
			{
				gainRef.current!.gain.setValueAtTime(0, ctxRef.current!.currentTime);
				gainRef.current!.gain.linearRampToValueAtTime(settings.volume, startTime + fadeInDur);
			}

			audioRef.current!.loop = true;
			audioRef.current!.play();

		}, delay * 1000);
	}

	function pause()
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		const fadeOutDur = 2;
		fadeOutEndTime.current = ctxRef.current.currentTime + fadeOutDur;

		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, fadeOutEndTime.current);
		pauseTimeOutIDRef.current = setTimeout(() => audioRef.current!.pause(), fadeOutDur * 1000);
	}

	async function resume( muteOn: boolean )
	{
		if ( !ctxRef.current || !audioRef.current || !gainRef.current )
			return;

		clearTimeout(pauseTimeOutIDRef.current);
		pauseTimeOutIDRef.current = undefined;

		const fadeInDur = 2;
		const delay = Math.max(0, fadeOutEndTime.current - ctxRef.current.currentTime);
		const startTime = ctxRef.current.currentTime + delay;

		setTimeout(async () => {

			if ( !muteOn )
			{
				gainRef.current!.gain.setValueAtTime(0, ctxRef.current!.currentTime);
				gainRef.current!.gain.linearRampToValueAtTime(settings.volume, startTime + fadeInDur);
			}

			audioRef.current!.play();

		}, delay * 1000);
	}

	function stop()
	{
		if ( !ctxRef.current || !audioRef.current ||  !gainRef.current )
			return;

		const fadeOutDur = 2;
		fadeOutEndTime.current = ctxRef.current.currentTime + fadeOutDur;

		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, fadeOutEndTime.current);
		stopTimeOutIDRef.current = setTimeout(() => { audioRef.current!.currentTime = 0; audioRef.current!.pause() }, fadeOutDur * 1000);
	}

	function mute( doMute: boolean )
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		
		if ( doMute )
			gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
		else
			gainRef.current.gain.setValueAtTime(settings.volume, ctxRef.current.currentTime);
	}

	return { preload, play, pause, resume, stop, mute };
}
