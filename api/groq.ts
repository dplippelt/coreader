export default async function handler(req: any, res: any)
{
	const { model, systemPrompt, userPrompt } = req.body;
	const response = await fetch("https://api.groq.com/openai/v1/chat/completions",
		{
			method: "POST",
			headers:
			{
				"Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify(
			{
				model: model,
				messages:
				[
					{ role: "system", content: systemPrompt },
					{ role: "user", content: userPrompt },
				],
				response_format: { type: "json_object" },
			})
		}
	);

	const data = await response.json();
	res.status(response.status).json(data);
}
