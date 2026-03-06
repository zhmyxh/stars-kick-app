import '../../styles/Modal.css'

import IconClose from '../../assets/icons/icon-close.svg?react'
import { useSettingsStore } from '../../store/useStore'
import NotFound from './NotFound'
import { useEffect, useRef, useState } from 'react'

function Modal({ header, children }) {
    const { toggleModal } = useSettingsStore()
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
            setHeight(element.scrollHeight + 25)
        })

        observer.observe(element)

        setHeight(element.scrollHeight)
        return () => observer.disconnect()
    }, [])

    const handleModal = () => {
        setOpened(false)
        setTimeout(() => {
            if (opened) toggleModal()
        }, 300)
    }

    return (
        <div id="overlay" onClick={handleModal}>
            <div id="modal" className={opened ? "modal-open" : ""} onClick={(e) => e.stopPropagation()}>
                <div id="modal-header">
                    <span className="default-text" style={{ fontWeight: 'bold', fontSize: 20 }}>{header}</span>
                    <button className="button-i" onClick={handleModal}>
                        <IconClose className='icon-default' width={20} height={20} />
                    </button>
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