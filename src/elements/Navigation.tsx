import './Navigation.css'

type NavigationPrpos =
{
	currChap: number,
	handleNextChapter: (currChap: number) => void,
	handlePrevChapter: (currChap: number) => void,
}

export default function Navigation( { currChap, handleNextChapter, handlePrevChapter } : NavigationPrpos )
{
	return (
		<div className='menu'>
			<button onClick={() => handlePrevChapter(currChap)}>Prev Chapter</button>
			<button onClick={() => handleNextChapter(currChap)}>Next Chapter</button>
		</div>
	);
}
