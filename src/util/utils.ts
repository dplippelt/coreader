import dracula from '../books/dracula.ts'
import type { Chapter } from '../books/dracula.ts'

export const BOOK =
{
	dracula: 'Dracula',
}

export function getBook( bookID: string | null ) : Chapter[]
{
	switch (bookID)
	{
		case BOOK.dracula:
			return dracula();
		default:
			return [];
	}
}

export const Screens =
{
	startMenu: 0,
	bookSelectMenu: 1,
	chapSelectMenu: 2,
	settingsMenu: 3,
	reader: 4,
	questions: 5,
} as const;
