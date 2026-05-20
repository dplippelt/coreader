export enum Screen
{
	startMenu,
	bookSelectMenu,
	chapSelectMenu,
	settingsMenu,
	reader,
	questions,
	credits,
	error,
}

export function getRightBoundX() : number
{
	const button1 = document.querySelector('.button1');
	const button2 = document.querySelector('.button2');
	const button3 = document.querySelector('.button3');
	const button4 = document.querySelector('.button4');

	if ( !button1 || !button2 || !button3 || !button4 )
		return 0;

	const buttons: Element[] =
	[
		button4,
		button3,
		button2,
		button1,
	];

	let rightButton = button4;
	for ( const button of buttons )
		if ( rightButton!.getBoundingClientRect().right < button!.getBoundingClientRect().right )
			rightButton = button;

	return rightButton!.getBoundingClientRect().right;
}

export const MUSIC_ZOOM_THRESHOLD = 0;
export const MUSIC_MORE_ZOOM_THRESHOLD = -50;
export const MUSIC_ZOOM_FLIP_BACK_THRESHOLD = 150;
