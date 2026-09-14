import * as React from "react"
import { addPropertyControls, ControlType } from "framer"

/**
 * The site's pill button: 40px tall, 20px side padding, 20px radius,
 * DM Mono 12/14. Four fills. Hover lifts it 1px and swaps the fill:
 *   glass -> slightly more opaque (on photos), or white with black text where
 *   the site does that (hero, footer)
 *   blue  -> white
 *   black -> blue with black text (nav "Book a Demo")
 *   white -> white
 * In Framer you will normally rebuild this as a component with variants;
 * this file documents the exact values.
 */
const FILLS = {
    glass: {
        background: "rgba(255,255,255,.3)",
        color: "#fff",
        hover: { background: "rgba(255,255,255,.38)", color: "#fff" },
        blur: 1.5,
    },
    blue: {
        background: "#94b9eb",
        color: "#000",
        hover: { background: "#fff", color: "#000" },
        blur: 0,
    },
    black: {
        background: "#000",
        color: "#fff",
        hover: { background: "#94b9eb", color: "#000" },
        blur: 0,
    },
    white: {
        background: "#fff",
        color: "#000",
        hover: { background: "#fff", color: "#000" },
        blur: 0,
    },
}

export default function GlassButton(props) {
    const { label, variant, href, style } = props
    const [hover, setHover] = React.useState(false)
    const f = FILLS[variant] || FILLS.glass
    const fill = hover ? f.hover : f
    return (
        <a
            href={href}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 40,
                padding: "0 20px",
                borderRadius: 20,
                font: "400 12px/14px 'DM Mono', ui-monospace, monospace",
                whiteSpace: "nowrap",
                textDecoration: "none",
                background: fill.background,
                color: fill.color,
                backdropFilter: f.blur ? `blur(${f.blur}px)` : undefined,
                WebkitBackdropFilter: f.blur ? `blur(${f.blur}px)` : undefined,
                boxShadow:
                    variant === "glass"
                        ? "inset 0 2px 2px rgba(255,255,255,.4), inset 0 -2px 2px rgba(255,255,255,.4)"
                        : undefined,
                transform: hover ? "translateY(-1px)" : "none",
                transition:
                    "transform .4s cubic-bezier(.22,1,.36,1), background-color .3s, color .3s",
                ...style,
            }}
        >
            {label}
        </a>
    )
}

GlassButton.defaultProps = {
    label: "Book a Demo",
    variant: "glass",
    href: "#",
}

addPropertyControls(GlassButton, {
    label: { type: ControlType.String, title: "Label" },
    variant: {
        type: ControlType.Enum,
        title: "Fill",
        options: ["glass", "blue", "black", "white"],
    },
    href: { type: ControlType.Link, title: "Link" },
})
