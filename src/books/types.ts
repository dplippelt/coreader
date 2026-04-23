import draculaMusic from './dracula/draculaMusic.json'
import frankensteinMusic from './frankenstein/frankensteinMusic.json'

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
	id: BookID,
	title: Title,
	chapters: Chapter[],
}

export type BookMusic = Record<string, MusicTrack>

export type MusicTrack =
{
	url: string,
	title: string,
	artist: string,
}

export enum BookID
{
	dracula,
	frankenstein,
	error,
}

function getMusicUrls() : string[]
{
	const draculaUrls = Object.values(draculaMusic).map(track => track.url);
	const frankensteinUrls = Object.values(frankensteinMusic).map(track => track.url);

	const allUrls = [...draculaUrls, ...frankensteinUrls];
	const uniqueUrls = new Set(allUrls);

	return [...uniqueUrls];
}

export const musicUrls = getMusicUrls();
