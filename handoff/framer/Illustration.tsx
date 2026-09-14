import * as React from "react"
import { addPropertyControls, ControlType } from "framer"
import { illustrations } from "./illustrations"

/**
 * The three animated illustrations from "What Ankar makes possible".
 * Each is inline SVG with CSS keyframes that play once (4s) and hold the last
 * frame. Re-inserting the markup restarts the drawing, which is how the site
 * replays it: hovering an accordion item shows its illustration, clicking the
 * open item plays it again.
 *
 * Usage in Framer: place one Illustration per accordion item, bind `which` to
 * the item (1, 2, 3) and toggle `playKey` (any change replays).
 */
export default function Illustration(props) {
    const { which, playKey, style } = props
    const html = illustrations[`wf${which}`] || illustrations.wf1
    // keying the wrapper on playKey re-creates the node, which restarts the animation
    return (
        <div
            key={playKey}
            style={{ width: "100%", ...style }}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    )
}

Illustration.defaultProps = {
    which: 1,
    playKey: 0,
}

addPropertyControls(Illustration, {
    which: {
        type: ControlType.Enum,
        title: "Illustration",
        options: [1, 2, 3],
        optionTitles: ["1 Learn faster", "2 Back the right ideas", "3 Protect"],
    },
    playKey: { type: ControlType.Number, title: "Replay key" },
})
