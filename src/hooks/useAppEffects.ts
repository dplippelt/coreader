import { useEffect } from "react"
import type { AppStates, Controls, SetAppStates } from "../App"
import { useSettings } from "../elements/SettingsContext"
import { getRightBoundX, MUSIC_ZOOM_FLIP_BACK_THRESHOLD, MUSIC_ZOOM_THRESHOLD, Screen } from "../util/utils";

export default function useAppEffects( states: AppStates, setStates: SetAppStates, controls: Controls )
{
	const settings = useSettings();

	useEffect(() =>
	{
		function updateNavWidth()
		{
			const chapter = document.querySelector('.chapter-ref');
			if ( !chapter )
				return;

			const { left } = chapter.getBoundingClientRect();
			setStates.setNavWidth(left - 20);
		}

		function updateZoomLevel()
		{
			setStates.setZoomLevel(window.devicePixelRatio);
		}

		updateNavWidth();
		updateZoomLevel();

		window.addEventListener('resize', updateNavWidth);
		window.addEventListener('resize', updateZoomLevel);

		return () => { window.removeEventListener('resize', updateNavWidth); window.removeEventListener('resize', updateZoomLevel); };
	}, [states.currChap]);

	useEffect(() =>
	{
		localStorage.setItem("settings", JSON.stringify(settings));
	}, [settings]);

	useEffect(() =>
	{
		localStorage.setItem("questions", JSON.stringify(states.questions));
	}, [states.questions]);

	useEffect(() =>
	{
		localStorage.setItem("currChap", states.currChap.toString());
	}, [states.currChap]);

	useEffect(() =>
	{
		localStorage.setItem("currBook", states.currBook);
	}, [states.currBook]);

	useEffect(() =>
	{
		controls.getQuestions(false);
	}, [states.currChap, states.currBook]);

	useEffect(() =>
	{
		localStorage.setItem("currTrack", JSON.stringify(states.currTrack));
	}, [states.currTrack])

	// temporary effect to clear old local storage items
	useEffect(() =>
	{
		localStorage.removeItem("book");
		localStorage.removeItem("books");
	}, []);

	useEffect(() =>
	{
		const obs = new ResizeObserver(() =>
		{
			requestAnimationFrame(() =>
			{
				const musicPlayer = document.querySelector('.musicPlayer');
				if ( !musicPlayer )
					return;
				const rightBoundX = getRightBoundX();
				const musicPlayerX = musicPlayer!.getBoundingClientRect().left;
				const viewportWidth = document.documentElement.clientWidth;
				const diff = (musicPlayerX - rightBoundX) / viewportWidth * 1000;
				console.log(diff);
				controls.updateDiff(diff);
			});
		});

		obs.observe(document.body);
		return () => obs.disconnect();
	}, []);

	useEffect(() =>
	{
		if ( states.screen !== Screen.reader )
			return;

		if ( !states.flipped && states.diff < MUSIC_ZOOM_THRESHOLD )
			controls.toggleFlipped(); //to true
		else if ( states.flipped && states.diff > MUSIC_ZOOM_FLIP_BACK_THRESHOLD )
			controls.toggleFlipped(); //to false
	}, [states.diff]);
}
