import styles from '../../styles/Home.module.css'

export default function Selections(props: any):JSX.Element {
    
    const selections = ['movies', 'shows', 'songs', 'artists', 'books'];
    
    const Choices = selections.map((selection, index) => {
      const name = styles[selection]
      const nameSelected = styles[selection+'Selected']
      return (<button key={index} id={selection} className={!props.selectedCategories[selection as keyof typeof props.selectedCategories] ? `${name}` : `${nameSelected}`} onClick={props.handleCategoryClick}>{selection}</button>
    )})
    
    return <>{
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to MyTop5!
        </h1>

        <p className={styles.description}>
          Select from the categories below to generate your top 5
        </p>
        <div className={styles.categoryGrid}>
          {Choices}
        </div>
      </main>
    }</>
  }