export const Loader = ({ text }) => {
    return <div className="loader-container">
        <div className="loader"></div>
        <span className="secondary-text">{text}</span>
    </div>
}