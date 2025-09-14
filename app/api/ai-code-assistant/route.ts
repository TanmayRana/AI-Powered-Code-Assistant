import { inngest } from "@/inngest/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, language } = body;

    if (!code || !language) {
      return new Response("Missing code or language", { status: 400 });
    }

    // Fire event
    const response = await inngest.send({
      name: "ai-code-assistant",
      data: { code, language },
    });

    const runId = response.ids[0];

    // console.log("runId", runId);

    let runStatus;

    while (true) {
      runStatus = await getRunStatus(runId);
      // console.log("runStatus", runStatus);
      const status = runStatus[0]?.status;
      if (status === "Completed") {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return Response.json(runStatus[0]?.output?.output[0]);
  } catch (err) {
    console.error(err);
    return new Response("Internal Server Error", { status: 500 });
  }
}

async function getRunStatus(runId: string) {
  const url = `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`;

  const response = await fetch(
    `${process.env.INNGEST_SERVER_HOST}/v1/events/${runId}/runs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.INNGEST_SIGNING_KEY}`,
      },
    }
  );

  const json = await response.json();
  return json.data;
}
