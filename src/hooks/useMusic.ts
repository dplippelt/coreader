import { useRef } from "react"

export default function useMusic()
{
	const ctxRef = useRef<AudioContext | null>(null);
	const srcRef = useRef<AudioBufferSourceNode | null>(null);
	const gainRef = useRef<GainNode | null>(null);
	const arrayBufferCacheRef = useRef<Record<string, ArrayBuffer>>({});
	const audioBufferCacheRef = useRef<Record<string, AudioBuffer>>({});
	const suspendTimeOutIDRef = useRef<number | null>(null);

	async function preload( urls: string[] )
	{
		for ( const url of urls )
		{
			const resp = await fetch(url);
			arrayBufferCacheRef.current[url] = await resp.arrayBuffer();
		}
	}

	async function play( url: string )
	{
		if ( !ctxRef.current )
			ctxRef.current = new AudioContext;

		if ( ctxRef.current.state === "suspended" )
			ctxRef.current.resume();

		if ( !audioBufferCacheRef.current[url] )
		{
			if ( !arrayBufferCacheRef.current[url] )
			{
				const resp = await fetch(url);
				arrayBufferCacheRef.current[url] = await resp.arrayBuffer();
			}
			audioBufferCacheRef.current[url] = await ctxRef.current.decodeAudioData(arrayBufferCacheRef.current[url].slice(0));
		}

		const audioBuffer = audioBufferCacheRef.current[url];
		const source = ctxRef.current.createBufferSource();
		const gainNode = ctxRef.current.createGain();

		source.buffer = audioBuffer;
		source.loop = true;
		source.connect(gainNode);
		gainNode.connect(ctxRef.current.destination);
		gainNode.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainNode.gain.setValueAtTime(0, ctxRef.current.currentTime);
		gainNode.gain.linearRampToValueAtTime(1.0, ctxRef.current.currentTime + 4);
		source.start();

		srcRef.current = source;
		gainRef.current = gainNode;
	}

	function pause()
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		const fadeOutDur = 2;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeOutDur);
		suspendTimeOutIDRef.current = setTimeout(() => ctxRef.current?.suspend(), fadeOutDur * 1000);
	}

	async function resume()
	{
		if ( !ctxRef.current || !gainRef.current )
			return;

		if ( suspendTimeOutIDRef.current !== null )
		{
			clearTimeout(suspendTimeOutIDRef.current);
			suspendTimeOutIDRef.current = null;
		}

		const fadeInDur = 2;

		await ctxRef.current?.resume();
		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current.gain.setValueAtTime(0, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(1, ctxRef.current.currentTime + fadeInDur);
	}

	function stop()
	{
		if ( !ctxRef.current || !srcRef.current ||  !gainRef.current )
			return;

		const fadeOutDur = 2;

		gainRef.current.gain.cancelScheduledValues(ctxRef.current.currentTime);
		gainRef.current.gain.setValueAtTime(gainRef.current.gain.value, ctxRef.current.currentTime);
		gainRef.current.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeOutDur);
		srcRef.current.stop(ctxRef.current!.currentTime + fadeOutDur);
	}

	return { preload, play, pause, resume, stop };
}
