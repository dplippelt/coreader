import frankensteinBook from './frankensteinText.ts'
import { type Chapter, type Title, type Book, BookTypes } from '../types.ts'
import { cleanChapter, getHeader, getQuestions, getMusicTrack } from '../utils.ts'

function getContent( chap_text: string )
{
	const matches = [...chap_text.matchAll(/\n(?!\n)/g)];
	const start_idx = matches[0].index + 1;

	return chap_text.substring(start_idx);
}

export default function getFrankenstein(): Book
{
	const rawBook: string = frankensteinBook;
	const rawChapters = [...rawBook.matchAll(/((\nChapter \d+\n)|(\nLetter \d+\n))/g)];
	const title: Title = { num: 0, title: "Frankenstein; or, the modern prometheus", author: "Mary Wollstonecraft Shelley"};
	const chapters: Chapter[] = [];

	for ( let i = 0; i < rawChapters.length; i++ )
	{
		const chap_num = i + 1;
		const start_chap_idx = rawChapters[i].index + 1;
		const end_chap_idx = i + 1 < rawChapters.length ? rawChapters[i + 1].index : rawBook.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN; OR, THE MODERN PROMETHEUS ***") + 7;
		const chap_text = cleanChapter(rawBook, start_chap_idx, end_chap_idx);
		const chap_header = getHeader(rawChapters[i][0]);
		const chap_title = "";
		const chap_content = getContent(chap_text);
		const questions = getQuestions(chap_num, BookTypes.frankenstein);
		const music = getMusicTrack(chap_num);

		chapters.push({ num: chap_num, header: chap_header, title: chap_title, content: chap_content, questions: questions, music: music });
	}

	return { title: title, chapters: chapters };
}
