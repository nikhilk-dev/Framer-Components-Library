// Mosaic testimonial grid component with staggered layout and customizable testimonials

import { addPropertyControls, ControlType, useIsStaticRenderer } from "framer"
import { motion, useInView } from "framer-motion"
import type { CSSProperties } from "react"
import { useRef, useState, useEffect } from "react"

interface Testimonial {
    name: string
    role: string
    company: string
    content: string
    avatar: {
        src: string
        alt: string
    }
    video?: string
}

interface MosaicTestimonialGridProps {
    testimonials: Testimonial[]
    cardBackground: string
    textColor: string
    nameColor: string
    roleColor: string
    nameFont: CSSProperties
    roleFont: CSSProperties
    contentFont: CSSProperties
    generalContentFont: CSSProperties
    generalContent: string
    generalContentColor: string
    showGeneralContent: boolean
    gap: number
    contentPadding: number
    mediaPadding: number
    borderRadius: number
    mediaRadius: number
    showShadow: boolean
    columns: number
    mobileColumns: number
    tabletColumns: number
    desktopColumns: number
    mobileBreakpoint: number
    tabletBreakpoint: number
    minColumnWidth: number
    gridType: "masonry" | "uniform" | "alternating"
    nameContentSpacing: number
    minCardHeight: number
    testimonialAlign: "top" | "bottom"
    enableAnimation: boolean
    animationType:
        | "fade"
        | "slide-up"
        | "slide-down"
        | "slide-left"
        | "slide-right"
        | "scale"
        | "rotate"
        | "bounce"
        | "flip-x"
        | "flip-y"
        | "zoom"
        | "swing"
        | "blur"
    animationDuration: number
    animationDelay: number
    animationScale: number
    style?: CSSProperties
}

/**
 * @framerSupportedLayoutWidth fixed
 * @framerSupportedLayoutHeight auto
 */
export default function MosaicTestimonialGrid(props: MosaicTestimonialGridProps) {
    const {
        testimonials,
        cardBackground,
        textColor,
        nameColor,
        roleColor,
        nameFont,
        roleFont,
        contentFont,
        generalContentFont,
        generalContent,
        generalContentColor,
        showGeneralContent,
        gap,
        contentPadding,
        mediaPadding,
        borderRadius,
        mediaRadius,
        showShadow,
        columns,
        mobileColumns,
        tabletColumns,
        desktopColumns,
        mobileBreakpoint,
        tabletBreakpoint,
        minColumnWidth,
        gridType,
        nameContentSpacing,
        minCardHeight,
        testimonialAlign,
        enableAnimation,
        animationType,
        animationDuration,
        animationDelay,
        animationScale,
        style,
    } = props

    const isStatic = useIsStaticRenderer()
    const containerRef = useRef(null)
    const isInView = useInView(containerRef, { once: true, amount: 0.1 })
    const [currentColumns, setCurrentColumns] = useState(columns)

    useEffect(() => {
        if (typeof window === "undefined") {
            setCurrentColumns(desktopColumns)
            return
        }

        const updateColumns = () => {
            const width = window.innerWidth
            if (width < mobileBreakpoint) {
                setCurrentColumns(mobileColumns)
            } else if (width < tabletBreakpoint) {
                setCurrentColumns(tabletColumns)
            } else {
                setCurrentColumns(desktopColumns)
            }
        }

        updateColumns()
        window.addEventListener("resize", updateColumns)
        return () => window.removeEventListener("resize", updateColumns)
    }, [mobileColumns, tabletColumns, desktopColumns, mobileBreakpoint, tabletBreakpoint])

    const gridTemplateColumns = `repeat(${currentColumns}, minmax(${minColumnWidth}px, 1fr))`

    const getAnimationVariants = (type: string) => {
        switch (type) {
            case "fade":
                return { initial: { opacity: 0 }, animate: { opacity: 1 } }
            case "slide-up":
                return { initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } }
            case "slide-down":
                return { initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } }
            case "slide-left":
                return { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } }
            case "slide-right":
                return { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } }
            case "scale":
                return {
                    initial: { opacity: 0, scale: animationScale },
                    animate: { opacity: 1, scale: 1 },
                }
            case "rotate":
                return {
                    initial: { opacity: 0, scale: animationScale, rotate: -10 },
                    animate: { opacity: 1, scale: 1, rotate: 0 },
                }
            case "bounce":
                return {
                    initial: { opacity: 0, y: -100, scale: 0.8 },
                    animate: { opacity: 1, y: 0, scale: 1 },
                }
            case "flip-x":
                return { initial: { opacity: 0, rotateX: -90 }, animate: { opacity: 1, rotateX: 0 } }
            case "flip-y":
                return { initial: { opacity: 0, rotateY: -90 }, animate: { opacity: 1, rotateY: 0 } }
            case "zoom":
                return { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 } }
            case "swing":
                return {
                    initial: { opacity: 0, rotate: -15, scale: 0.9 },
                    animate: { opacity: 1, rotate: 0, scale: 1 },
                }
            case "blur":
                return {
                    initial: { opacity: 0, filter: "blur(10px)" },
                    animate: { opacity: 1, filter: "blur(0px)" },
                }
            default:
                return { initial: { opacity: 0 }, animate: { opacity: 1 } }
        }
    }

    return (
        <div
            ref={containerRef}
            style={{
                ...style,
                width: "100%",
                padding: gap,
                display: "grid",
                gridTemplateColumns,
                gap,
                gridAutoFlow: "dense",
            }}
        >
            {testimonials.map((testimonial, index) => {
                let gridRowSpan = 1

                if (gridType === "masonry") {
                    const isLarge = index % 5 === 0 || index % 5 === 3
                    gridRowSpan = isLarge ? 2 : 1
                } else if (gridType === "alternating") {
                    gridRowSpan = index % 2 === 0 ? 2 : 1
                } else {
                    gridRowSpan = 1
                }

                const avatar = testimonial.avatar || {
                    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
                    alt: "Avatar",
                }

                const video = testimonial.video || ""
                const animationVariants = getAnimationVariants(animationType)

                return (
                    <motion.div
                        key={index}
                        initial={
                            isStatic || !enableAnimation
                                ? false
                                : animationVariants.initial
                        }
                        animate={
                            isStatic || !enableAnimation
                                ? false
                                : isInView
                                ? animationVariants.animate
                                : animationVariants.initial
                        }
                        transition={
                            isStatic || !enableAnimation
                                ? undefined
                                : {
                                      duration: animationDuration,
                                      delay: index * animationDelay,
                                      ease: "easeOut",
                                  }
                        }
                        style={{
                            backgroundColor: cardBackground,
                            borderRadius,
                            display: "flex",
                            flexDirection: "column",
                            gridRow: `span ${gridRowSpan}`,
                            minHeight: minCardHeight,
                            boxShadow: showShadow
                                ? "0 4px 10px rgba(0,0,0,0.08)"
                                : "none",
                            justifyContent:
                                testimonialAlign === "bottom"
                                    ? "space-between"
                                    : "flex-start",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: nameContentSpacing,
                                padding: contentPadding,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <img
                                    src={avatar.src}
                                    alt={avatar.alt}
                                    style={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        objectFit: "cover",
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <div
                                        style={{
                                            ...nameFont,
                                            color: nameColor,
                                            marginBottom: 4,
                                        }}
                                    >
                                        {testimonial.name}
                                    </div>
                                    <div
                                        style={{
                                            ...roleFont,
                                            color: roleColor,
                                        }}
                                    >
                                        {testimonial.role} at {testimonial.company}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {showGeneralContent && generalContent && (
                            <p
                                style={{
                                    ...generalContentFont,
                                    color: generalContentColor,
                                    margin: 0,
                                    padding: `0 ${contentPadding}px ${nameContentSpacing}px ${contentPadding}px`,
                                }}
                            >
                                {generalContent}
                            </p>
                        )}

                        <p
                            style={{
                                ...contentFont,
                                color: textColor,
                                margin: 0,
                                padding: `0 ${contentPadding}px ${contentPadding}px ${contentPadding}px`,
                            }}
                        >
                            {testimonial.content}
                        </p>

                        {video && (
                            <video
                                src={video}
                                controls
                                style={{
                                    width: "100%",
                                    padding: mediaPadding,
                                    borderRadius: mediaRadius,
                                }}
                            />
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}

addPropertyControls(MosaicTestimonialGrid, {
    testimonials: {
        type: ControlType.Array,
        control: {
            type: ControlType.Object,
            controls: {
                name: {
                    type: ControlType.String,
                    defaultValue: "John Doe",
                },
                role: {
                    type: ControlType.String,
                    defaultValue: "CEO",
                },
                company: {
                    type: ControlType.String,
                    defaultValue: "Company Inc",
                },
                content: {
                    type: ControlType.String,
                    displayTextArea: true,
                    defaultValue:
                        "This product has completely transformed how we work. Highly recommended!",
                },
                avatar: {
                    type: ControlType.ResponsiveImage,
                },
                video: {
                    type: ControlType.File,
                    allowedFileTypes: ["mp4", "webm", "mov"],
                    title: "Video (Optional)",
                },
            },
        },
        defaultValue: [
            {
                name: "Sarah Johnson",
                role: "Product Manager",
                company: "TechCorp",
                content:
                    "This platform has revolutionized our workflow. The intuitive design and powerful features have boosted our team productivity significantly.",
                avatar: {
                    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
                    alt: "Sarah Johnson",
                },
            },
            {
                name: "Michael Chen",
                role: "Lead Designer",
                company: "Creative Studio",
                content:
                    "As a designer, I am particular about tools. This exceeds expectations with remarkable attention to detail and seamless integration.",
                avatar: {
                    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                    alt: "Michael Chen",
                },
            },
            {
                name: "Emily Rodriguez",
                role: "Senior Developer",
                company: "StartupXYZ",
                content:
                    "Best investment this year. The API is well-documented, performance outstanding, and development experience smooth.",
                avatar: {
                    src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
                    alt: "Emily Rodriguez",
                },
            },
            {
                name: "David Kim",
                role: "Marketing Director",
                company: "Growth Co",
                content:
                    "The analytics dashboard provides incredible insights. Our conversion rates doubled and we make confident data-driven decisions.",
                avatar: {
                    src: "https://framerusercontent.com/images/2uTNEj5aTl2K3NJaEFWMbnrA.jpg",
                    alt: "David Kim",
                },
            },
            {
                name: "Lisa Anderson",
                role: "CTO",
                company: "Enterprise Inc",
                content:
                    "Security, scalability, and performance delivered perfectly. Seamless integration saved months of development time and resources.",
                avatar: {
                    src: "https://framerusercontent.com/images/f9RiWoNpmlCMqVRIHz8l8wYfeI.jpg",
                    alt: "Lisa Anderson",
                },
            },
            {
                name: "James Wilson",
                role: "Founder and CEO",
                company: "Innovate Labs",
                content:
                    "Game changer for our business. Automation features save countless hours weekly. Worth every penny invested.",
                avatar: {
                    src: "https://framerusercontent.com/images/GfGkADagM4KEibNcIiRUWlfrR0.jpg",
                    alt: "James Wilson",
                },
            },
            {
                name: "Rachel Martinez",
                role: "Operations Manager",
                company: "LogiTech Solutions",
                content:
                    "We were skeptical initially, but this tool proved itself repeatedly. The efficiency gains are real and measurable.",
                avatar: {
                    src: "https://framerusercontent.com/images/aNsAT3jCvt4zglbWCUoFe33Q.jpg",
                    alt: "Rachel Martinez",
                },
            },
            {
                name: "Tom Anderson",
                role: "Sales Director",
                company: "Revenue Inc",
                content:
                    "Our sales team loves it. Flawless CRM integration helped close thirty percent more deals this quarter.",
                avatar: {
                    src: "https://framerusercontent.com/images/BYnxEV1zjYb9bhWh1IwBZ1ZoS60.jpg",
                    alt: "Tom Anderson",
                },
            },
        ],
    },
    mobileColumns: {
        type: ControlType.Number,
        min: 1,
        max: 6,
        defaultValue: 1,
        step: 1,
        displayStepper: true,
        title: "Mobile Columns",
    },
    tabletColumns: {
        type: ControlType.Number,
        min: 1,
        max: 6,
        defaultValue: 2,
        step: 1,
        displayStepper: true,
        title: "Tablet Columns",
    },
    desktopColumns: {
        type: ControlType.Number,
        min: 1,
        max: 6,
        defaultValue: 3,
        step: 1,
        displayStepper: true,
        title: "Desktop Columns",
    },
    mobileBreakpoint: {
        type: ControlType.Number,
        min: 320,
        max: 1024,
        defaultValue: 768,
        unit: "px",
        title: "Mobile Breakpoint",
    },
    tabletBreakpoint: {
        type: ControlType.Number,
        min: 768,
        max: 1920,
        defaultValue: 1024,
        unit: "px",
        title: "Tablet Breakpoint",
    },
    enableAnimation: {
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
        title: "Animation",
    },
    animationType: {
        type: ControlType.Enum,
        options: [
            "fade",
            "slide-up",
            "slide-down",
            "slide-left",
            "slide-right",
            "scale",
            "rotate",
            "bounce",
            "flip-x",
            "flip-y",
            "zoom",
            "swing",
            "blur",
        ],
        optionTitles: [
            "Fade",
            "Slide Up",
            "Slide Down",
            "Slide Left",
            "Slide Right",
            "Scale",
            "Rotate",
            "Bounce",
            "Flip X",
            "Flip Y",
            "Zoom",
            "Swing",
            "Blur",
        ],
        defaultValue: "fade",
        title: "Animation Type",
        hidden: ({ enableAnimation }) => !enableAnimation,
    },
    animationDuration: {
        type: ControlType.Number,
        min: 0.1,
        max: 2,
        defaultValue: 0.5,
        step: 0.1,
        unit: "s",
        title: "Duration",
        hidden: ({ enableAnimation }) => !enableAnimation,
    },
    animationDelay: {
        type: ControlType.Number,
        min: 0,
        max: 0.5,
        defaultValue: 0.1,
        step: 0.05,
        unit: "s",
        title: "Stagger Delay",
        hidden: ({ enableAnimation }) => !enableAnimation,
    },
    animationScale: {
        type: ControlType.Number,
        min: 0.5,
        max: 1,
        defaultValue: 0.9,
        step: 0.05,
        title: "Initial Scale",
        hidden: ({ enableAnimation }) => !enableAnimation,
    },
    columns: {
        type: ControlType.Number,
        min: 1,
        max: 6,
        defaultValue: 3,
        step: 1,
        displayStepper: true,
    },
    minColumnWidth: {
        type: ControlType.Number,
        min: 200,
        max: 500,
        defaultValue: 300,
        unit: "px",
    },
    gridType: {
        type: ControlType.Enum,
        options: ["masonry", "uniform", "alternating"],
        optionTitles: ["Masonry", "Uniform", "Alternating"],
        defaultValue: "masonry",
        displaySegmentedControl: true,
    },
    minCardHeight: {
        type: ControlType.Number,
        min: 100,
        max: 600,
        defaultValue: 200,
        unit: "px",
        title: "Min Height",
    },
    testimonialAlign: {
        type: ControlType.Enum,
        options: ["top", "bottom"],
        optionTitles: ["Top", "Bottom"],
        defaultValue: "top",
        displaySegmentedControl: true,
        title: "Content Align",
    },
    nameContentSpacing: {
        type: ControlType.Number,
        min: 0,
        max: 48,
        defaultValue: 16,
        unit: "px",
        title: "Name Spacing",
    },
    cardBackground: {
        type: ControlType.Color,
        defaultValue: "#FFFFFF",
    },
    textColor: {
        type: ControlType.Color,
        defaultValue: "#000000",
    },
    nameColor: {
        type: ControlType.Color,
        defaultValue: "#000000",
    },
    roleColor: {
        type: ControlType.Color,
        defaultValue: "#CCCCCC",
    },
    nameFont: {
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1em",
        },
    },
    roleFont: {
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
    contentFont: {
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "15px",
            variant: "Medium",
            letterSpacing: "-0.01em",
            lineHeight: "1.3em",
        },
    },
    gap: {
        type: ControlType.Number,
        min: 0,
        max: 48,
        defaultValue: 16,
        unit: "px",
    },
    contentPadding: {
        type: ControlType.Number,
        min: 0,
        max: 48,
        defaultValue: 24,
        unit: "px",
        title: "Content Padding",
    },
    mediaPadding: {
        type: ControlType.Number,
        min: 0,
        max: 48,
        defaultValue: 16,
        unit: "px",
        title: "Media Padding",
    },
    borderRadius: {
        type: ControlType.Number,
        min: 0,
        max: 32,
        defaultValue: 8,
        unit: "px",
    },
    mediaRadius: {
        type: ControlType.Number,
        min: 0,
        max: 32,
        defaultValue: 8,
        unit: "px",
        title: "Media Radius",
    },
    showShadow: {
        type: ControlType.Boolean,
        defaultValue: true,
        enabledTitle: "On",
        disabledTitle: "Off",
    },
    showGeneralContent: {
        type: ControlType.Boolean,
        defaultValue: false,
        enabledTitle: "Show",
        disabledTitle: "Hide",
        title: "General Content",
    },
    generalContent: {
        type: ControlType.String,
        displayTextArea: true,
        defaultValue: "This is general content that appears on all testimonials.",
        title: "Content",
        hidden: ({ showGeneralContent }) => !showGeneralContent,
    },
    generalContentColor: {
        type: ControlType.Color,
        defaultValue: "#666666",
        title: "Content Color",
        hidden: ({ showGeneralContent }) => !showGeneralContent,
    },
    generalContentFont: {
        type: ControlType.Font,
        controls: "extended",
        defaultFontType: "sans-serif",
        defaultValue: {
            fontSize: "14px",
            variant: "Regular",
            letterSpacing: "-0.01em",
            lineHeight: "1.4em",
        },
        title: "Content Font",
        hidden: ({ showGeneralContent }) => !showGeneralContent,
    },
})
