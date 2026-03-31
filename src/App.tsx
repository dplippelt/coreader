import { useMemo, useState } from 'react'
import dracula from './util/dracula.ts'
import Chapter from './elements/Chapter.tsx'
import Navigation from './elements/Navigation.tsx'
import ChapterSelect from './elements/ChapterSelect.tsx'

export type ChapterControls =
{
	next: (currChap: number) => void,
	prev: (currChap: number) => void,
	select: () => void,
	title: () => void,
}

export default function App()
{
	const book = useMemo(() => dracula(), []);
	let [currChap, setCurrChap] = useState<number>(0);
	let [chapSelect, setChapSelect] = useState<boolean>(false);

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

	function handleTitleScreen()
	{
		setCurrChap(1);
	}

	function goToChapterSelect()
	{
		setChapSelect(true);
	}

	function goToChapter( chapNum: number )
	{
		setCurrChap(chapNum);
		setChapSelect(false);
	}

	const controls: ChapterControls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		select: goToChapterSelect,
		title: handleTitleScreen,
	}

	if ( chapSelect )
		return <ChapterSelect book={book} currChap={currChap} goToChapter={goToChapter}/>

	return (
		<>
			<Navigation currChap={currChap} controls={controls}/>
			<Chapter chapter={book[currChap]} handleTitleScreen={handleTitleScreen}/>
			<Navigation currChap={currChap} controls={controls}/>
		</>
	);
}

