import { Markup } from "interweave"

export default function GameScreen(props) {
    const answears = props.answears.map(item => {
        let styling = {}

        if (item.correct) {
            styling = {
                backgroundColor: !item.isHeld ? 'var(--clr-accent-2)' : '#BBDF32',
                color: '#000',
            }
        } else {
            styling = {
                backgroundColor: !item.isHeld ? 'var(--text-primary)' : 'var(--clr-accent)',
                color: !item.isHeld ? '#000' : '#fff',
            }
        }

        return <div 
        style={styling} 
        className="game_screen__res" 
        key={item.id} 
        correct={item.correct}
        onClick={() => props.handleClick(item.id, item.parentId)}><Markup content={item.answer} />
        </div>
    })

    return (
        <div className="game_screen">
            <h2 className="game_screen__question"><Markup content={props.question} /></h2>
            <div className="game_screen__res__body">
                {answears}
            </div>
            <hr />
        </div>
    )
}
