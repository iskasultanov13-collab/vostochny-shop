import { NextRequest, NextResponse } from 'next/server'

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
const MANAGER = process.env.NEXT_PUBLIC_MANAGER_TELEGRAM || 'manager'

async function sendMessage(chatId: number, text: string, keyboard?: object) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', reply_markup: keyboard }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const update = await req.json()
    const message = update?.message
    if (!message) return NextResponse.json({ ok: true })
    const chatId = message.chat.id
    const firstName = message.from?.first_name || 'друг'

    await sendMessage(
      chatId,
      `<b>ТЫ ПОПАЛСЯ</b> 🤢\n\nв носке х*ёвых шмоток\n\nзалетай и исправляй положение 👇`,
      {
        inline_keyboard: [
          [
            {
              text: '🏺 Открыть магазин',
              web_app: { url: APP_URL },
            },
          ],
          [
            {
              text: '🤝 Сотрудничество',
              url: `https://t.me/${MANAGER}`,
            },
          ],
          [
            {
              text: '📢 Наш канал',
              url: `https://t.me/+siuRyiAwp043ZTMy`,
            },
          ],
        ],
      }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ ok: true })
}
