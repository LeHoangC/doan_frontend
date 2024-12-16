'use client'
import React, { useEffect, useState } from 'react'

const GenCaptionComponent = () => {
    const [value, setValue] = useState('')

    const handleClick = async () => {
        const response = await fetch('http://localhost:3001/v1/api/posts/gen-caption?prompt=nodejs là gì', {
            headers: {
                'Content-Type': 'text/event-stream',
            },
        })

        const reader = response.body?.pipeThrough(new TextDecoderStream()).getReader()

        while (true) {
            const { value, done } = await reader?.read()
            if (done) break
            setValue((prev) => prev + value)
        }
    }

    return (
        <div className="text-white">
            <p>{value}</p>
            <button onClick={handleClick}>Click stream</button>
        </div>
    )
}

export default GenCaptionComponent
