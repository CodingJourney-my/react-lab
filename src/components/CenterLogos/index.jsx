import Image from 'next/image'
import styles from 'src/styles/Home.module.css'

export function CenterLogos() {
  return (
    <div className={styles.center}>
      <Image
        className={styles.logo}
        src="/next.svg"
        alt="Next.js Logo"
        width={180}
        height={37}
        priority
      />
      <div className={styles.thirteen}>
        <Image
          src="/thirteen.svg"
          alt="13"
          width={40}
          height={31}
          priority
        />
      </div>
    </div>
  )
}
