import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const size = {
    width: 512,
    height: 512,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 240,
                    background: 'linear-gradient(to bottom right, #10b981, #14b8a6)', // Match sidebar: emerald-500 to teal-500
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    borderRadius: '96px', // Scaled rounded corners for 512px
                    fontWeight: 700,
                }}
            >
                GPJ
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
