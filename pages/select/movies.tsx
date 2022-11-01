import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';

export default function MoviesSelect(props: any) {
    const [formInputData, setFormInputData] = useState('');
    useEffect(() => {
        const savedCategories = localStorage.getItem("categories")
        let categories: string[] = [];
        if (typeof savedCategories === 'string') categories = JSON.parse(savedCategories);
        console.log(categories)
        
        categories = categories.slice(1, categories.length)
        console.log('categories after removing first idx: ', categories);
        window.localStorage.setItem('categories', JSON.stringify(categories))
        

    }, [])
    const router = useRouter()

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        console.log(target.value)
        setFormInputData(target.value)
    }
   
    
  return(
    <>
    <h1>Movies</h1>
    <form onChange={handleFormSubmit}>
        <label htmlFor="movies">Search</label>
        <input id='movies' type="text" placeholder="Type your movie here..." value={formInputData}/>
    </form>
    </>
  )
}