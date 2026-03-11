import './_loader.styles.css'

export const Loader = ({ text }) => {
    return <div className="loader-container">
        <div className="loader"></div>
        <span className="secondary-text">{text}</span>
    </div>
}

export const LoaderMini = () => {
    return <div className="loader-2"></div>
}