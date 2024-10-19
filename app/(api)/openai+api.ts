import OpenAI from "openai";
import type { SleepData } from "../../types/global";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})

export async function GET(request: Request, { data }: { data: SleepData }) { // add bedtime
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: "You are a sleep expert whose job is to give sleep recommendations." },
            {
                role: "user",
                content: `Based on the following sleep data: time slept = ${data.hoursSlept} hours, times woken up = ${data.timesWokenUp}, provide a sleep recommendation.`,
            },
        ],
    });
	return Response.json(completion.choices[0].message);
}
