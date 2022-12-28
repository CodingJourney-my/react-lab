import { useCallback, useState } from "react"

export const useInputArray = () => {
  const [text, setText] = useState('')
  const [array, setArray] = useState([])

  const handleChangeText = useCallback((e) => {
    // スペースの入力を制限
    setText(e.target.value.trim())
  }, [])

  const handleAddArray = useCallback(() => {
    console.log('addArray')
    setArray((prevArray) => {
      if(prevArray.some(item => item === text)) {
        alert("Already exist!")
        return prevArray
      }
      return [...prevArray, text]
    })
  }, [text])

  return { text, array, handleChangeText, handleAddArray }
}