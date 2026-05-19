import { useEffect } from "react"
import type { AppStates, Controls, SetAppStates } from "../App"
import { useSettings } from "../elements/SettingsContext"

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
}
