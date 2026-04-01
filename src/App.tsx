import { useEffect, useMemo, useState } from 'react'
import dracula from './util/dracula.ts'
import Chapter from './elements/Chapter.tsx'
import Navigation from './elements/Navigation.tsx'
import ChapterSelect from './elements/ChapterSelect.tsx'

export type ChapterControls =
{
	next: () => void,
	prev: () => void,
	select: () => void,
	goto: ( chapNum: number ) => void,
}

export default function App()
{
	const book = useMemo(() => dracula(), []);
	const [currChap, setCurrChap] = useState<number>(0);
	const [chapSelect, setChapSelect] = useState<boolean>(false);
	const [navWidth, setNavWidth] = useState<number>(0);

	useEffect(() =>
	{
		function updateNavWidth()
		{
			const chapter = document.querySelector('.chapter-ref');
			if ( !chapter )
			{
				console.log(`returning early`);
				return;
			}

			const { left } = chapter.getBoundingClientRect();
			setNavWidth(left - 20);
			console.log(`updated nav width to: ${left}`);
		}

		updateNavWidth();

		window.addEventListener('resize', updateNavWidth);

		return () => window.removeEventListener('resize', updateNavWidth);
	}, [currChap]);


	function handleNextChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap < book.length - 1 )
			setCurrChap(currChap + 1);
	}

	function handlePrevChapter()
	{
		window.scrollTo(0, 0);
		if ( currChap !== 0 )
			setCurrChap(currChap - 1);
	}

	function goToChapterSelect()
	{
		window.scrollTo(0, 0);
		setChapSelect(true);
	}

	function goToChapter( chapNum: number )
	{
		window.scrollTo(0, 0);
		setCurrChap(chapNum);
		setChapSelect(false);
	}

	const controls: ChapterControls =
	{
		next: handleNextChapter,
		prev: handlePrevChapter,
		select: goToChapterSelect,
		goto: goToChapter,
	}

	if ( chapSelect )
		return <ChapterSelect book={book} currChap={currChap} controls={controls}/>

	return (
		<>
			<Navigation currChap={currChap} controls={controls} navWidth={navWidth}/>
			<Chapter chapter={book[currChap]} controls={controls}/>
			<Navigation currChap={currChap} controls={controls} navWidth={navWidth}/>
		</>
	);
}

