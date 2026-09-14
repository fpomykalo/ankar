import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * FolderCard: the photo card with the tab on its left edge, used for people,
 * industries, customer stories, posts and the lifecycle cards.
 *
 * The shape is a CSS mask made of two layers: a 30px-radius rectangle for the
 * body and a 25x180 tab on the left edge. Because the rectangle SVG has no
 * viewBox the radius stays 30px at any width, so the width can animate freely.
 * The vertical label sits inside the tab and reads bottom to top; its text ends
 * at `labelBottom` from the top of the card and the 8px dot sits at `dotTop`.
 *
 * Site defaults: card 480px tall, closed width 212, open widths 452 (stories),
 * 557 (industries), 744 (people), 931 (lifecycle), 1305 (wide story).
 */

const RECT_MASK =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' rx='30'/%3E%3C/svg%3E\")"
const TAB_MASK =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='180' viewBox='0 0 25 180'%3E%3Cpath d='M25 0C25 3.5946 23.1501 6.9359 20.1045 8.8408L4.89453 18.3545C1.84901 20.2595 0 23.6018 0 27.1963V152.804C0 156.398 1.84901 159.741 4.89453 161.646L20.1045 171.159C23.1501 173.064 25 176.405 25 180Z'/%3E%3C/svg%3E\")"

export default function FolderCard(props) {
    const {
        image,
        label,
        labelActive,
        tabTop,
        labelBottom,
        dotTop,
        shade,
        grayscale,
        edgeGradient,
        bottomGradient,
        children,
        style,
    } = props

    const mask: React.CSSProperties = {
        WebkitMaskImage: `${RECT_MASK}, ${TAB_MASK}`,
        maskImage: `${RECT_MASK}, ${TAB_MASK}`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "calc(100% - 24px) 100%, 25px 180px",
        maskSize: "calc(100% - 24px) 100%, 25px 180px",
        WebkitMaskPosition: `24px 0, 0 ${tabTop}px`,
        maskPosition: `24px 0, 0 ${tabTop}px`,
    }

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                color: "#fff",
                ...mask,
                ...style,
            }}
        >
            {image && (
                <img
                    src={image}
                    alt=""
                    style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        filter: grayscale ? "grayscale(1)" : "none",
                        transition: "filter .7s cubic-bezier(.65,0,.35,1)",
                    }}
                />
            )}
            {/* shade over the photo: .7 on closed cards, .2 open, .1 on people cards */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background: `rgba(0,0,0,${shade})`,
                    transition: "background-color .7s cubic-bezier(.65,0,.35,1)",
                }}
            />
            {edgeGradient && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(270deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 30%)",
                    }}
                />
            )}
            {bottomGradient && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background:
                            "linear-gradient(0deg, rgba(0,0,0,.5) 20%, rgba(0,0,0,0) 40%)",
                    }}
                />
            )}
            {/* vertical label in the tab */}
            {label && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 0,
                        width: 25,
                        height: "100%",
                        pointerEvents: "none",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: labelBottom,
                            transform: "translateX(-50%) rotate(180deg)",
                            transformOrigin: "50% 0",
                            writingMode: "vertical-rl",
                            font: "400 12px/14px 'DM Mono', ui-monospace, monospace",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {label}
                    </span>
                    <span
                        style={{
                            position: "absolute",
                            left: 8.5,
                            top: dotTop,
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            boxShadow: "inset 0 0 0 1px currentColor",
                            background: labelActive ? "currentColor" : "transparent",
                        }}
                    />
                </div>
            )}
            {/* hairline 40px from the top, 45px in from each side */}
            <div
                style={{
                    position: "absolute",
                    left: 45,
                    right: 45,
                    top: 40,
                    height: 1,
                    background: "rgba(255,255,255,.4)",
                }}
            />
            {/* card content: title at 45/60, meta, logos... passed in from Framer */}
            <div style={{ position: "absolute", inset: 0 }}>{children}</div>
        </div>
    )
}

FolderCard.defaultProps = {
    width: 452,
    height: 480,
    label: "Use case",
    labelActive: false,
    tabTop: 58,
    labelBottom: 188,
    dotTop: 198,
    shade: 0.2,
    grayscale: false,
    edgeGradient: true,
    bottomGradient: true,
}

addPropertyControls(FolderCard, {
    image: { type: ControlType.Image, title: "Photo" },
    label: { type: ControlType.String, title: "Tab label" },
    labelActive: { type: ControlType.Boolean, title: "Dot filled" },
    tabTop: { type: ControlType.Number, title: "Tab top", min: 0, max: 480, step: 1 },
    labelBottom: { type: ControlType.Number, title: "Label ends at", min: 0, max: 480 },
    dotTop: { type: ControlType.Number, title: "Dot at", min: 0, max: 480 },
    shade: { type: ControlType.Number, title: "Shade", min: 0, max: 1, step: 0.05 },
    grayscale: { type: ControlType.Boolean, title: "Grayscale" },
    edgeGradient: { type: ControlType.Boolean, title: "Right gradient" },
    bottomGradient: { type: ControlType.Boolean, title: "Bottom gradient" },
    children: { type: ControlType.ComponentInstance, title: "Content" },
})
