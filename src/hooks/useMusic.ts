import { useRef } from "react"

export default function useMusic()
{
	const ctxRef = useRef<AudioContext | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const srcRef = useRef<MediaElementAudioSourceNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const audioCacheRef = useRef<Record<string, HTMLAudioElement>>({});
	const suspendTimeOutIDRef = useRef<number | undefined>(undefined);
	const stopTimeOutIDRef = useRef<number | undefined>(undefined);

	function preload( urls: string[] )
	{
		for ( const url of urls )
		{
			audioCacheRef.current[url] = new Audio(url);
		}
	}

	async function play( url: string )
	{
		if ( !ctxRef.current )
			ctxRef.current = new AudioContext;

		// In case context gets suspended by browser due to e.g. inactivity -> resume
		if ( ctxRef.current.state === "suspended" )
			await ctxRef.current.resume();

		// Pause and reset track that was previously playing
		if ( audioRef.current )
		{
			audioRef.current.currentTime = 0;
			audioRef.current.pause();
		}

		// If required audio element was not cached yet, create it and add it to the cache
		if ( !audioCacheRef.current[url] )
			audioCacheRef.current[url] = new Audio(url);

		audioRef.current = audioCacheRef.current[url];

		if ( !srcRef.current || srcRef.current.mediaElement !== audioRef.current )
		{
			srcRef.current = ctxRef.current.createMediaElementSource(audioRef.current);
			gainRef.current = ctxRef.current.createGain();

			srcRef.current.connect(gainRef.current);
			gainRef.current.connect(ctxRef.current.destination);
		}

		clearTimeout(stopTimeOutIDRef.current);
		stopTimeOutIDRef.current = undefined;
		clearTimeout(suspendTimeOutIDRef.current);
		suspendTimeOutIDRef.current = undefined;

		gainRef.current!.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current!.gain.setValueAtTime(0, ctxRef.current.currentTime);
		gainRef.current!.gain.linearRampToValueAtTime(1.0, ctxRef.current.currentTime + 4);

		audioRef.current.loop = true;
		audioRef.current.play();
	}

	function pause()
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		const fadeOutDur = 2;

		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeOutDur);
		suspendTimeOutIDRef.current = setTimeout(() => audioRef.current!.pause(), fadeOutDur * 1000);
	}

	async function resume()
	{
		if ( !ctxRef.current || !audioRef.current || !gainRef.current )
			return;

		clearTimeout(suspendTimeOutIDRef.current);
		suspendTimeOutIDRef.current = undefined;

		const fadeInDur = 2;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(1, ctxRef.current.currentTime + fadeInDur);

		audioRef.current!.play();
	}

	function stop()
	{
		if ( !ctxRef.current || !srcRef.current ||  !gainRef.current )
			return;

		const fadeOutDur = 2;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeOutDur);
		stopTimeOutIDRef.current = setTimeout(() => { audioRef.current!.currentTime = 0; audioRef.current?.pause() }, fadeOutDur * 1000);
	}

	return { preload, play, pause, resume, stop };
}
