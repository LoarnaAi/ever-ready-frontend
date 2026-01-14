import { NextRequest, NextResponse } from 'next/server'

export async function GET(
    request: NextRequest,
    { params }: { params: { postcode: string } }
) {
    const { postcode } = params

    try {
        const response = await fetch(
            `https://rider-agent.ordelo.app/order-hooks/postcode-validator/${encodeURIComponent(postcode)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Postcode not found or invalid' },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        console.error('Postcode lookup error:', error)
        return NextResponse.json(
            { error: 'Failed to lookup postcode' },
            { status: 500 }
        )
    }
}
