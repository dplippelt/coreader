export const systemPrompt: string = "You are a text comprehension questions generator";

export function userPrompt( chapNum: number, chapContent: string, numQuestions: number, title: string, author: string )
{
	return (
`Please generate ${numQuestions} question that tests the comprehension of chapter ${chapNum} of the book ${title} by ${author}.

Questions can be of one of 3 types: questions with short text answers, multiple choice questions, or true-false questions.

- Short text answers: answers must be 1-2 words maximum. Prefer proper nouns — character names, place names, objects — since these are unambiguous and easy to check programmatically. If the answer is a number, write it in digits (e.g. "50", not "fifty").
- Multiple choice: use exactly 4 options per question. Wrong options must be plausible — drawn from the actual chapter context — not obviously wrong or absurd.
- True/false quality: statements must be definitively and unambiguously true or false based solely on the chapter text.
- Cross-chapter knowledge: questions must be answerable from the current chapter only.
- Question variety: mix — who said a specific line, where a specific event took place, what something was called, what a character did or decided. Vary the shape of the questions, not just the type.
- Avoid giveaways: questions must not contain phrasing that makes the answer obvious.
- Questions should be of medium difficulty.
- Generate a mix of the 3 types of questions.
- Generate the questions based off of the chapter content provided at the end of this prompt.

Structure your response to be an array of JSON Objects using the following JSON Schema:
{
	chapter: number;
	type: "text" | "multiple choice" | "true-false";
	question: string;
	options?: string[] | undefined;
	answer: string;
}

The field containing the array of JSON Objects should be called "questions"

Example output:

"questions":
[
	{
		"type": "multiple choice",
		"question": "Which hotel in Bistritz had Count Dracula arranged for Jonathan to stay at?",
		"options":
		[
			"Hotel Transylvania",
			"Golden Krone Hotel",
			"Borgo Pass Inn",
			"Hotel Royale"
		],
		"answer": "Golden Krone Hotel"
	},
	{
		"type": "true-false",
		"question": "When the driver stopped near a blue flame and stood between Jonathan and it, Jonathan could still see the flame through the driver's body.",
		"answer": "true"
	},
	{
		"type": "multiple choice",
		"question": "Jonathan consulted his polyglot dictionary on the coach and found that 'vrolok' and 'vlkoslak' both meant the same thing. What was it?",
		"options":
		[
			"Satan or sorcerer",
			"Vampire or werewolf",
			"Evil spirit or ghoul",
			"Witch or demon"
		],
		"answer": "Vampire or werewolf"
	},
	{
		"type": "true-false",
		"question": "The landlady of the Golden Krone Hotel placed a crucifix around Jonathan's neck before his departure, saying 'For your mother's sake.'",
		"answer": "true"
	},
	{
		"type": "text",
		"question": "What is the name of the chicken dish Jonathan ate for dinner at his first stop in Klausenburgh?",
		"answer": "paprika hendl"
	}
]


Chapter content:

${chapContent}`);
}
