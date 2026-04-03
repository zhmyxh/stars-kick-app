import './_deposit.withdraw.styles.css'

import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useContentStore, useUserStore } from '@/store/useStore'
import { useSettingsStore } from '@/store/useStore'
import { Loader, LoaderMini } from '../../special/Loader/LoaderComponent'
import { httpPost } from '@/api'
import { invoice, isTMA } from '@telegram-apps/sdk'

import IconStar from '@/assets/icons/icon-star.svg?react'
import Score from '@/components/utility/Score'
import IconWin from '@/assets/icons/play-icons/icon-win.svg?react'
import IconLose from '@/assets/icons/play-icons/icon-lose.svg?react'
import SmartImage from "@/components/utility/SmartImage"
import IconAv from '@/assets/icons/icon-av.svg?react'
import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconHeart from '@/assets/icons/icon-heart.svg?react'
import IconBest from '@/assets/icons/icon-best.svg?react'
import Button from '@/components/utility/Button'

const DepositList = ({ amount, setAmount }) => {
    const { t } = useTranslation()
    const { depositPack } = useContentStore()
    const [selected, setSelected] = useState('')

    const handleSelectPack = (value, id, status) => {
        if (status === 'status.available' && selected !== id) {
            setSelected(id)
            setAmount(value)
        }
    }

    useEffect(() => {
        const best = depositPack.find(p => p.mark === 'mark.best')
        handleSelectPack(best.amount, best.id, best.status)
    }, [])

    const sortedPack = depositPack.sort((a, b) => {
        if (a.status === 'status.available' && b.status === 'status.unavailable') {
            return -1
        }
        if (a.status === 'status.unavailable' && b.status === 'status.available') {
            return 1
        }
        return 0
    })

    return (
        <div id='pack-list'>
            {sortedPack.map(pack => {
                const check = selected === pack.id
                return (
                    <div key={pack.id}
                        className={`pack-element ${check ? 'pack-selected' : ''} ${pack.status === 'status.available' ? 'pack-available' : 'pack-unavailable'}`}
                        onClick={() => handleSelectPack(pack.amount, pack.id, pack.status)}>
                        <div className='flex w-fit'>
                            <SmartImage src='./star-pack-deposit.png' width={60} height={50} />
                        </div>
                        <div className='flex flex-col gap-[5px] items-start'>
                            <div className='flex items-center gap-[5px]'>
                                <Score value={pack.amount} icon={<IconStar width={18} height={18} />} />
                                {pack.quotation > 0 && <span className='secondary-text'>≈${pack.quotation}</span>}
                            </div>
                            {pack.status === 'status.available' ? (
                                <div className="flex items-center gap-[5px]">
                                    <IconAv className='icon-default' width={15} height={15} />
                                    <span className='secondary-text'>{t(pack.status)}</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-[5px]">
                                    <IconLock className='icon-default' width={15} height={15} />
                                    <span className='secondary-text'>{t(pack.status)}</span>
                                </div>
                            )}
                        </div>
                        {pack.mark === 'mark.favorite' && (
                            <div id='pack-favorite' className='pack-mark'>
                                <IconHeart className='icon-invert' width={12} height={12} />
                                <span className='white-text' style={{ fontSize: 12 }}>{t(pack.mark)}</span>
                            </div>
                        )}
                        {pack.mark === 'mark.best' && (
                            <div id='pack-best' className='pack-mark'>
                                <IconBest className='icon-invert' width={12} height={12} />
                                <span className='white-text' style={{ fontSize: 12 }}>{t(pack.mark)}</span>
                            </div>
                        )}
                        {pack.mark === 'mark.test' && (
                            <div id='pack-test' className='pack-mark'>
                                <span className='white-text' style={{ fontSize: 12 }}>{t(pack.mark)}</span>
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

const DepositPending = ({ setStatus, amount, setAmount }) => {
    const { balance, addBalance } = useUserStore()
    const { server } = useContentStore()
    const { depositPack, depositFee } = useContentStore()
    const { t } = useTranslation()
    const { toggleModal } = useSettingsStore()

    const [ableToDep, setAbleToDep] = useState(false)

    const queryClient = useQueryClient()

    const fetchDepositPayment = async () => {
        return await httpPost(server + 'payment/deposit-invoice', { amount: amount })
    }

    const openInvoice = async (link) => {
        const isTelegram = isTMA()

        if (isTelegram && invoice.open.isAvailable()) {
            try {
                const status = await invoice.open(link, 'url')
                if (status === 'paid') {
                    setStatus({ key: 'success' })
                    addBalance(amount)
                    queryClient.invalidateQueries({ queryKey: ['wallet'] })
                } else {
                    setStatus({ key: 'failed' })
                }
            } catch (error) {
                setStatus({ key: 'failed' })
            }
        } else if (!isTelegram) {
            setTimeout(() => {
                setStatus({ key: 'success' })
                addBalance(amount)
            }, 1000)
        }
    }

    const { mutate, isLoading } = useMutation({
        mutationFn: fetchDepositPayment,
        onMutate: () => {
            toggleModal({ ableToClose: false })
            setStatus({ key: 'loading' })
        },
        onSuccess: (data) => {
            toggleModal({ ableToClose: true })
            setStatus({ key: 'confirming' })
            if (data) openInvoice(data.invoice_link)
        },
        onError: (err) => {
            toggleModal({ ableToClose: true })
            setStatus({ key: 'error' })
        }
    })

    const handleDeposit = () => {
        if (ableToDep) mutate()
    }

    const wallet = queryClient.getQueryData(['wallet'])

    useEffect(() => {
        if (wallet) setAbleToDep(amount > 0)
    }, [amount, wallet])

    const availablePropositions = depositPack.filter(p => p.status === 'status.available').length
    const allPropositions = depositPack.length

    return (
        <div className="flex flex-col gap-[25px]">
            <span className='secondary-text'>{t('definition.deposit')}</span>
            <div id='deposit-info'>
                <div className='deposit-info-box'>
                    <span className='secondary-text'>{t('header.propositions')}</span>
                    <Score value={availablePropositions + '/' + allPropositions} filled={true} />
                </div>
                <div className='deposit-info-box'>
                    <span className='secondary-text'>{t('header.fee')}</span>
                    <Score value={depositFee + '%'} filled={true} />
                </div>
            </div>
            <DepositList amount={amount} setAmount={setAmount} />
            <div id='deposit-menu' className='flex flex-col items-center gap-[5px]'>
                <button className='button-main b-g' style={{ width: '95%' }} disabled={!ableToDep} onClick={handleDeposit}>
                    <span className="white-text">{ableToDep ? t('button.deposit') : t('warning.youcannotdeposit')}</span>
                    {ableToDep && <Score value={amount} color={'white'} icon={<IconStar width={18} height={18} />} />}
                </button>
            </div>
        </div>
    )
}

const DepositStatus = ({ status, setStatus, amount, setAmount }) => {
    const { t } = useTranslation()
    const { toggleModal } = useSettingsStore()

    const defaultClass = 'flex flex-col items-center justify-center gap-[25px]'

    useEffect(() => {
        if (status.key === 'confirming') {
            toggleModal({ ableToClose: false })
        } else {
            toggleModal({ ableToClose: true })
        }
    }, [status])

    return (
        <div className="flex flex-col items-center justify-center gap-[25px] pb-[15px]">

            <div className='flex items-center justify-center' style={{ minHeight: 250 }}>
                {status.key === 'confirming' && (
                    <div className={defaultClass} style={{ height: 500 }}>
                        <span className="secondary-text">{t('header.waitingforconfirm')}</span>
                        <LoaderMini />
                    </div>
                )}

                {status.key === 'success' && (
                    <div className={defaultClass}>
                        <IconWin width={50} height={50} />
                        <div className='flex flex-col gap-[10px] items-center'>
                            <div className='flex flex-col gap-[5px] items-center'>
                                <span className="secondary-text">{t('header.paymentstatus')}</span>
                                <span className="header-text">{t('header.success')}</span>
                            </div>
                            <Score value={amount} icon={<IconStar width={18} height={18} />} filled={true} />
                        </div>
                    </div>
                )}

                {status.key === 'failed' && (
                    <div className={defaultClass}>
                        <IconLose width={50} height={50} />
                        <div className="flex flex-col gap-[5px] items-center">
                            <span className="secondary-text">{t('header.paymentstatus')}</span>
                            <span className="header-text">{t('header.failed')}</span>
                        </div>
                    </div>
                )}
            </div>

            {status.key !== 'confirming' && (
                <Button name={t('button.back')} type='main' color='b-b' wd={true} action={() => setStatus({ key: 'pending' })} />
            )}
        </div>
    )
}

export default function Deposit() {
    const { t } = useTranslation()

    const [status, setStatus] = useState({ key: 'pending' })
    const [amount, setAmount] = useState(0)

    return (
        <div id="deposit">
            {
                status.key === 'pending'
                    ? <DepositPending status={status} setStatus={setStatus} amount={amount} setAmount={setAmount} />
                    : status.key === 'loading' ? <Loader text={t('loader.depositloading')} />
                        : <DepositStatus status={status} setStatus={setStatus} amount={amount} setAmount={setAmount} />
            }
        </div>
    )
}