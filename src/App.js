import axios from "axios";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";
import Confetti from "react-confetti";

function App() {
  const [apiRes, setApiRes] = useState([])
  const [questions, setQuestions] = useState([])
  const [score, setScore] = useState(0)
  const [end, setEnd] = useState(false)
  const [restart, setRestart] = useState(true)

  useEffect(() => {
    axios.get('https://opentdb.com/api.php?amount=5&type=multiple')
    .then(function (response) {
      setApiRes(response.data.results)
    })
  }, [end])

  function startGame() {
    setEnd(false)
    setScore(0)
    setQuestions(apiRes.map(item => {
      let allQuestions = []
      allQuestions = allQuestions.concat(item.incorrect_answers, item.correct_answer)
      allQuestions.sort(() => Math.random() - 0.5)

      const id = nanoid()

      const allQuestionsObject = allQuestions.map(item => {
        return {
          id: nanoid(),
          parentId: id,
          answer: item,
          isHeld: false,
          correct: false,
        }
      })

      return {
        id: id,
        question: item.question,
        answers: allQuestionsObject,
        correct: item.correct_answer
      }
    }))
    setRestart(false)
  }

  function handleClick(id, parentId) {
    if (!end) {
      setQuestions(prevState => prevState.map(item => {
        const updatedAnswer = item.answers.map(item => {
          if (item.parentId === parentId) {
            return item.id === id ? {...item, isHeld: !item.isHeld} : {...item, isHeld: false}
          } else {
            return {...item}
          }
        })
  
        return {
          ...item,
          answers: updatedAnswer
        }
      }))
    }
  }

  function endGame() {
    if(!end) {
      setScore(0)

      setQuestions(prevState => prevState.map(question => {
        const correctAnswer = question.correct
  
        const updatedAnswer = question.answers.map(item => {
          if (item.answer === correctAnswer && item.isHeld) {
            setScore(prevState => prevState + 1)
          }

          if (item.answer === correctAnswer) {
            return {
              ...item,
              correct: true
            } 
          } else return item
        })

        return {
          ...question,
          answers: updatedAnswer
        }
      }))

      setEnd(true)
    } else {
      setRestart(true)
    }
  }

  const allQuestions = questions.map(item => {
    return (
      <GameScreen
      key={item.id} 
      id={item.id}
      parentId={item.parentId}
      question={item.question}
      correct={item.correct}
      answears={item.answers}
      handleClick={handleClick} />
    )
  })
  
  return (
    <div className="app">
      {restart ?
      <StartScreen handleClick={startGame}/> :
      <>
      {score >= 3 && <Confetti />}
      <div className="all_questions">{allQuestions}</div>
      <h3 className="score">Score: {score} / 5</h3>
      <button className="score_btn" onClick={endGame}>{end ? "Restart" : "Check Score"}</button>
      </>}
    </div>
  );
}

export default App
