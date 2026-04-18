import draculaQs from './dracula/draculaQuestions.json'
import frankensteinQs from './frankenstein/frankensteinQuestions.json'
import music from './dracula/draculaMusic.json'
import { BookTypes, type BookType, type Question } from "./types"

export function cleanChapter( rawBook: string, start_chap_idx: number, end_chap_idx: number ) : string
{
	return rawBook.substring(start_chap_idx, end_chap_idx).replace(/(?<!\n)\n(?!(\n|[ \t]))/g, " ");
}

export function getHeader( header: string ) : string
{
	return header.slice(1, -1);
}

function getQs( bootType: BookType )
{
	switch (bootType)
	{
		case BookTypes.dracula:
			return draculaQs;
		case BookTypes.frankenstein:
			return frankensteinQs;
	}
}

export function getQuestions( chap_num: number, bookType: BookType ): Question[]
{
	const questions: Question[] = [];
	const qs = getQs(bookType);
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
