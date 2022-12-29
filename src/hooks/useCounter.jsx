import { useCallback, useMemo, useState } from "react"

export const useCounter = () => {
  const [count, setCount] = useState(0)

  const doubleCount = useMemo(() => {
    count * 2
  }, [count])

  const countUp = useCallback(() => {
    setCount(prevCount => prevCount + 1)
  }, [])
  const countDown = useCallback(() => {
    setCount(prevCount => prevCount - 1)
  }, [])

  return { count, doubleCount, countUp, countDown }
}