import './_rules.styles.css'

import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'

import NotFound from '@/components/utility/NotFound'
import Button from "@/components/utility/Button"
import SmartImage from '@/components/utility/SmartImage'
import { Event, EventStatus } from '../../pages/Events/EventsComponent'
import { useSettingsStore } from '../../../store/useStore'

const RuleTemplate = ({ header, component, text }) => {
    const { t } = useTranslation()

    return (
        <div id="rule-box" className='mb-[175px]'>
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
    question: "Will the Durov’s Cap reach 750 TON during 7 days?",
    image_payload: "https://cdn.changes.tg/gifts/models/Durov%27s%20Cap/png/Aurora.png",
    bets_close_at: "2026-03-13T01:05:00",
    closes_at: "2026-03-15T12:50:00",
    does_user_participate: false,
    total_participants: 386,
    total_pool: 6422,
    options: [
        { option_id: 54, name: "Yes", percent: 67 },
        { option_id: 55, name: "No", percent: 33 }
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

const RuleStepC = () => {
    return (
        <RuleTemplate
            header='rule.header.stepC'
            component={<div className='flex items-center gap-[10px] w-full h-[90px] justify-center'>
                <EventStatus event={{ status: 'LOCKED' }} /><EventStatus event={{ status: 'RESOLVED' }} /><EventStatus event={{ status: 'CANCELLED' }} />
            </div>}
            text='rule.text.stepC'
        />
    )
}

export default function Rules() {
    const { t } = useTranslation()
    const [currentStep, setCurrentStep] = useState(1)
    const { toggleModal } = useSettingsStore()

    const steps = [1, 2, 3]
    const maxStep = steps.length

    return (
        <div id="rules">
            {currentStep === 1 && <RuleStepA />}
            {currentStep === 2 && <RuleStepB />}
            {currentStep === 3 && <RuleStepC />}
            <div id='rules-control' className='box'>
                <div className='dots my-[15px]'>
                    {steps.map((s, i) => (
                        <div key={i} className={`dot ${currentStep === s && 'active'}`}></div>
                    ))}
                </div>
                <div className='flex flex-col gap-[15px]'>
                    {currentStep !== maxStep && <Button name={t('button.next')} type='main' color='b-g' wd={true} action={() => setCurrentStep(prev => prev + 1)} />}
                    {currentStep === maxStep && <Button name={t('button.close')} type='main' color='b-g' wd={true} action={() => toggleModal()} />}
                    <Button name={t('button.back')} type='secondary' wd={true} action={() => setCurrentStep(1)} />
                </div>
            </div>
        </div>
    )
}