import '../../styles/Games.css'

import { useContentStore } from "../../store/useStore"

function Games() {
    const { activities } = useContentStore()
    return (
        <div id="games" className="app-page">
            <div id="games-list">
                {activities.map((activity, index) => (
                    <div key={index} className="game-activity box">
                        <div className={`game-icon ${activity.icon}`}></div>
                        <span className="default-text">{activity.name}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Games