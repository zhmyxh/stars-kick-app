import { useEffect, useRef, useState } from "react"
import { LoaderMini } from "../special/Loader/LoaderComponent"

function SmartImage({
    src,
    alt = "",
    className = "",
    style = {},
    loader = null,
    fadeDuration = 300,
    ...props
}) {
    const [loaded, setLoaded] = useState(false)
    const [error, setError] = useState(false)
    const imgRef = useRef(null)

    useEffect(() => {
        setLoaded(false)
        setError(false)
    }, [src])

    useEffect(() => {
        const img = imgRef.current
        if (img && img.complete && img.naturalWidth !== 0) {
            setLoaded(true)
        }
    }, [src])

    return (
        <div style={{ position: "relative", display: "flex", justifyContent: 'center', alignItems: 'center', width: '100%', boxSizing: 'border-box' }}>
            {!loaded && !error && (
                loader || (
                    <LoaderMini />
                )
            )}

            {error && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12
                    }}
                >
                    ERR
                </div>
            )}

            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={className}
                width={props.width}
                height={props.height}
                onLoad={() => setLoaded(true)}
                onError={() => setError(true)}
                style={{
                    visibility: loaded ? 'visible' : 'hidden',
                    width: loaded ? props.width : 0,
                    transition: `opacity ${fadeDuration}ms ease`,
                    display: "block",
                    objectFit: 'cover',
                    ...style
                }}
                {...props}
            />
        </div>
    )
}

export default SmartImage