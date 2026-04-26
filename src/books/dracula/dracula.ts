import draculaBook from './draculaText.ts'
import { type Chapter, type Title, type Book, BookID } from '../types.ts'
import getChapters from '../utils.ts'

export default function getDracula(): Book
{
	const rawBook: string = draculaBook;
	const rawChapters = [...rawBook.matchAll(/\nCHAPTER [IVXLC]+\n/g)];
	console.log(rawChapters);
	const title: Title = { num: 0, title: "Dracula", author: "Bram Stoker"};
	const chapters: Chapter[] = getChapters(rawBook, rawChapters, BookID.dracula);

	return { id: BookID.dracula, title: title, chapters: chapters };
}
