import qs from './dracula/draculaQuestions.json'
import music from './dracula/draculaMusic.json'
import type { Question } from "./types"

export function cleanChapter( rawBook: string, start_chap_idx: number, end_chap_idx: number ) : string
{
	return rawBook.substring(start_chap_idx, end_chap_idx).replace(/(?<!\n)\n(?!(\n|[ \t]))/g, " ");
}

export function getHeader( header: string ) : string
{
	return header.slice(1, -1);
}

export function getQuestions( chap_num: number ): Question[]
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

export function getMusicTrack( chap_num: number ) : string
{
	const key = `chapter_${chap_num}` as keyof typeof music;

	if ( music[key] )
		return music[key].url;
	return music[`chapter_1`].url;
}
