import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (token !== process.env.SETUP_SECRET) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: `${APP_URL}/api/bot` }),
  })
  const data = await res.json()
  return NextResponse.json(data)
}