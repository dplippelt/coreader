import draculaBook from './draculaText.ts'
import type { Chapter, Title, Book } from '../types.ts'
import getChapters from '../utils.ts'

export default function getDracula(): Book
{
	const rawBook: string = draculaBook;
	const rawChapters = [...rawBook.matchAll(/\nCHAPTER [IVXLC]+\n/g)];
	const title: Title = { num: 0, title: "Dracula", author: "Bram Stoker"};
	const chapters: Chapter[] = getChapters(rawBook, rawChapters);

	return { title: title, chapters: chapters };
}
