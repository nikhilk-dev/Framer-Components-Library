/**
 * Testimonial Slider
 * Clean card-based slider with full style control and grouped Framer properties.
 *
 * @framerIntrinsicWidth 720
 * @framerIntrinsicHeight 320
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */

import {
    useState,
    useEffect,
    useRef,
    useCallback,
    type CSSProperties,
} from "react"
import { addPropertyControls, ControlType } from "framer"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Testimonial {
    quote: string
    name: string
    role: string
    company: string
    image: { src: string; alt?: string }
}

interface Props {
    testimonials: Testimonial[]

    // Layout
    visibleCards: number
    cardGap: number

    // Animation
    autoPlay: boolean
    autoPlayInterval: number
    animationDuration: number

    // Card style (flattened from group)
    card: {
        background: string
        borderRadius: number
        paddingH: number
        paddingV: number
        borderWidth: number
        borderColor: string
    }

    // Quote style
    quote: {
        color: string
        fontFamily: string
        fontSize: number
        fontWeight: number
        fontStyle: "normal" | "italic"
        lineHeight: number
        letterSpacing: number
    }

    // Name style
    name: {
        color: string
        fontFamily: string
        fontSize: number
        fontWeight: number
    }

    // Role style
    role: {
        color: string
        fontFamily: string
        fontSize: number
        fontWeight: number
    }

    // Avatar style
    avatar: {
        size: number
        radius: number
        borderWidth: number
        borderColor: string
    }

    // Arrow style
    arrows: {
        show: boolean
        position: "bottom-right" | "bottom-left" | "bottom-center"
        background: string
        hoverBackground: string
        iconColor: string
        iconSize: number
        buttonSize: number
        borderRadius: number
        borderWidth: number
        borderColor: string
    }

    style?: CSSProperties
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        quote: "Nikhil has significantly elevated our product and brand presence, combining strong design systems thinking with clear business impact.",
        name: "Venkatesh",
        role: "Manager",
        company: "Freshworks",
        image: { src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg", alt: "Venkatesh" },
    },
    {
        quote: "Working with this team was an absolute pleasure. Every detail was considered, every deadline met, and the results speak for themselves.",
        name: "Sarah Johnson",
        role: "CEO",
        company: "Tech Corp",
        image: { src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg", alt: "Sarah Johnson" },
    },
    {
        quote: "The best investment we've made this year. Our conversion rate climbed within weeks and support never let us figure things out alone.",
        name: "Emily Rodriguez",
        role: "Marketing Director",
        company: "GrowthLabs",
        image: { src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg", alt: "Emily Rodriguez" },
    },
    {
        quote: "I've tried dozens of tools. This is the first one my entire team actually uses every single day — happily and without complaint.",
        name: "Michael Chen",
        role: "CTO",
        company: "Innovation Labs",
        image: { src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg", alt: "Michael Chen" },
    },
    {
        quote: "Seamless onboarding, incredible results. The ROI was evident within the first quarter and the team's support has been outstanding.",
        name: "James Park",
        role: "Head of Product",
        company: "Nexus",
        image: { src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg", alt: "James Park" },
    },
]

// ─── Arrow Button ─────────────────────────────────────────────────────────────

function ArrowButton({
    direction,
    onClick,
    background,
    hoverBackground,
    iconColor,
    iconSize,
    buttonSize,
    borderRadius,
    borderWidth,
    borderColor,
}: {
    direction: "left" | "right"
    onClick: () => void
    background: string
    hoverBackground: string
    iconColor: string
    iconSize: number
    buttonSize: number
    borderRadius: number
    borderWidth: number
    borderColor: string
}) {
    const [hovered, setHovered] = useState(false)
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            role="button"
            aria-label={direction === "left" ? "Previous" : "Next"}
            style={{
                width: buttonSize,
                height: buttonSize,
                borderRadius,
                background: hovered ? hoverBackground : background,
                border: `${borderWidth}px solid ${borderColor}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0,
                userSelect: "none",
                transition: "background 0.15s",
                boxSizing: "border-box",
            }}
        >
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill="none"
                stroke={iconColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                {direction === "left"
                    ? <polyline points="15 18 9 12 15 6" />
                    : <polyline points="9 18 15 12 9 6" />
                }
            </svg>
        </div>
    )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function Card({
    item,
    width,
    card,
    quote,
    name,
    role,
    avatar,
}: {
    item: Testimonial
    width: number
    card: Props["card"]
    quote: Props["quote"]
    name: Props["name"]
    role: Props["role"]
    avatar: Props["avatar"]
}) {
    return (
        <div
            style={{
                width,
                minWidth: width,
                maxWidth: width,
                height: "100%",
                background: card.background,
                borderRadius: card.borderRadius,
                border: `${card.borderWidth}px solid ${card.borderColor}`,
                padding: `${card.paddingV}px ${card.paddingH}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxSizing: "border-box",
                flexShrink: 0,
            }}
        >
            <p
                style={{
                    margin: 0,
                    flex: 1,
                    color: quote.color,
                    fontFamily: quote.fontFamily || "inherit",
                    fontSize: quote.fontSize,
                    fontWeight: quote.fontWeight,
                    fontStyle: quote.fontStyle,
                    lineHeight: quote.lineHeight,
                    letterSpacing: `${quote.letterSpacing}em`,
                }}
            >
                "{item.quote}"
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 28, flexShrink: 0 }}>
                <img
                    src={item.image?.src}
                    alt={item.image?.alt || item.name}
                    style={{
                        width: avatar.size,
                        height: avatar.size,
                        borderRadius: avatar.radius,
                        border: `${avatar.borderWidth}px solid ${avatar.borderColor}`,
                        objectFit: "cover",
                        flexShrink: 0,
                        display: "block",
                        boxSizing: "border-box",
                    }}
                />
                <div>
                    <span style={{ display: "block", color: name.color, fontFamily: name.fontFamily || "inherit", fontSize: name.fontSize, fontWeight: name.fontWeight, lineHeight: 1.3 }}>
                        {item.name},
                    </span>
                    <span style={{ display: "block", marginTop: 2, color: role.color, fontFamily: role.fontFamily || "inherit", fontSize: role.fontSize, fontWeight: role.fontWeight, lineHeight: 1.3 }}>
                        {item.role} {item.company}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function TestimonialSlider(props: Props) {
    const {
        testimonials = DEFAULT_TESTIMONIALS,
        visibleCards = 2,
        cardGap = 20,
        autoPlay = true,
        autoPlayInterval = 4000,
        animationDuration = 400,
        card = { background: "#FFFFFF", borderRadius: 16, paddingH: 32, paddingV: 32, borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" },
        quote = { color: "#111111", fontFamily: "", fontSize: 18, fontWeight: 400, fontStyle: "normal", lineHeight: 1.65, letterSpacing: -0.01 },
        name = { color: "#111111", fontFamily: "", fontSize: 15, fontWeight: 600 },
        role = { color: "#999999", fontFamily: "", fontSize: 14, fontWeight: 400 },
        avatar = { size: 48, radius: 10, borderWidth: 0, borderColor: "rgba(0,0,0,0.1)" },
        arrows = { show: true, position: "bottom-right", background: "#FFFFFF", hoverBackground: "#F5F5F5", iconColor: "#111111", iconSize: 16, buttonSize: 40, borderRadius: 50, borderWidth: 1, borderColor: "rgba(0,0,0,0.1)" },
        style,
    } = props

    const items = testimonials?.length ? testimonials : DEFAULT_TESTIMONIALS
    const count = items.length
    const perPage = Math.max(1, Math.min(visibleCards, count))
    const cloned = [...items, ...items, ...items]

    const viewportRef = useRef<HTMLDivElement>(null)
    const [vpWidth, setVpWidth] = useState(0)
    const [offset, setOffset] = useState(count)
    const [animated, setAnimated] = useState(true)
    const [transitioning, setTransitioning] = useState(false)
    const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

    const cardWidth = vpWidth > 0 ? Math.floor((vpWidth - cardGap * (perPage - 1)) / perPage) : 0
    const slideUnit = cardWidth + cardGap

    useEffect(() => {
        const el = viewportRef.current
        if (!el) return
        const measure = () => setVpWidth(el.getBoundingClientRect().width)
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        measure()
        return () => ro.disconnect()
    }, [])

    const silentJump = useCallback((to: number) => {
        setTimeout(() => {
            setAnimated(false)
            setOffset(to)
            setTimeout(() => setAnimated(true), 20)
        }, animationDuration + 10)
    }, [animationDuration])

    const goTo = useCallback((next: number) => {
        if (transitioning) return
        setTransitioning(true)
        setAnimated(true)
        setOffset(next)
        if (next >= count * 2) silentJump(next - count)
        else if (next < count) silentJump(next + count)
        setTimeout(() => setTransitioning(false), animationDuration + 30)
    }, [transitioning, count, silentJump, animationDuration])

    const goNext = useCallback(() => goTo(offset + 1), [goTo, offset])
    const goPrev = useCallback(() => goTo(offset - 1), [goTo, offset])

    useEffect(() => {
        if (!autoPlay) return
        autoTimer.current = setInterval(goNext, autoPlayInterval)
        return () => { if (autoTimer.current) clearInterval(autoTimer.current) }
    }, [autoPlay, autoPlayInterval, goNext])

    const arrowJustify =
        arrows.position === "bottom-left" ? "flex-start" :
        arrows.position === "bottom-center" ? "center" : "flex-end"

    return (
        <div style={{ ...style, width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: 16, boxSizing: "border-box" }}>
            <div ref={viewportRef} style={{ flex: 1, overflow: "hidden", minHeight: 0, width: "100%" }}>
                <div
                    style={{
                        display: "flex",
                        gap: cardGap,
                        height: "100%",
                        transform: `translateX(-${offset * slideUnit}px)`,
                        transition: animated ? `transform ${animationDuration}ms cubic-bezier(0.4,0,0.2,1)` : "none",
                        willChange: "transform",
                    }}
                >
                    {cardWidth > 0 && cloned.map((item, i) => (
                        <Card key={i} item={item} width={cardWidth} card={card} quote={quote} name={name} role={role} avatar={avatar} />
                    ))}
                </div>
            </div>

            {arrows.show && (
                <div style={{ display: "flex", justifyContent: arrowJustify, gap: 8, flexShrink: 0 }}>
                    <ArrowButton direction="left" onClick={goPrev} background={arrows.background} hoverBackground={arrows.hoverBackground} iconColor={arrows.iconColor} iconSize={arrows.iconSize} buttonSize={arrows.buttonSize} borderRadius={arrows.borderRadius} borderWidth={arrows.borderWidth} borderColor={arrows.borderColor} />
                    <ArrowButton direction="right" onClick={goNext} background={arrows.background} hoverBackground={arrows.hoverBackground} iconColor={arrows.iconColor} iconSize={arrows.iconSize} buttonSize={arrows.buttonSize} borderRadius={arrows.borderRadius} borderWidth={arrows.borderWidth} borderColor={arrows.borderColor} />
                </div>
            )}
        </div>
    )
}

// ─── Property Controls ────────────────────────────────────────────────────────

addPropertyControls(TestimonialSlider, {

    testimonials: {
        type: ControlType.Array,
        title: "Testimonials",
        control: {
            type: ControlType.Object,
            controls: {
                quote: { type: ControlType.String, title: "Quote", displayTextArea: true, defaultValue: "An amazing experience from start to finish." },
                name: { type: ControlType.String, title: "Name", defaultValue: "Jane Doe" },
                role: { type: ControlType.String, title: "Role", defaultValue: "Designer" },
                company: { type: ControlType.String, title: "Company", defaultValue: "Acme Inc" },
                image: { type: ControlType.ResponsiveImage, title: "Avatar" },
            },
        },
    },

    visibleCards: { type: ControlType.Number, title: "Cards Visible", defaultValue: 2, min: 1, max: 4, step: 1, displayStepper: true },
    cardGap: { type: ControlType.Number, title: "Card Gap", defaultValue: 20, min: 0, max: 80, step: 4, unit: "px" },

    autoPlay: { type: ControlType.Boolean, title: "Auto Play", defaultValue: true, enabledTitle: "On", disabledTitle: "Off" },
    autoPlayInterval: { type: ControlType.Number, title: "Interval", defaultValue: 4000, min: 500, max: 10000, step: 500, unit: "ms", hidden: ({ autoPlay }) => !autoPlay },
    animationDuration: { type: ControlType.Number, title: "Slide Speed", defaultValue: 400, min: 100, max: 1000, step: 50, unit: "ms" },

    // ── Card group
    card: {
        type: ControlType.Object,
        title: "Card",
        buttonTitle: "Style",
        controls: {
            background: { type: ControlType.Color, title: "Background", defaultValue: "#FFFFFF" },
            borderRadius: { type: ControlType.Number, title: "Radius", defaultValue: 16, min: 0, max: 48, step: 2, unit: "px" },
            paddingH: { type: ControlType.Number, title: "Padding H", defaultValue: 32, min: 0, max: 80, step: 4, unit: "px" },
            paddingV: { type: ControlType.Number, title: "Padding V", defaultValue: 32, min: 0, max: 80, step: 4, unit: "px" },
            borderWidth: { type: ControlType.Number, title: "Border Width", defaultValue: 1, min: 0, max: 8, step: 1, unit: "px" },
            borderColor: { type: ControlType.Color, title: "Border Color", defaultValue: "rgba(0,0,0,0.08)" },
        },
    },

    // ── Quote group
    quote: {
        type: ControlType.Object,
        title: "Quote",
        buttonTitle: "Style",
        controls: {
            color: { type: ControlType.Color, title: "Color", defaultValue: "#111111" },
            fontFamily: { type: ControlType.String, title: "Font Family", defaultValue: "", placeholder: "e.g. Georgia, serif" },
            fontSize: { type: ControlType.Number, title: "Size", defaultValue: 18, min: 10, max: 40, step: 1, unit: "px" },
            fontWeight: { type: ControlType.Number, title: "Weight", defaultValue: 400, min: 100, max: 900, step: 100 },
            fontStyle: { type: ControlType.Enum, title: "Style", defaultValue: "normal", options: ["normal", "italic"], optionTitles: ["Normal", "Italic"] },
            lineHeight: { type: ControlType.Number, title: "Line Height", defaultValue: 1.65, min: 1, max: 3, step: 0.05 },
            letterSpacing: { type: ControlType.Number, title: "Letter Spacing", defaultValue: -0.01, min: -0.1, max: 0.2, step: 0.01 },
        },
    },

    // ── Name group
    name: {
        type: ControlType.Object,
        title: "Name",
        buttonTitle: "Style",
        controls: {
            color: { type: ControlType.Color, title: "Color", defaultValue: "#111111" },
            fontFamily: { type: ControlType.String, title: "Font Family", defaultValue: "", placeholder: "e.g. Inter, sans-serif" },
            fontSize: { type: ControlType.Number, title: "Size", defaultValue: 15, min: 10, max: 28, step: 1, unit: "px" },
            fontWeight: { type: ControlType.Number, title: "Weight", defaultValue: 600, min: 100, max: 900, step: 100 },
        },
    },

    // ── Role group
    role: {
        type: ControlType.Object,
        title: "Role",
        buttonTitle: "Style",
        controls: {
            color: { type: ControlType.Color, title: "Color", defaultValue: "#999999" },
            fontFamily: { type: ControlType.String, title: "Font Family", defaultValue: "", placeholder: "e.g. Inter, sans-serif" },
            fontSize: { type: ControlType.Number, title: "Size", defaultValue: 14, min: 10, max: 24, step: 1, unit: "px" },
            fontWeight: { type: ControlType.Number, title: "Weight", defaultValue: 400, min: 100, max: 900, step: 100 },
        },
    },

    // ── Avatar group
    avatar: {
        type: ControlType.Object,
        title: "Avatar",
        buttonTitle: "Style",
        controls: {
            size: { type: ControlType.Number, title: "Size", defaultValue: 48, min: 24, max: 100, step: 4, unit: "px" },
            radius: { type: ControlType.Number, title: "Radius", defaultValue: 10, min: 0, max: 50, step: 2, unit: "px" },
            borderWidth: { type: ControlType.Number, title: "Border Width", defaultValue: 0, min: 0, max: 6, step: 1, unit: "px" },
            borderColor: { type: ControlType.Color, title: "Border Color", defaultValue: "rgba(0,0,0,0.1)" },
        },
    },

    // ── Arrows group
    arrows: {
        type: ControlType.Object,
        title: "Arrows",
        buttonTitle: "Style",
        controls: {
            show: { type: ControlType.Boolean, title: "Show", defaultValue: true, enabledTitle: "Show", disabledTitle: "Hide" },
            position: { type: ControlType.Enum, title: "Position", defaultValue: "bottom-right", options: ["bottom-right", "bottom-left", "bottom-center"], optionTitles: ["Right", "Left", "Center"] },
            background: { type: ControlType.Color, title: "Background", defaultValue: "#FFFFFF" },
            hoverBackground: { type: ControlType.Color, title: "Hover BG", defaultValue: "#F5F5F5" },
            iconColor: { type: ControlType.Color, title: "Icon Color", defaultValue: "#111111" },
            iconSize: { type: ControlType.Number, title: "Icon Size", defaultValue: 16, min: 8, max: 32, step: 2, unit: "px" },
            buttonSize: { type: ControlType.Number, title: "Button Size", defaultValue: 40, min: 24, max: 80, step: 4, unit: "px" },
            borderRadius: { type: ControlType.Number, title: "Radius", defaultValue: 50, min: 0, max: 50, step: 2, unit: "px" },
            borderWidth: { type: ControlType.Number, title: "Border Width", defaultValue: 1, min: 0, max: 4, step: 1, unit: "px" },
            borderColor: { type: ControlType.Color, title: "Border Color", defaultValue: "rgba(0,0,0,0.1)" },
        },
    },
})