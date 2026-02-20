import '../../styles/Modal.css'

import IconClose from '../../assets/icons/icon-close.svg?react'
import { useSettingsStore } from '../../store/useStore'
import NotFound from './NotFound'
import { useEffect, useState } from 'react'

function Modal({ header, children }) {
    const { toggleModal } = useSettingsStore()
    const [size, setSize] = useState(0)

    useEffect(() => {
        setSize(650)
    }, [])

    const handleModal = () => {
        setSize(0)
        setTimeout(() => {
            toggleModal()
        }, 300)
    }

    return (
        <div id="modal" style={{ height: size }}>
            <div id="modal-header">
                <span className="default-text" style={{ fontWeight: 'bold', fontSize: 20 }}>{header}</span>
                <button className="button-i" onClick={handleModal}>
                    <IconClose className='icon-default' width={20} height={20} />
                </button>
            </div>
            <div id="modal-content">{children ? children : <NotFound />}</div>
        </div>
    )
}

export default Modal