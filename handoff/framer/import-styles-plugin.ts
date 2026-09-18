/**
 * Creates the site's Color Styles and Text Styles inside a Framer project.
 *
 * How to use (about 10 minutes):
 *   1. npm create framer-plugin@latest   (choose a blank plugin)
 *   2. copy styles.json next to this file and paste this file over src/App.tsx
 *      (keep the plugin's own imports if the scaffold differs)
 *   3. npm run dev, open the plugin in Framer, press the button once
 *
 * The API names below follow the framer-plugin package as of 2026. If a call
 * is renamed, the styles.json file has every value and they take a few
 * minutes to enter by hand from the Assets panel instead.
 */
import { framer } from "framer-plugin"
import styles from "./styles.json"

async function importStyles() {
    for (const c of styles.colorStyles) {
        await framer.createColorStyle({
            name: c.name,
            light: c.hex ?? c.rgba,
        })
    }
    for (const t of styles.textStyles) {
        await framer.createTextStyle({
            name: t.name,
            font: { family: t.font, weight: t.weight },
            fontSize: `${t.size}px`,
            lineHeight: `${t.lineHeight}px`,
            letterSpacing: `${t.letterSpacing}px`,
            tag: t.tag,
            color: "#000000",
        })
    }
    framer.notify(
        `Created ${styles.colorStyles.length} color styles and ${styles.textStyles.length} text styles`,
        { variant: "success" }
    )
}

export function App() {
    return (
        <main style={{ padding: 16 }}>
            <p>Imports the Ankar type and colour styles into this project.</p>
            <button onClick={importStyles}>Create styles</button>
        </main>
    )
}
