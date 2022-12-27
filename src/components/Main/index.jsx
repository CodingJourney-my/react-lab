import classes from 'src/styles/Home.module.css'
import { Links } from 'src/components/Links'
import { Headline } from 'src/components/Headline'
import { CenterLogos } from 'src/components/CenterLogos'

export default function Main() {
  return (
    <main className={classes.main}>
      <Headline/>
      <CenterLogos/>
      <Links/>
    </main>
  )
}