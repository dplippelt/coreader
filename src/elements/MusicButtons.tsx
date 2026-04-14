import styles from './MusicButton.module.css'

export const ButtonType =
{
	play: "play",
	pause: "pause",
	soundOn: "soundOn",
	soundOff: "soundOff",
} as const;

export type ButtonType = typeof ButtonType[keyof typeof ButtonType];

type MusicButtonProps =
{
	type: ButtonType,
	onClick: () => void,
}

export default function MusicButton( { type, onClick } : MusicButtonProps )
{
	switch (type)
	{
		case ButtonType.play:
			return (
				<svg className={styles.musicButton} onClick={onClick} viewBox="273.983 161.757 210.968 210.968" xmlns="http://www.w3.org/2000/svg">
					<circle className={styles.circle} cx="379.467" cy="267.241" r="105.484"/>
					<polygon style={{fill: "#FFFFFF"}} points="423.174,267.241 352.315,223.618 352.315,310.864 "/>
				</svg>
			);
		case ButtonType.pause:
			return (
				<svg className={styles.musicButton} onClick={onClick} viewBox="714.647 161.757 210.968 210.968" xmlns="http://www.w3.org/2000/svg">
					<circle className={styles.circle} cx="820.133" cy="267.241" r="105.484"/>
					<g>
						<rect x="791.813" y="230.509" style={{fill: "#FFFFFF"}} width="18.805" height="73.464"/>
						<rect x="829.643" y="230.5" style={{fill: "#FFFFFF"}} width="18.81" height="73.482"/>
					</g>
				</svg>
			);
		case ButtonType.soundOn:
			return (
				<svg className={styles.musicButton} onClick={onClick} viewBox="273.983 821.531 210.968 210.968" xmlns="http://www.w3.org/2000/svg">
					<circle className={styles.circle} cx="379.467" cy="927.015" r="105.484"/>
					<g>
						<g>
							<polygon style={{fill: "#FFFFFF"}} points="326.183,927.015 383.129,969.44 383.129,884.589"/>
							<rect x="326.183" y="908.642" style={{fill: "#FFFFFF"}} width="24.945" height="36.744"/>
						</g>
						<g>
							<path style={{fill: "#FFFFFF"}} d="M405.235,966.917c-1.246,0-2.431-0.734-2.946-1.953c-0.687-1.628,0.072-3.505,1.7-4.193
								c13.586-5.743,22.363-18.992,22.363-33.756c0-14.764-8.777-28.013-22.363-33.756c-1.628-0.687-2.387-2.565-1.7-4.193
								c0.684-1.625,2.556-2.387,4.193-1.7c15.957,6.743,26.269,22.307,26.269,39.649s-10.311,32.903-26.269,39.649
								C406.076,966.836,405.651,966.917,405.235,966.917z"/>
						</g>
						<g>
							<path style={{fill: "#FFFFFF"}} d="M399.626,953.652c-1.247,0-2.431-0.734-2.947-1.953c-0.687-1.628,0.072-3.506,1.7-4.193
								c8.249-3.487,13.577-11.53,13.577-20.492s-5.328-17.005-13.577-20.492c-1.628-0.688-2.387-2.566-1.7-4.193
								c0.688-1.625,2.566-2.391,4.193-1.7c10.621,4.49,17.483,14.846,17.483,26.385c0,11.539-6.862,21.895-17.483,26.385
								C400.467,953.571,400.042,953.652,399.626,953.652z"/>
						</g>
						<g>
							<path style={{fill: "#FFFFFF"}} d="M394.127,940.638c-1.247,0-2.431-0.734-2.947-1.956c-0.687-1.628,0.075-3.503,1.703-4.19
								c3.009-1.272,4.952-4.206,4.952-7.477c0-3.272-1.943-6.206-4.952-7.477c-1.628-0.687-2.391-2.563-1.703-4.19
								c0.687-1.631,2.566-2.397,4.19-1.703c5.387,2.272,8.865,7.521,8.865,13.371c0,5.849-3.478,11.096-8.865,13.37
								C394.964,940.557,394.542,940.638,394.127,940.638z"/>
						</g>
					</g>
				</svg>
			);
		case ButtonType.soundOff:
			return (
				<svg className={styles.musicButton} onClick={onClick} viewBox="714.647 821.531 210.968 210.968" xmlns="http://www.w3.org/2000/svg">
					<circle className={styles.circle} cx="820.133" cy="927.015" r="105.484"/>
					<g>
						<g>
							<polygon style={{fill: "#FFFFFF"}} points="769.896,927.015 826.842,969.44 826.842,884.589"/>
							<rect x="769.896" y="908.642" style={{fill: "#FFFFFF"}} width="24.946" height="36.744"/>
						</g>
						<g>
							<rect x="836.046" y="922.534" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -405.2812 875.6049)" style={{fill: "#FFFFFF"}} width="36.501" height="8.962"/>
						</g>
						<g>
							<rect x="849.815" y="908.764" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -405.2808 875.595)" style={{fill: "#FFFFFF"}} width="8.962" height="36.501"/>
						</g>
					</g>
				</svg>
			);
		default:
			return null;
	}
}
