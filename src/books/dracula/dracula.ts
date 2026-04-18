import draculaBook from './draculaText.ts'
import { type Chapter, type Title, type Book, BookTypes } from '../types.ts'
import { cleanChapter, getHeader, getQuestions, getMusicTrack } from '../utils.ts'

function getTitle( chap_text: string )
{
	const temp = chap_text.substring(0, 200);
	const start_idx = temp.search(/\n(?!\n)/) + 1;
	const end_idx = temp.indexOf("\n", start_idx);

	return temp.substring(start_idx, end_idx);
}

function getContent( chap_text: string )
{
	const matches = [...chap_text.matchAll(/\n(?!\n)/g)];
	const start_idx = matches[1].index + 1;

	return chap_text.substring(start_idx);
}

export default function getDracula(): Book
{
	const rawBook: string = draculaBook;
	const rawChapters = [...rawBook.matchAll(/\nCHAPTER [IVXLC]+\n/g)];
	const title: Title = { num: 0, title: "Dracula", author: "Bram Stoker"};
	const chapters: Chapter[] = [];

	for ( let i = 0; i < rawChapters.length; i++ )
	{
		const chap_num = i + 1;
		const start_chap_idx = rawChapters[i].index + 1;
		const end_chap_idx = i + 1 < rawChapters.length ? rawChapters[i + 1].index : rawBook.indexOf("THE END") + 7;
		const chap_text = cleanChapter(rawBook, start_chap_idx, end_chap_idx);
		const chap_header = getHeader(rawChapters[i][0]);
		const chap_title = getTitle(chap_text);
		const chap_content = getContent(chap_text);
		const questions = getQuestions(chap_num, BookTypes.dracula);
		const music = getMusicTrack(chap_num);

		chapters.push({ num: chap_num, header: chap_header, title: chap_title, content: chap_content, questions: questions, music: music });
	}

	return { title: title, chapters: chapters };
}
