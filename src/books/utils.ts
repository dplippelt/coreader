import qs from './dracula/draculaQuestions.json'
import music from './dracula/draculaMusic.json'
import type { Chapter, Question } from "./types"

function getHeader( header: string ) : string
{
	return header.slice(1, -1);
}

function getTitle( rawBook: string, start_chap_idx: number ): string
{
	const temp = rawBook.substring(start_chap_idx, start_chap_idx + 200);
	const start_idx = temp.search(/\n(?!\n)/) + 1;
	const end_idx = temp.indexOf("\n", start_idx);

	return temp.substring(start_idx, end_idx);
}

function getContent( rawBook: string, start_chap_idx: number, end_chap_idx: number ): string
{
	const temp = rawBook.substring(start_chap_idx, end_chap_idx);
	const matches = [...temp.matchAll(/\n(?!\n)/g)];
	const start_idx = matches[1].index + 1;

	return temp.substring(start_idx).replace(/(?<!\n)\n(?!(\n|[ \t]))/g, " ");
}

function getQuestions( chap_num: number ): Question[]
{
	const questions: Question[] = [];
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

function getMusicTrack( chap_num: number ) : string
{
	const key = `chapter_${chap_num}` as keyof typeof music;

	if ( music[key] )
		return music[key].url;
	return music[`chapter_1`].url;
}

export default function getChapters( rawBook: string, rawChapters: RegExpExecArray[] ) : Chapter[]
{
	const chapters: Chapter[] = [];

	for ( let i = 0; i < rawChapters.length; i++ )
	{
		const chap_num = i + 1;
		const start_chap_idx = rawChapters[i].index + 1;
		const end_chap_idx = i + 1 < rawChapters.length ? rawChapters[i + 1].index : rawBook.indexOf("THE END") + 7;
		const chap_header = getHeader(rawChapters[i][0]);
		const chap_title = getTitle(rawBook, start_chap_idx);
		const chap_content = getContent(rawBook, start_chap_idx, end_chap_idx);
		const questions = getQuestions(chap_num);
		const music = getMusicTrack(chap_num);

		chapters.push({ num: chap_num, header: chap_header, title: chap_title, content: chap_content, questions: questions, music: music });
	}

	return chapters;
}
