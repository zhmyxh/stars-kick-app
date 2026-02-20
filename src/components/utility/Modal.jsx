import '../../styles/Modal.css'

import IconClose from '../../assets/icons/icon-close.svg?react'
import { useSettingsStore } from '../../store/useStore'
import NotFound from './NotFound'

function Modal({ header, children }) {
    const { toggleModal } = useSettingsStore()

    return (
        <div id="modal">
            <div id="modal-header">
                <span className="default-text" style={{ fontWeight: 500, fontSize: 20 }}>{header}</span>
                <button className="button-i" onClick={toggleModal}>
                    <IconClose className='icon-default' width={24} height={24} />
                </button>
            </div>
            <div id="modal-content">{children ? children : <NotFound />}</div>
        </div>
    )
}

export default Modal