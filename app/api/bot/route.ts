import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!

async function sendMessage(chatId: number, text: string, keyboard?: object) {
  const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' }
  if (keyboard) body.reply_markup = keyboard
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    const message = update?.message
    if (!message) return NextResponse.json({ ok: true })
    const chatId = message.chat.id
    const firstName = message.from?.first_name || 'друг'
    await sendMessage(chatId, `<b>ТЫ ПОПАЛСЯ</b> 🤢\n\nв носке х*ёвых шмоток\n\nзалетай и исправляй положение 👇`, {
      inline_keyboard: [[{ text: '🏺 Открыть магазин', web_app: { url: APP_URL } }]]
    })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
