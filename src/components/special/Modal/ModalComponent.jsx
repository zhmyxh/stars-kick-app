import './Modal.styles.css'

import IconClose from '@/assets/icons/icon-close.svg?react'
import IconRefresh from '@/assets/icons/icon-refresh.svg?react'
import { useSettingsStore } from '@/store/useStore'
import NotFound from '@/components/utility/NotFound'
import { useEffect, useRef, useState } from 'react'

function Modal({ header, children }) {
    const ableToClose = useSettingsStore(state => state.modal.ableToClose)
    const toggleModal = useSettingsStore(state => state.toggleModal)

    const [opened, setOpened] = useState(false)
    const [height, setHeight] = useState(0)
    const contentRef = useRef(null)

    useEffect(() => {
        requestAnimationFrame(() => {
            setOpened(true)
        })
    }, [])

    useEffect(() => {
        if (!contentRef.current) return

        const element = contentRef.current

        const observer = new ResizeObserver(() => {
            const newHeight = element.scrollHeight + 25
            setHeight(prev => prev !== newHeight ? newHeight : prev)
        })

        observer.observe(element)

        setHeight(element.scrollHeight)
        return () => observer.disconnect()
    }, [])

    const handleModal = () => {
        if (!ableToClose) return

        setOpened(false)
        setTimeout(() => {
            toggleModal({ status: false })
        }, 300)
    }

    return (
        <div id="modal-overlay" onClick={handleModal}>
            <div id="modal" className={opened ? "modal-open" : ""} onClick={(e) => e.stopPropagation()}>
                <div id="modal-header">
                    <span className="default-text" style={{ fontWeight: 'bold', fontSize: 20 }}>{header}</span>
                    {ableToClose && (
                        <div className="flex items-center gap-[10px]">
                            <button className="button-i" onClick={handleModal}>
                                <IconClose className='icon-default' width={20} height={20} />
                            </button>
                        </div>
                    )}
                </div>
                <div id="modal-content" style={{ overflowY: opened ? 'auto' : 'hidden', height: height, transition: "height 0.3s ease" }}>
                    <div ref={contentRef} style={{ boxSizing: 'border-box' }}>
                        {children ? children : <NotFound />}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal