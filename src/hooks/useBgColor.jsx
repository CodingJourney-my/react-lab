import { useRouter } from "next/router"
import { useEffect, useMemo } from "react"

export const useBgColor = () => {
  const router = useRouter()
  const bgColor = useMemo(() => {
    return router.pathname === "/" ? "lightblue" : "beige"
  }, [router.pathname])

  useEffect(() => {
    document.body.style.backgroundColor = bgColor
    return () => {
      document.body.style.backgroundColor = ""
    }
  }, [bgColor])
}