// Testimonial Slider – clean card style matching reference design
// Supports: auto-play, infinite loop, N cards visible, N testimonials, theme colors, full controls

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
    visibleCards: number
    cardGap: number
    autoPlay: boolean
    autoPlayInterval: number
    cardBackground: string
    cardBorderRadius: number
    cardPaddingH: number
    cardPaddingV: number
    quoteColor: string
    quoteFontSize: number
    nameColor: string
    nameFontSize: number
    roleColor: string
    roleFontSize: number
    avatarSize: number
    avatarRadius: number
    arrowBackground: string
    arrowColor: string
    arrowSize: number
    arrowBorderRadius: number
    showArrows: boolean
    animationDuration: number
    style?: CSSProperties
}

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    {
        quote: "Nikhil has significantly elevated our product and brand presence, combining strong design systems thinking with clear business impact.",
        name: "Venkatesh",
        role: "Manager",
        company: "Freshworks",
        image: {
            src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
            alt: "Venkatesh",
        },
    },
    {
        quote: "Working with this team was an absolute pleasure. Every detail was considered, every deadline met, and the results speak for themselves.",
        name: "Sarah Johnson",
        role: "CEO",
        company: "Tech Corp",
        image: {
            src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
            alt: "Sarah Johnson",
        },
    },
    {
        quote: "The best investment we've made this year. Our conversion rate climbed within weeks and the support team never let us figure things out alone.",
        name: "Emily Rodriguez",
        role: "Marketing Director",
        company: "GrowthLabs",
        image: {
            src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
            alt: "Emily Rodriguez",
        },
    },
    {
        quote: "I've tried dozens of tools. This is the first one my entire team actually uses every single day — happily and without complaint.",
        name: "Michael Chen",
        role: "CTO",
        company: "Innovation Labs",
        image: {
            src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
            alt: "Michael Chen",
        },
    },
    {
        quote: "Seamless onboarding, incredible results. The ROI was evident within the first quarter and the team's support has been outstanding throughout.",
        name: "James Park",
        role: "Head of Product",
        company: "Nexus",
        image: {
            src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
            alt: "James Park",
        },
    },
]

// ─── Arrow SVGs ───────────────────────────────────────────────────────────────

function ChevronLeft({ size, color }: { size: number; color: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="15 18 9 12 15 6" />
        </svg>
    )
}

function ChevronRight({ size, color }: { size: number; color: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

function TestimonialCard({
    item,
    cardBackground,
    cardBorderRadius,
    cardPaddingH,
    cardPaddingV,
    quoteColor,
    quoteFontSize,
    nameColor,
    nameFontSize,
    roleColor,
    roleFontSize,
    avatarSize,
    avatarRadius,
}: {
    item: Testimonial
} & Omit<Props, "testimonials" | "visibleCards" | "cardGap" | "autoPlay" | "autoPlayInterval" | "arrowBackground" | "arrowColor" | "arrowSize" | "arrowBorderRadius" | "showArrows" | "animationDuration" | "style">) {
    return (
        <div
            style={{
                background: cardBackground,
                borderRadius: cardBorderRadius,
                padding: `${cardPaddingV}px ${cardPaddingH}px`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                boxSizing: "border-box",
                minHeight: 0,
            }}
        >
            {/* Quote */}
            <p
                style={{
                    margin: 0,
                    fontSize: quoteFontSize,
                    color: quoteColor,
                    lineHeight: 1.65,
                    fontWeight: 400,
                    flex: 1,
                    letterSpacing: "-0.01em",
                }}
            >
                "{item.quote}"
            </p>

            {/* Author */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 32,
                    flexShrink: 0,
                }}
            >
                <img
                    src={item.image?.src}
                    alt={item.image?.alt || item.name}
                    style={{
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: avatarRadius,
                        objectFit: "cover",
                        flexShrink: 0,
                        display: "block",
                    }}
                />
                <div>
                    <span
                        style={{
                            fontSize: nameFontSize,
                            fontWeight: 600,
                            color: nameColor,
                            display: "block",
                            lineHeight: 1.3,
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {item.name},
                    </span>
                    <span
                        style={{
                            fontSize: roleFontSize,
                            color: roleColor,
                            display: "block",
                            lineHeight: 1.3,
                            marginTop: 2,
                        }}
                    >
                        {item.role} {item.company}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * Testimonial Slider
 *
 * @framerIntrinsicWidth 720
 * @framerIntrinsicHeight 320
 *
 * @framerSupportedLayoutWidth any-prefer-fixed
 * @framerSupportedLayoutHeight any-prefer-fixed
 */
export default function TestimonialSlider(props: Props) {
    const {
        testimonials = DEFAULT_TESTIMONIALS,
        visibleCards = 2,
        cardGap = 20,
        autoPlay = true,
        autoPlayInterval = 4000,
        cardBackground = "#FFFFFF",
        cardBorderRadius = 16,
        cardPaddingH = 32,
        cardPaddingV = 32,
        quoteColor = "#111111",
        quoteFontSize = 18,
        nameColor = "#111111",
        nameFontSize = 15,
        roleColor = "#999999",
        roleFontSize = 14,
        avatarSize = 48,
        avatarRadius = 10,
        arrowBackground = "#FFFFFF",
        arrowColor = "#111111",
        arrowSize = 18,
        arrowBorderRadius = 50,
        showArrows = true,
        animationDuration = 400,
        style,
    } = props

    const items = testimonials?.length ? testimonials : DEFAULT_TESTIMONIALS
    const count = items.length
    const perPage = Math.max(1, Math.min(visibleCards, count))

    // Clone array for infinite loop: [...items, ...items, ...items]
    // Start in the middle clone so we can go both directions
    const cloned = [...items, ...items, ...items]
    const startIndex = count // start at the real first item in the middle clone

    const [offset, setOffset] = useState(startIndex)
    const [transitioning, setTransitioning] = useState(false)
    const [animated, setAnimated] = useState(true)
    const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null)

    // Jump to equivalent position silently when we reach a clone boundary
    const afterTransition = useCallback(
        (newOffset: number) => {
            const total = cloned.length
            // If we slid into the last clone block, silently jump to middle
            if (newOffset >= count * 2) {
                setTimeout(() => {
                    setAnimated(false)
                    setOffset(newOffset - count)
                    setTimeout(() => setAnimated(true), 20)
                }, animationDuration)
            }
            // If we slid before the middle clone, silently jump forward
            if (newOffset < count) {
                setTimeout(() => {
                    setAnimated(false)
                    setOffset(newOffset + count)
                    setTimeout(() => setAnimated(true), 20)
                }, animationDuration)
            }
        },
        [count, animationDuration, cloned.length]
    )

    const goNext = useCallback(() => {
        if (transitioning) return
        setTransitioning(true)
        setAnimated(true)
        const next = offset + 1
        setOffset(next)
        afterTransition(next)
        setTimeout(() => setTransitioning(false), animationDuration + 20)
    }, [transitioning, offset, afterTransition, animationDuration])

    const goPrev = useCallback(() => {
        if (transitioning) return
        setTransitioning(true)
        setAnimated(true)
        const prev = offset - 1
        setOffset(prev)
        afterTransition(prev)
        setTimeout(() => setTransitioning(false), animationDuration + 20)
    }, [transitioning, offset, afterTransition, animationDuration])

    // Auto-play
    useEffect(() => {
        if (!autoPlay) return
        autoTimer.current = setInterval(goNext, autoPlayInterval)
        return () => {
            if (autoTimer.current) clearInterval(autoTimer.current)
        }
    }, [autoPlay, autoPlayInterval, goNext])

    // Arrow button style
    const arrowStyle: CSSProperties = {
        width: 40,
        height: 40,
        borderRadius: arrowBorderRadius,
        background: arrowBackground,
        border: "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        userSelect: "none",
        transition: "opacity 0.15s, transform 0.15s",
    }

    return (
        <div
            style={{
                ...style,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* Slider viewport */}
            <div
                style={{
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                    minHeight: 0,
                }}
            >
                <div
                    style={{
                        display: "flex",
                        gap: cardGap,
                        height: "100%",
                        transform: `translateX(calc(-${offset} * (100% / ${perPage} + ${cardGap / perPage}px) + ${cardGap / 2}px))`,
                        transition: animated
                            ? `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`
                            : "none",
                        willChange: "transform",
                    }}
                >
                    {cloned.map((item, i) => (
                        <div
                            key={i}
                            style={{
                                flexShrink: 0,
                                width: `calc(${100 / perPage}% - ${(cardGap * (perPage - 1)) / perPage}px)`,
                                height: "100%",
                                boxSizing: "border-box",
                            }}
                        >
                            <TestimonialCard
                                item={item}
                                cardBackground={cardBackground}
                                cardBorderRadius={cardBorderRadius}
                                cardPaddingH={cardPaddingH}
                                cardPaddingV={cardPaddingV}
                                quoteColor={quoteColor}
                                quoteFontSize={quoteFontSize}
                                nameColor={nameColor}
                                nameFontSize={nameFontSize}
                                roleColor={roleColor}
                                roleFontSize={roleFontSize}
                                avatarSize={avatarSize}
                                avatarRadius={avatarRadius}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows */}
            {showArrows && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        flexShrink: 0,
                    }}
                >
                    <div
                        style={arrowStyle}
                        onClick={goPrev}
                        role="button"
                        aria-label="Previous"
                    >
                        <ChevronLeft size={arrowSize} color={arrowColor} />
                    </div>
                    <div
                        style={arrowStyle}
                        onClick={goNext}
                        role="button"
                        aria-label="Next"
                    >
                        <ChevronRight size={arrowSize} color={arrowColor} />
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── Property Controls ────────────────────────────────────────────────────────

addPropertyControls(TestimonialSlider, {
    // ── Content
    testimonials: {
        type: ControlType.Array,
        title: "Testimonials",
        control: {
            type: ControlType.Object,
            controls: {
                quote: {
                    type: ControlType.String,
                    title: "Quote",
                    displayTextArea: true,
                    defaultValue: "An amazing experience from start to finish.",
                },
                name: {
                    type: ControlType.String,
                    title: "Name",
                    defaultValue: "Jane Doe",
                },
                role: {
                    type: ControlType.String,
                    title: "Role",
                    defaultValue: "Designer",
                },
                company: {
                    type: ControlType.String,
                    title: "Company",
                    defaultValue: "Acme Inc",
                },
                image: {
                    type: ControlType.ResponsiveImage,
                    title: "Avatar",
                },
            },
        },
    },

    // ── Layout
    visibleCards: {
        type: ControlType.Number,
        title: "Cards Visible",
        defaultValue: 2,
        min: 1,
        max: 4,
        step: 1,
        displayStepper: true,
    },
    cardGap: {
        type: ControlType.Number,
        title: "Card Gap",
        defaultValue: 20,
        min: 0,
        max: 60,
        step: 4,
        unit: "px",
    },

    // ── Animation
    autoPlay: {
        type: ControlType.Boolean,
        title: "Auto Play",
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    autoPlayInterval: {
        type: ControlType.Number,
        title: "Interval",
        defaultValue: 4000,
        min: 1000,
        max: 10000,
        step: 500,
        unit: "ms",
        hidden: ({ autoPlay }) => !autoPlay,
    },
    animationDuration: {
        type: ControlType.Number,
        title: "Slide Speed",
        defaultValue: 400,
        min: 100,
        max: 1000,
        step: 50,
        unit: "ms",
    },

    // ── Card Style
    cardBackground: {
        type: ControlType.Color,
        title: "Card BG",
        defaultValue: "#FFFFFF",
    },
    cardBorderRadius: {
        type: ControlType.Number,
        title: "Card Radius",
        defaultValue: 16,
        min: 0,
        max: 48,
        step: 2,
        unit: "px",
    },
    cardPaddingH: {
        type: ControlType.Number,
        title: "Padding H",
        defaultValue: 32,
        min: 12,
        max: 80,
        step: 4,
        unit: "px",
    },
    cardPaddingV: {
        type: ControlType.Number,
        title: "Padding V",
        defaultValue: 32,
        min: 12,
        max: 80,
        step: 4,
        unit: "px",
    },

    // ── Typography
    quoteColor: {
        type: ControlType.Color,
        title: "Quote Color",
        defaultValue: "#111111",
    },
    quoteFontSize: {
        type: ControlType.Number,
        title: "Quote Size",
        defaultValue: 18,
        min: 12,
        max: 32,
        step: 1,
        unit: "px",
    },
    nameColor: {
        type: ControlType.Color,
        title: "Name Color",
        defaultValue: "#111111",
    },
    nameFontSize: {
        type: ControlType.Number,
        title: "Name Size",
        defaultValue: 15,
        min: 11,
        max: 24,
        step: 1,
        unit: "px",
    },
    roleColor: {
        type: ControlType.Color,
        title: "Role Color",
        defaultValue: "#999999",
    },
    roleFontSize: {
        type: ControlType.Number,
        title: "Role Size",
        defaultValue: 14,
        min: 10,
        max: 20,
        step: 1,
        unit: "px",
    },

    // ── Avatar
    avatarSize: {
        type: ControlType.Number,
        title: "Avatar Size",
        defaultValue: 48,
        min: 28,
        max: 100,
        step: 4,
        unit: "px",
    },
    avatarRadius: {
        type: ControlType.Number,
        title: "Avatar Radius",
        defaultValue: 10,
        min: 0,
        max: 50,
        step: 2,
        unit: "px",
    },

    // ── Arrows
    showArrows: {
        type: ControlType.Boolean,
        title: "Show Arrows",
        defaultValue: true,
        enabledTitle: "Show",
        disabledTitle: "Hide",
    },
    arrowBackground: {
        type: ControlType.Color,
        title: "Arrow BG",
        defaultValue: "#FFFFFF",
        hidden: ({ showArrows }) => !showArrows,
    },
    arrowColor: {
        type: ControlType.Color,
        title: "Arrow Icon",
        defaultValue: "#111111",
        hidden: ({ showArrows }) => !showArrows,
    },
    arrowSize: {
        type: ControlType.Number,
        title: "Arrow Size",
        defaultValue: 18,
        min: 10,
        max: 32,
        step: 2,
        unit: "px",
        hidden: ({ showArrows }) => !showArrows,
    },
    arrowBorderRadius: {
        type: ControlType.Number,
        title: "Arrow Radius",
        defaultValue: 50,
        min: 0,
        max: 50,
        step: 2,
        unit: "px",
        hidden: ({ showArrows }) => !showArrows,
    },
})
