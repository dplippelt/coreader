import draculaQs from './dracula/draculaQuestions.json'
import frankensteinQs from './frankenstein/frankensteinQuestions.json'
import draculaMusic from './dracula/draculaMusic.json'
import frankensteinMusic from './frankenstein/frankensteinMusic.json'
import { BookID, type Chapter, type Question, type BookMusic } from "./types"

function getEndIdx( bookID: BookID )
{
	switch (bookID)
	{
		case BookID.dracula:
			return 200;
		case BookID.frankenstein:
			return 0;
		default:
			throw new Error(`Unknown book ID: ${bookID}`);
	}
}

function getMatchIdx( bookID: BookID )
{
	switch (bookID)
	{
		case BookID.dracula:
			return 1;
		case BookID.frankenstein:
			return 0;
		default:
			throw new Error(`Unknown book ID: ${bookID}`);
	}
}

function getQs( bookID: BookID )
{
	switch (bookID)
	{
		case BookID.dracula:
			return draculaQs;
		case BookID.frankenstein:
			return frankensteinQs;
		default:
			throw new Error(`Unknown book ID: ${bookID}`);
	}
}

function cleanChapter( rawBook: string, start_chap_idx: number, end_chap_idx: number ) : string
{
	return rawBook.substring(start_chap_idx, end_chap_idx).replace(/(?<!\n)\n(?!(\n|[ \t]))/g, " ");
}

function getHeader( header: string ) : string
{
	return header.slice(1, -1);
}

function getTitle( chap_text: string, bookID: BookID )
{
	const temp = chap_text.substring(0, getEndIdx(bookID));
	const start_idx = temp.search(/\n(?!\n)/) + 1;
	const end_idx = temp.indexOf("\n", start_idx);

	return temp.substring(start_idx, end_idx);
}

function getContent( chap_text: string, bookID: BookID )
{
	const matches = [...chap_text.matchAll(/\n(?!\n)/g)];
	const start_idx = matches[getMatchIdx(bookID)].index + 1;

	return chap_text.substring(start_idx);
}

function getQuestions( chap_num: number, bookID: BookID ): Question[]
{
	const questions: Question[] = [];
	const qs = getQs(bookID);
	const key = `chapter_${chap_num}` as string as keyof typeof qs;
	const chap_qs = qs[key] ?? [];

	for ( let q of chap_qs )
	{
		questions.push(
		{
			chapter: chap_num,
			type: q.type as Question['type'],
			question: q.question,
			options: q.options,
			answer: q.answer
		});
	}

	return questions;
}

function getMusicTrack( chap_num: number , bookID: BookID) : string
{
	let bookMusic: BookMusic;

	switch (bookID)
	{
		case BookID.dracula:
			bookMusic = draculaMusic;
			break;
		case BookID.frankenstein:
			bookMusic = frankensteinMusic;
			break;
		default:
			throw new Error(`Unknown book ID: ${bookID}`);
	}

	const key = `chapter_${chap_num}` as keyof typeof bookMusic;


	if ( bookMusic[key] )
		return bookMusic[key].url;
	return bookMusic[`chapter_1`].url;
}

export default function getChapters( rawBook: string, rawChapters: RegExpExecArray[], bookID: BookID )
{
	const chapters: Chapter[] = [];

	for ( let i = 0; i < rawChapters.length; i++ )
	{
		const chap_num = i + 1;
		const start_chap_idx = rawChapters[i].index + 1;
		const end_chap_idx = i + 1 < rawChapters.length ? rawChapters[i + 1].index : rawBook.indexOf("*** END OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN; OR, THE MODERN PROMETHEUS ***") + 7;
		const chap_text = cleanChapter(rawBook, start_chap_idx, end_chap_idx);
		const chap_header = getHeader(rawChapters[i][0]);
		const chap_title = getTitle(chap_text, bookID);;
		const chap_content = getContent(chap_text, bookID);
		const questions = getQuestions(chap_num, bookID);
		const music = getMusicTrack(chap_num, bookID);

		chapters.push({ num: chap_num, header: chap_header, title: chap_title, content: chap_content, questions: questions, music: music });
	}

	return chapters;
}
