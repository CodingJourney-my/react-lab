import { useCallback, useState } from "react"

export const useCounter = () => {
  const [count, setCount] = useState(0)

  const countUp = useCallback(() => {
    setCount(prevCount => prevCount + 1)
  }, [])
  const countDown = useCallback(() => {
    setCount(prevCount => prevCount - 1)
  }, [])

  return { count, countUp, countDown }
}