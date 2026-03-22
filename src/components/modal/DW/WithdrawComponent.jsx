import './_deposit.withdraw.styles.css'

import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useContentStore, useUserStore } from '@/store/useStore'
import { httpPost } from '@/api'

import IconStar from '@/assets/icons/icon-star.svg?react'
import Score from '@/components/utility/Score'
import IconWin from '@/assets/icons/play-icons/icon-win.svg?react'
import IconLose from '@/assets/icons/play-icons/icon-lose.svg?react'
import { Loader } from '../../utility/Loader/LoaderComponent'
import SmartImage from "@/components/utility/SmartImage"
import IconAv from '@/assets/icons/icon-av.svg?react'
import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconHeart from '@/assets/icons/icon-heart.svg?react'
import IconBest from '@/assets/icons/icon-best.svg?react'

const WithdrawList = ({ amount, setAmount }) => {
    const { t } = useTranslation()
    const { withdrawPack } = useContentStore()
    const [selected, setSelected] = useState('')

    const handleSelectPack = (value, id, status) => {
        if (status === 'status.available' && selected !== id) {
            setSelected(id)
            setAmount(value)
        }
    }

    useEffect(() => {
        const best = withdrawPack.find(p => p.mark === 'mark.best')
        handleSelectPack(best.amount, best.id, best.status)
    }, [])

    return (
        <div id='pack-list'>
            {withdrawPack.map(pack => {
                const check = selected === pack.id
                return (
                    <div key={pack.id}
                        className={`pack-element ${check ? 'pack-selected' : ''} ${pack.status === 'status.available' ? 'pack-available' : 'pack-unavailable'}`}
                        onClick={() => handleSelectPack(pack.amount, pack.id, pack.status)}>
                        <div className='flex w-fit'>
                            <SmartImage src='src/assets/images/star-pack.png' width={50} height={50} />
                        </div>
                        <div className='flex flex-col gap-[5px] items-start'>
                            <Score value={pack.amount} icon={<IconStar width={18} height={18} />} />
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
                    </div>
                )
            })}
        </div>
    )
}

const WithdrawPending = ({ setStatus, amount, setAmount }) => {
    const { balance, addBalance } = useUserStore()
    const { server } = useContentStore()
    const { withdrawPack, withdrawFee } = useContentStore()
    const { t } = useTranslation()

    const [ableToWith, setAbleToWith] = useState(false)

    const queryClient = useQueryClient()

    const fetchWithdrawPayment = async () => {
        return await httpPost(server + 'payment/withdraw-request', { amount: amount })
    }

    const { mutate, isLoading } = useMutation({
        mutationFn: fetchWithdrawPayment,
        onMutate: () => setStatus({ key: 'loading', text: 'status.withloading' }),
        onSuccess: () => {
            addBalance(-amount)
            queryClient.invalidateQueries({ queryKey: ['wallet'] })
            setStatus({ key: 'success', text: 'status.withsuccess' })
        },
        onError: (err) => setStatus({ key: 'error', text: err })
    })

    const handleWithdraw = () => {
        if (ableToWith) mutate()
    }

    const wallet = queryClient.getQueryData(['wallet'])

    useEffect(() => {
        if (wallet) setAbleToWith(wallet.withdrawable_balance >= amount && amount > 0)
    }, [amount, wallet])

    const availablePropositions = withdrawPack.filter(p => p.status === 'status.available').length
    const allPropositions = withdrawPack.length

    return (
        <div className="flex flex-col gap-[25px]">
            <span className='secondary-text'>{t('definition.withdraw')}</span>
            <div id='withdraw-info'>
                <div className='withdraw-info-box'>
                    <span className='secondary-text'>{t('header.available')}</span>
                    <Score value={wallet?.withdrawable_balance} icon={<IconStar width={18} height={18} />} filled={true} />
                </div>
                <div className='withdraw-info-box'>
                    <span className='secondary-text'>{t('header.propositions')}</span>
                    <Score value={availablePropositions + '/' + allPropositions} filled={true} />
                </div>
                <div className='withdraw-info-box'>
                    <span className='secondary-text'>{t('header.fee')}</span>
                    <Score value={withdrawFee + '%'} filled={true} />
                </div>
            </div>
            <WithdrawList amount={amount} setAmount={setAmount} />
            <div id='withdraw-menu' className='flex flex-col gap-[5px]'>
                <button className='button-main b-b' style={{ width: '100%' }} disabled={!ableToWith} onClick={handleWithdraw}>
                    <span className="white-text">{ableToWith ? t('button.withdraw') : t('warning.youcannotwithdraw')}</span>
                    {ableToWith && <Score value={amount} color={'white'} icon={<IconStar width={18} height={18} />} />}
                </button>
            </div>
        </div>
    )
}

const WithdrawSuccess = ({ setStatus, amount, setAmount }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center gap-[25px]" style={{ height: 200 }}>
            <IconWin width={50} height={50} />
            <div className='flex flex-col gap-[10px] items-center'>
                <div className='flex flex-col gap-[5px] items-center'>
                    <span className="secondary-text">{t('header.withstatus')}</span>
                    <span className="header-text">{t('header.success')}</span>
                </div>
                <Score value={amount} icon={<IconStar width={18} height={18} />} filled={true} />
            </div>
        </div>
    )
}

const WithdrawFailed = ({ status, setStatus, amount, setAmount }) => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center justify-center gap-[25px]" style={{ height: 200 }}>
            <IconLose width={50} height={50} />
            <div className="flex flex-col gap-[5px] items-center">
                <span className="secondary-text">{t('header.paymentstatus')}</span>
                <span className="header-text">{t('header.failed')}</span>
                <span className="secondary-text">{status.text}</span>
            </div>
        </div>
    )
}

export default function Withdraw() {
    const { t } = useTranslation()

    const [status, setStatus] = useState({ key: 'pending', text: '' })
    const [amount, setAmount] = useState(0)

    return (
        <div id="withdraw">
            {status.key === 'pending' &&
                <WithdrawPending setStatus={setStatus} amount={amount} setAmount={setAmount} />}
            {status.key === 'success' &&
                <WithdrawSuccess setStatus={setStatus} amount={amount} setAmount={setAmount} />}
            {status.key === 'failed' &&
                <WithdrawFailed status={status} setStatus={setStatus} amount={amount} setAmount={setAmount} />}
            {status.key === 'loading' &&
                <Loader text={t('loader.payment')} />}
        </div>
    )
}