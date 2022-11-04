import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';
import Image from 'next/image'
interface Movie {
    adult: boolean,
    backdrop_path: string,
    genre_id: number[],
    id: number,
    original_language: string,
    original_title: string,
    overview: string,
    popularity: number,
    poster_path: string,
    release_date: string,
    title: string,
    video: boolean,
    vote_average: number,
    vote_count: number
}


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export default function MoviesSelect(props: any) {
    const [formInputData, setFormInputData] = useState('');
    const [popularMovies, setPopularMovies] = useState<[]>([]);
    const [resultMovies, setResultMovies] = useState<[]>([]);
    const [favMovies, setFaveMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect( () => {
        
        const savedCategories = localStorage.getItem("categories")
        let categories: string[] = [];
        if (typeof savedCategories === 'string') categories = JSON.parse(savedCategories);
        console.log(categories)
        
        categories = categories.slice(1, categories.length)
        console.log('categories after removing first idx: ', categories);
        window.localStorage.setItem('categories', JSON.stringify(categories))
    }, [])

    useEffect(() => {
        const url:string = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        const fetchData = async () => {
            const data = await fetch(url);
            const json = await data.json();
            setPopularMovies(json.results);
            console.log('the data from the fetch: ', json);
            console.log('popular movies in async use effect: ', popularMovies)
        }
        fetchData()
        .catch(console.error)
        return (() => {
            console.log('popular movies on update: ', popularMovies)
        })
    }, [])

    useEffect(() => {
        const url = `https://api.themoviedb.org/3/search/movie?query=${formInputData}&api_key=${API_KEY}&page=1`
        console.log(formInputData)
        
        const getFormQuery = setTimeout(() => {
            fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.length !== 0){

                    console.log(data)
                    setFormInputData(data.results);
                    setPopularMovies(data.results);
                    console.log(popularMovies)
                }
            })
        }, 2000)
        
        return (() => {
            clearTimeout(getFormQuery)
        })
       
    }, [formInputData])

    
    const router = useRouter()

    

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        console.log(target.value)
        setFormInputData(target.value)
    }
    const getPopularMovies = async () => {
        
        const url:string = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
        const res = await fetch(url);
        const data = await res.json();
        return data;
        
    }
   
    
    const Movies = ():null | JSX.Element => {
        if (popularMovies.length === 0) {
          // console.log('Movies componennt boutta return null')
          return null;
        }
        console.log('here da pop movies dawg', popularMovies)
        let movies;
        if (popularMovies.length !== 0){
            console.log('popular movies in movies function: ', popularMovies)
             movies = popularMovies.map((movie:Movie, index) =>{ 
                console.log(movie.original_title)
                const imgPath = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`
                return (

                    <div key={index}>
                        <Image src={imgPath} alt={movie.overview} width={300} height={450}/>
                    </div>
             )})
                
             
        }
        
        return (
            <>
            <h1>Hallo!</h1>
            {movies}
            </>
        )

        
    } 
        
    
   
    
  return(
    <>
    <h1>Movies</h1>
    <form onChange={handleFormSubmit}>
        <label htmlFor="movies">Search</label>
        <input id='movies' type="text" placeholder="Type your movie here..." defaultValue={formInputData}/>
    </form>
    <Movies/>
    </>
  )
}