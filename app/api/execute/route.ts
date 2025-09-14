import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const PISTON_API_URL = "https://emkc.org/api/v2/piston";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Forward to Piston execute API
    const { data } = await axios.post(`${PISTON_API_URL}/execute`, body, {
      headers: { "Content-Type": "application/json" },
      timeout: 30000,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    let status = 500;
    let message = "Execution failed";

    if (axios.isAxiosError(error)) {
      status = error.response?.status ?? 500;
      const data: unknown = error.response?.data;
      const apiMessage =
        (typeof (data as Record<string, unknown>)?.message === "string"
          ? ((data as Record<string, unknown>).message as string)
          : undefined) || error.message;
      if (apiMessage) message = apiMessage;
    } else if (error instanceof Error) {
      message = error.message || message;
    }

    return NextResponse.json({ error: message }, { status });
  }
}
