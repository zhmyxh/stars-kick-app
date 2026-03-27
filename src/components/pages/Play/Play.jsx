import '../../styles/Play.css'

import IconStar from '../../assets/icons/icon-star.svg?react'
import IconPlay from '../../assets/icons/icon-play.svg?react'
import IconWarning from '../../assets/icons/icon-warning.svg?react'
import IconClear from '../../assets/icons/icon-clear.svg?react'
import IconLock from '../../assets/icons/tech-icons/icon-lock.svg?react'

import IconDeposit from '../../assets/icons/icon-deposit.svg?react'
import IconWithdraw from '../../assets/icons/icon-export.svg?react'

import IconDemo from '../../assets/icons/play-icons/icon-demo.svg?react'
import IconNoDemo from '../../assets/icons/play-icons/icon-no-demo.svg?react'

import IconWin from '../../assets/icons/play-icons/icon-win.svg?react'
import IconLose from '../../assets/icons/play-icons/icon-lose.svg?react'
import IconTie from '../../assets/icons/play-icons/icon-tie.svg?react'

import IconRules from '../../assets/icons/icon-rules.svg?react'

import { useEffect, useState } from 'react'
import { usePlayStore, useSettingsStore, useUserStore } from '../../../store/useStore'
import Header from '../../utility/Header'
import { useTranslation } from 'react-i18next'
import Score from '../../utility/Score'

function ModeBox({ array, current, action, name, hint, select, children }) {
    return (
        <div className='play-box box'>
            <div className='play-header-box'>
                <span className='play-header default-text' style={{ fontWeight: 600 }}>{name}</span>
                <span className='secondary-text'>{hint}</span>
            </div>
            {children}
        </div>
    )
}

function BlackJackContainer() {
    const { readyToPlay, currentMode, demoMode, warning, gameStatus } = usePlayStore()
    const { balance } = useUserStore()
    const { t } = useTranslation()

    return (
        <div id="play-game-container" style={{ height: gameStatus === 'started' ? 380 : 240 }}>
            {gameStatus === 'pre-start' && (
                <div id='play-game-settings'>
                    <div className='play-game-status'>
                        {demoMode ? <IconDemo className='icon-invert' width={16} height={16} /> : <IconNoDemo className='icon-invert' width={16} height={16} />}
                        <span className='text-white'>{demoMode ? t('status.demo') : t('status.real')}</span>
                    </div>
                    {currentMode > 0 && (
                        <div className='play-game-status'>
                            <span className='text-white'>{currentMode}X</span>
                        </div>
                    )}
                </div>
            )}

            {gameStatus === 'pre-start' && (
                <div id='play-bj-status' className='play-game-status'>
                    <span className='text-white'>{t('status.blackjack', { value: '6:5' })}</span>
                </div>
            )}

            {!readyToPlay && (
                <div id='play-game-pre-start'>
                    <IconWarning className='icon-invert' width={20} height={20} />
                    <div className='play-header-box'>
                        <span className='text-white' style={{ fontSize: 12 }}>{t(warning)}</span>
                    </div>
                </div>
            )}
        </div>
    )
}

function GameControl() {
    const { totalBet } = usePlayStore()
    const { gameStatus, setGameStatus } = usePlayStore()
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    const playStep = (step) => {
        // game logic (API)
        switch (step) {
            case 'hit':
                // hit logic
                setGameStatus('win')
                break
            case 'stand':
                // stand logic
                setGameStatus('lose')
                break
            case 'double':
                // double bet logic
                setGameStatus('tie')
                break
            default:
                break
        }
    }

    const Result = ({ win }) => {
        let message = ''
        let header = ''
        let icon = null

        switch (win) {
            case 'user':
                message = t('header.yourprize')
                header = t('header.youwin')
                icon = <IconWin width={35} height={35} />
                break
            case 'dealer':
                message = t('header.yourloss')
                header = t('header.youlost')
                icon = <IconLose width={35} height={35} />
                break
            case 'tie':
                message = t('header.yourprize')
                header = t('header.tie')
                icon = <IconTie width={35} height={35} />
                break
        }

        return (
            <div id='play-game-result' className='box'>
                {icon}
                <span className='default-text' style={{ fontSize: 20, fontWeight: 'bold' }}>{header}</span>
                <span className='secondary-text'>{message}</span>
                <Score value={win === 'tie' ? 0 : totalBet * 2} icon={true} />
                <button className='button-main b-g' style={{ width: '100%', marginTop: 15 }} onClick={() => setGameStatus('pre-start')}>
                    <span>{t('button.back')}</span>
                </button>
                {win === 'user' ? (
                    <button className="button-main" style={{ width: '100%' }} onClick={() => toggleModal('withdraw')}>
                        <IconWithdraw className='icon-default' width={20} height={20} />
                        <span className="default-text">{t('button.withdraw')}</span>
                    </button>
                ) : (
                    <button className="button-main" style={{ width: '100%' }} onClick={() => toggleModal('deposit')}>
                        <IconDeposit className='icon-default' width={20} height={20} />
                        <span className="default-text">{t('button.deposit')}</span>
                    </button>
                )}
            </div>
        )
    }

    return (
        <div id="play-game">
            {gameStatus === 'started' && (
                <div id='play-game-control' className='box'>
                    <button className='button-main b-g' onClick={() => playStep('hit')}>
                        <span>{t('button.hit')}</span>
                    </button>
                    <button className='button-main b-b' onClick={() => playStep('stand')}>
                        <span>{t('button.stand')}</span>
                    </button>
                    <button className='button-main' onClick={() => playStep('double')}>
                        <span>{t('button.double')}</span>
                    </button>
                </div>
            )}

            {gameStatus === 'win' && (
                <Result win={'user'} />
            )}

            {gameStatus === 'lose' && (
                <Result win={'dealer'} />
            )}

            {gameStatus === 'tie' && (
                <Result win={'tie'} />
            )}
        </div>
    )
}

function PlayPage() {
    const [betList, setBetList] = useState([10, 25, 75])
    const [modeList, setModeList] = useState([1, 5, 10])
    const { toggleModal } = useSettingsStore()

    const { totalBet, readyToPlay, setTotalBet, currentBet, currentMode, setBet, setMode, demoMode, setDemoMode,
        warning, gameStatus, setGameStatus } = usePlayStore()
    const { balance } = useUserStore()

    useEffect(() => {
        setTotalBet()
    }, [currentBet, currentMode])

    useEffect(() => {
        if (currentMode === 0 && currentBet > 0) setMode(1)
    }, [currentBet])

    const playGame = () => {
        if (readyToPlay) {
            setGameStatus('started')
        }
    }

    const clearBet = () => {
        setTotalBet(0)
        setBet(0)
        setMode(0)
    }

    const { t } = useTranslation()

    return (
        <div id="play" className="default-page">
            <BlackJackContainer />
            {gameStatus !== 'pre-start' && <GameControl />}
            {gameStatus === 'pre-start' && (
                <div id='play-game-options'>
                    <div className='play-box box'>
                        {readyToPlay ? (
                            <button className='button-main' style={{ width: '100%' }} onClick={() => playGame()}>
                                <span>{t('button.start')}</span>
                                {totalBet > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                        <IconStar width={20} height={20} />
                                        <span>{totalBet}</span>
                                    </div>
                                )}
                            </button>
                        ) : (
                            <button className='button-main' style={{ width: '100%' }} onClick={() => playGame()}>
                                <IconLock className='icon-default' width={20} height={20} />
                            </button>
                        )}
                        <button className='button-secondary' style={{ width: '100%' }} onClick={() => clearBet()}>
                            <IconClear className='icon-default' width={16} height={16} />
                            <span>{t('button.clear')}</span>
                        </button>
                    </div>
                    <ModeBox name={t('header.bet')} hint={t('definition.bet')}>
                        <div className='play-select-box'>
                            {betList.map(bet => (
                                <div className={`play-select ${currentBet === bet ? 'selected' : ''}`} onClick={() => setBet(bet)}>
                                    <IconStar width={20} height={20} />
                                    <span className='default-text'>{bet}</span>
                                </div>
                            ))}
                        </div>
                    </ModeBox>
                    <ModeBox name={t('header.mode')} hint={t('definition.mode')}>
                        <div className='play-select-box'>
                            {modeList.map(mode => (
                                <div className={`play-select ${currentMode === mode ? 'selected' : ''}`} onClick={() => setMode(mode)}>
                                    <span className='default-text'>{mode}X</span>
                                </div>
                            ))}
                        </div>
                    </ModeBox>
                    <ModeBox name={t('header.type')} hint={t('definition.type')}>
                        <div id='play-type-select'>
                            <label className="switch">
                                <input type="checkbox" checked={demoMode} onChange={setDemoMode} />
                                <span className="slider"></span>
                            </label>
                            <span className='default-text' style={{ fontSize: 14 }}>{t('button.demomode')}</span>
                        </div>
                    </ModeBox>
                </div>
            )}
        </div>
    )
}

export default PlayPage