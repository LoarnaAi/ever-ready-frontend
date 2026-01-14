import { NextRequest, NextResponse } from 'next/server'

interface AddressComponent {
    long_name: string
    short_name: string
    types: string[]
}

interface GeocodeResult {
    address_components: AddressComponent[]
    formatted_address: string
    geometry: {
        location: {
            lat: number
            lng: number
        }
    }
}

interface GeocodeResponse {
    results: GeocodeResult[]
    status: string
}

export async function GET(
    request: NextRequest,
    { params }: { params: { postcode: string } }
) {
    const { postcode } = params
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

    console.log('[Google API] Postcode lookup request:', postcode)
    console.log('[Google API] API Key present:', !!apiKey)
    console.log('[Google API] API Key length:', apiKey?.length || 0)

    if (!apiKey || apiKey === 'your_google_places_api_key_here') {
        console.error('[Google API] API key not configured')
        return NextResponse.json(
            { error: 'Google Places API key not configured' },
            { status: 500 }
        )
    }

    try {
        // Use Google Geocoding API to lookup postcode
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(postcode)}&components=country:GB&key=${apiKey}`
        console.log('[Google API] Request URL:', url.replace(apiKey, 'API_KEY_HIDDEN'))

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        console.log('[Google API] Response status:', response.status)

        if (!response.ok) {
            console.error('[Google API] Response not OK:', response.status, response.statusText)
            return NextResponse.json(
                { error: 'Failed to lookup postcode' },
                { status: response.status }
            )
        }

        const data: GeocodeResponse = await response.json()
        console.log('[Google API] Response data:', JSON.stringify(data, null, 2))

        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
            console.error('[Google API] Invalid response:', {
                status: data.status,
                resultsLength: data.results?.length || 0
            })
            return NextResponse.json(
                { error: `Postcode not found or invalid (Google status: ${data.status})` },
                { status: 404 }
            )
        }

        const result = data.results[0]
        const components = result.address_components

        // Extract address components
        const getComponent = (types: string[]): string => {
            const component = components.find(c =>
                types.some(type => c.types.includes(type))
            )
            return component?.long_name || ''
        }

        // Build response matching the expected format
        const addressData = {
            house_number: null,
            building_name: null,
            street_name: getComponent(['route', 'street_address']) || getComponent(['neighborhood', 'sublocality']),
            city: getComponent(['postal_town', 'locality']),
            county: getComponent(['administrative_area_level_2']),
            postcode: getComponent(['postal_code']) || postcode.toUpperCase(),
            country: getComponent(['country']),
            latitude: result.geometry.location.lat,
            longitude: result.geometry.location.lng,
        }

        console.log('[Google API] Successfully parsed address data:', addressData)
        return NextResponse.json(addressData)
    } catch (error) {
        console.error('[Google API] Exception during postcode lookup:', error)
        console.error('[Google API] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : 'No stack trace'
        })
        return NextResponse.json(
            { error: 'Failed to lookup postcode' },
            { status: 500 }
        )
    }
}
