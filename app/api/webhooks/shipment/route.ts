import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
