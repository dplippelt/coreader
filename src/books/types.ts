import music from './dracula/draculaMusic.json'

export type Question =
{
	chapter: number,
	type: 'multiple choice' | 'true-false' | 'text',
	question: string,
	options?: string[],
	answer: string,
}

export type Chapter =
{
	num: number,
	header: string,
	title: string,
	content: string,
	questions: Question[],
	music: string,
}

export type Title =
{
	num: 0,
	title: string,
	author: string,
}

export type Book =
{
	title: Title,
	chapters: Chapter[],
}

export type MusicTrack =
{
	url: string,
	title: string,
	artist: string,
}

export const musicUrls = Object.values(music).map(track => track.url);
