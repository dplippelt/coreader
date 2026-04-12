import dracula from '../books/dracula.ts'
import type { Book } from '../books/dracula.ts'

export const BOOK =
{
	dracula: 'Dracula',
}

export function getBook( bookID: string | null ) : Book
{
	switch (bookID)
	{
		case BOOK.dracula:
			return dracula();
		default:
			return { title: { num: 0, title: "none", author: "none"}, chapters: []};
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
