import getDracula from "../src/books/dracula/dracula.ts"
import getFrankenstein from "../src/books/frankenstein/frankenstein.ts"
import type { Book, BookMusic } from "../src/books/types.ts"
import { BookID  } from "../src/books/types.ts"
import booksIndex from "../src/books/index.ts"
import { getBookMusic } from "../src/books/utils.ts"
import fs from "fs"

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

function updateBooks()
{
	let books: Record<string, Book> = {};
	const booksPath: string = "src/data/books.json";

	if ( fs.existsSync(booksPath) )
		books = JSON.parse(fs.readFileSync(booksPath, "utf-8")) as Record<string, Book>;

	for ( const bookID of booksIndex )
	{
		if ( !books[bookID] )
			books[bookID] = getBook(bookID);
		else
			updateMusic(books[bookID], bookID);
	}

	fs.mkdirSync("src/data", { recursive: true });
	fs.writeFileSync(booksPath, JSON.stringify(books, null, 2));
}

try
{
	updateBooks();
}
catch ( e )
{
	console.error(e);
}

