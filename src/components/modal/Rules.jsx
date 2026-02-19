import { useState, useEffect } from 'react'

import Slide0 from '../../assets/images/rules-images/slide0-DIKfy9my.webp'
import Slide1 from '../../assets/images/rules-images/slide1-BSMdcpWd.webp'
import Slide2 from '../../assets/images/rules-images/slide2-Cs7rU_7T.webp'
import Slide3 from '../../assets/images/rules-images/slide3-ru-B2DtKT7O.webp'
import Slide4 from '../../assets/images/rules-images/slide4-ClQNEm3P.webp'

import { Trans, useTranslation } from 'react-i18next'
import { useSettingsStore } from '../../store/useStore'

const slides = [Slide0, Slide1, Slide2, Slide3, Slide4]

function RuleStepTemplate({ header, text, image }) {
    return (
        <div className="rule-step">
            <img className='rule-image' src={image} alt={header} />
            <div className="rule-box">
                <span className='header-text rule-header'>{header}</span>
                <span className='secondary-text rule-text'>{text}</span>
            </div>
        </div>
    )
}

function Rules() {
    const [current, setCurrent] = useState(0)
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    const steps = t("rules.steps", { returnObjects: true })
    const stepsCount = steps.length

    const nextRuleStep = () => {
        if (current < steps.length - 1) {
            setCurrent(prev => prev + 1)
        } else {
            setCurrent(0)
        }
    }

    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        let isMounted = true

        const preloadImages = async () => {
            const promises = slides.map(src => {
                return new Promise((resolve, reject) => {
                    const img = new Image()
                    img.src = src
                    img.onload = resolve
                    img.onerror = reject
                })
            })

            await Promise.all(promises)

            if (isMounted) {
                setIsLoaded(true)
            }
        }

        preloadImages()

        return () => {
            isMounted = false
        }
    }, [])

    if (!isLoaded) {
        return null
    }

    return (
        <div id="rules">
            <RuleStepTemplate
                header={steps[current].header}
                text={<Trans
                    i18nKey={steps[current].text}
                    components={{ br: <br /> }}
                />}
                image={slides[current]}
            />

            <div className="dots">
                {steps.map((_, i) => (
                    <span
                        key={i}
                        className={`dot ${current === i ? 'active' : ''}`}
                    />
                ))}
            </div>

            <button className="button-main b-g" onClick={current === stepsCount - 1 ? toggleModal : nextRuleStep}>
                <span className="white-text">{current === stepsCount - 1 ? t("button.finish") : t("button.next")}</span>
            </button>
        </div>
    )
}

export default Rules