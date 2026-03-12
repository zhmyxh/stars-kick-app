import './_rules.styles.css'

import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import NotFound from '@/components/utility/NotFound'
import Button from "@/components/utility/Button"
import SmartImage from '@/components/utility/SmartImage'
import { Event } from '../../pages/Events/EventsComponent'

const RuleTemplate = ({ header, component, text }) => {
    const { t } = useTranslation()

    return (
        <div id="rule-box" className='mb-[105px]'>
            <div id='rules-component' className='mb-[15px]'>
                {component}
            </div>
            <div id='rules-header'>
                <span className='header-text'>{t(header)}</span>
            </div>
            <div id="rules-text">
                <span className='secondary-text'>
                    <Trans
                        i18nKey={text}
                        values={{
                            value: 0,
                            br: <br />
                        }}
                        components={{ b: <b /> }} />
                </span>
            </div>
        </div>
    )
}

const RuleStepA = () => {
    return (
        <RuleTemplate
            header='rule.header.stepA'
            component={<SmartImage src='https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Bavaria.png' width={90} height={90} />}
            text='rule.text.stepA'
        />
    )
}

const event = {
    event_id: 28,
    status: "OPEN",
    category: "MOMENTUM",
    question: "Will Plush Pepe's price be more than 7k TON?",
    image_payload: "https://cdn.changes.tg/gifts/models/Plush%20Pepe/png/Bavaria.png",
    bets_close_at: "2026-03-13T01:05:00",
    closes_at: "2026-03-15T12:50:00",
    does_user_participate: false,
    total_participants: 0,
    total_pool: 0,
    options: [
        { option_id: 54, name: "Yes", percent: 0 },
        { option_id: 55, name: "No", percent: 0 }
    ]
};


const RuleStepB = () => {
    return (
        <RuleTemplate
            header='rule.header.stepB'
            component={<Event event={event} disabled={true} />}
            text='rule.text.stepB'
        />
    )
}

export default function Rules() {
    const { t } = useTranslation()
    const [currentStep, setCurrentStep] = useState(1)

    const maxStep = 2
    const steps = [1, 2]

    return (
        <div id="rules">
            {currentStep === 1 && <RuleStepA />}
            {currentStep === 2 && <RuleStepB />}
            <div id='rules-control' className='box'>
                <div className='dots my-[15px]'>
                    {steps.map((s, i) => (
                        <div key={i} className={`dot ${currentStep === s && 'active'}`}></div>
                    ))}
                </div>
                {currentStep !== maxStep && <Button name={t('button.next')} type='main' color='b-g' wd={true} action={() => setCurrentStep(prev => prev + 1)} />}
                {currentStep === maxStep && <Button name={t('button.back')} type='main' color='b-g' wd={true} action={() => setCurrentStep(1)} />}
            </div>
        </div>
    )
}