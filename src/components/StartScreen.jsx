export default function StartScreen(props) {
  return (
    <div className="start_screen">
        <h1 className="start_screen__header">Quizzical</h1>
        <p className="start_screen__description">Take a quiz yourself!</p>
        <button onClick={props.handleClick}>Start quiz</button>
    </div>
  )
}
