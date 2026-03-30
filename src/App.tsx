import { useMemo, useState } from 'react'
import dracula from './util/dracula.ts'
import Chapter from './elements/Chapter.tsx'
import Navigation from './elements/Navigation.tsx'

export default function App()
{
	const book = useMemo(() => dracula(), []);
	let [currChap, setCurrChap] = useState<number>(0);

	function handleNextChapter( currChap: number )
	{
		window.scrollTo(0, 0);
		if ( currChap < book.length - 1 )
			setCurrChap(currChap + 1);
	}

	function handlePrevChapter( currChap: number )
	{
		window.scrollTo(0, 0);
		if ( currChap !== 0 )
			setCurrChap(currChap - 1);
	}

	return (
		<>
			<Navigation currChap={currChap} handleNextChapter={handleNextChapter} handlePrevChapter={handlePrevChapter}/>
			<Chapter chapter={book[currChap]}/>
			<Navigation currChap={currChap} handleNextChapter={handleNextChapter} handlePrevChapter={handlePrevChapter}/>
		</>
	);
}

