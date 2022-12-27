import classes from 'src/styles/Home.module.css'
import { Links } from 'src/components/Links'
import { Headline } from 'src/components/Headline'
import { CenterLogos } from 'src/components/CenterLogos'
import { useEffect } from 'react'

export function Main() {

  useEffect(() => {
    console.log("mount")
    document.body.style.backgroundColor = "lightblue"

    return () => {
      console.log("unmount")
      document.body.style.backgroundColor = ""
    }
  }, [])

  return (
    <main className={classes.main}>
      <Headline/>
      <CenterLogos/>
      <Links/>
    </main>
  )
}