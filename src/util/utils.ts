import getDracula from "../books/dracula/dracula";
import getFrankenstein from "../books/frankenstein/frankenstein";
import { BookID, type Book, type BookMusic } from "../books/types"
import { getBookMusic } from "../books/utils"
import booksIndex from "../books/index";

function getBook( bookID: BookID ) : Book
{
	switch (bookID)
	{
		case BookID.dracula:
			return getDracula();
		case BookID.frankenstein:
			return getFrankenstein();
		default:
			throw new Error(`Unknown book ID: ${bookID}`);
	}
}

function updateMusic( book: Book, bookID: BookID ) : boolean
{
	const bookMusic: BookMusic = getBookMusic(bookID);
	let musicUpdated: boolean = false;

	for ( const chap of book.chapters )
	{
		const key = `chapter_${chap.num}` as keyof typeof bookMusic;

		if ( bookMusic[key] && bookMusic[key].url !== book.chapters[chap.num - 1].music )
		{
			book.chapters[chap.num - 1].music = bookMusic[key].url;
			musicUpdated = true;
		}
	}

	return musicUpdated;
}

export function updateBooks( books: any ) : boolean
{
	let updateBook: boolean = false;

	for ( let bookID of booksIndex )
	{
		if ( !books[bookID] )
			books[bookID] = getBook(bookID);
		else
		{
			const musicUpdated = updateMusic(books[bookID], bookID);
			if ( musicUpdated )
				updateBook = true;
		}
	}

	return updateBook;
}

export enum Screen
{
	startMenu,
	bookSelectMenu,
	chapSelectMenu,
	settingsMenu,
	reader,
	questions,
	credits,
	error,
}
