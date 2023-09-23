import { useState, useEffect, useCallback } from 'react'
import words from './wordList.json'
import { HangmanDrawing } from './components/HangmanDrawing'
import { HangmanWord } from './components/HangmanWord'
import { Keyboard } from './components/Keyboard'

function getWord() {
  return words[Math.floor(Math.random() * words.length)]
}

function App() {
  const [wordToGuess, setWordToGuess] = useState<string>(getWord)
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])


  // 30:00
  const incorrectLetters = guessedLetters.filter(letter => !wordToGuess.includes(letter))

  const isLoser = incorrectLetters.length >= 6
  // const isWinner = guessedLetters.join('') === wordToGuess
  const isWinner = wordToGuess.split('').every(letter => guessedLetters.includes(letter))

  // useCallBack returns a memoized version of the callback that only changes if one of the input changes
  const addGuessedLetter = useCallback((letter: string) => {
    if (guessedLetters.includes(letter) || isLoser || isWinner) return
    setGuessedLetters(currentLetters => [...currentLetters, letter])
  }, [guessedLetters])

  // We're using useEffect to monitor clicks on our actual keyboard
  useEffect(() => {
    // const handler = (e: KeyboardEvent) => {
    const handler = (e: any) => {
      const key = e.key
      if (!key.match(/^[a-z]$/)) return
      e.preventDefault()
      addGuessedLetter(key)
    }
    document.addEventListener('keypress', handler)

    return () => {
      document.removeEventListener('keypress', handler)
    }
  }, [guessedLetters, isWinner, isLoser])

  // using enter to start a new game:
  useEffect(() => {
    // const handler = (e: KeyboardEvent) => {
    const handler = (e: any) => {
      const key = e.key
      if (key !== 'Enter') return
      e.preventDefault()

      setGuessedLetters([])
      setWordToGuess(getWord())
    }
    document.addEventListener('keypress', handler)

    return () => {
      document.removeEventListener('keypress', handler)
    }
  }, [isWinner, isLoser])

  return (
    <div
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        margin: '0 auto',
        alignItems: 'center'
      }}
    >
      <div style={{ fontSize: '2rem', textAlign: 'center' }}>
        {isWinner && 'You won! - Refresh to play again'}
        {isLoser && 'Nice try! - Refresh to try again'}
        O</div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord reveal={isLoser} guessedLetters={guessedLetters} wordToGuess={wordToGuess} />
      <div style={{ alignSelf: 'stretch', marginTop: '30px' }}>
        <Keyboard disabled={isLoser || isWinner} activeLetter={guessedLetters.filter(letter => wordToGuess.includes(letter))}
          inactiveLetter={incorrectLetters}
          addGuessedLetter={addGuessedLetter}
        />
      </div>
    </div>
  )
}

export default App
