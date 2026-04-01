import dracula from './dracula.ts'
import type { Chapter } from './dracula.ts'

export const BOOK =
{
	dracula: 'dracula',
}

export function getBook( bookID: string ) : Chapter[]
{
	switch (bookID)
	{
		case BOOK.dracula:
			return dracula();
		default:
			return [];
	}
}
