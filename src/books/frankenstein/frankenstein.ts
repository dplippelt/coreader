import frankensteinBook from './frankensteinText.ts'
import type { Chapter, Title, Book } from '../types.ts'
import getChapters from '../utils.ts'

export default function getFrankenstein(): Book
{
	const rawBook: string = frankensteinBook;
	const rawChapters = [...rawBook.matchAll(/((\nChapter \d+\n)|(\nLetter \d+\n))/g)];
	const title: Title = { num: 0, title: "Frankenstein; or, the modern prometheus", author: "Mary Wollstonecraft Shelley"};
	const chapters: Chapter[] = getChapters(rawBook, rawChapters);

	return { title: title, chapters: chapters };
}
