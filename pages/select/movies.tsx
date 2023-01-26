import { useRouter } from 'next/router';
import { FormEventHandler, useEffect, useState } from 'react';
import Image from 'next/image'
import styles from '../../styles/movies.module.css'
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
interface SelectedMovie {
    id: number,
    title: string,
    posterPath: string,
    overview: string
}


const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;


export default function MoviesSelect(props: any) {
    const [formInputData, setFormInputData] = useState('');
    const [popularMovies, setPopularMovies] = useState<[]>([]);
    const [resultMovies, setResultMovies] = useState<[]>([]);
    const [favMovies, setFaveMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [selectedMovies, setSelectedMovies] = useState<SelectedMovie[]>([])
    const [nextCategory, setNextCategory] = useState<string>('')
    useEffect(() => {

        const savedCategories = localStorage.getItem("categories")
        let categories: string[] = [];
        if (typeof savedCategories === 'string') categories = JSON.parse(savedCategories);
        console.log(categories)

        categories = categories.slice(1, categories.length)
        console.log('categories after removing first idx: ', categories);
        setNextCategory(categories[0]);
        console.log('next category = ' + nextCategory);
        window.localStorage.setItem('categories', JSON.stringify(categories))
    }, [])

    useEffect(() => {
        const url: string = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
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
        if (formInputData === undefined) return;
        console.log('use Effect for input triggered')
        const url = `https://api.themoviedb.org/3/search/movie?query=${formInputData}&api_key=${API_KEY}&page=1`
        console.log(formInputData)

        const getFormQuery = setTimeout(() => {
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    if (isFetching) {
                        setIsFetching(!isFetching)
                        console.log(data)
                        setFormInputData(data.results);
                        setPopularMovies(data.results);
                        console.log(popularMovies)
                    }
                })
        }, 100)

        return (() => {
            clearTimeout(getFormQuery)
            setIsFetching(!isFetching)
        })

    }, [formInputData])


    const router = useRouter()



    const handleFormChange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        console.log(target.value)
        setFormInputData(target.value)
    };

    //prevents refresh when hitting enter on form
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("refresh prevented on enter")
    };

    const addMovie = (movie: Movie) => {
        if (selectedMovies.length >= 5) return;
        console.log('add movie triggered')
        console.log(movie)
        const selection: SelectedMovie = {
            id: movie.id,
            title: movie.original_title,
            posterPath: movie.poster_path,
            overview: movie.overview
        }
        let currSelectedMovies = selectedMovies.slice();
        const isIncluded = currSelectedMovies.filter((currMovies) => movie.id === currMovies.id)

        if (isIncluded.length === 0) {

            currSelectedMovies.push(selection);
            setSelectedMovies(currSelectedMovies);
            console.log("slected movies state after add" + selectedMovies);
        }
        return;
    }
    const removeMovie = (movie: number) => {
        console.log('remove movie triggered')
        console.log(movie)
        let currSelectedMovies = selectedMovies.slice();
        currSelectedMovies = currSelectedMovies.filter((currMovie) => currMovie.id !== movie)
        setSelectedMovies(currSelectedMovies);

    }

    const Movies = (): null | JSX.Element => {
        if (popularMovies === undefined) {
            // console.log('Movies componennt boutta return null')
            return null;
        }




        let movies;
        if (popularMovies.length !== 0) {

            movies = popularMovies.map((movie: Movie, index) => {
                console.log(movie.original_title)
                const imgPath = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.poster_path}`
                return (
                    <>
                    <div key={index} className={styles.displayedMovieCell}>
                        <Image 
                            src={imgPath} 
                            alt={movie.overview} 
                            fill
                            className={styles.displayedMoviesImage} 
                            onClick={() => addMovie(movie)}
                            sizes="max-width: 200px"
                        />
                    </div>
                    
                    </>
                )
            })


        }

        return (
            <>
                {movies}
            </>
        )


    }

    const Selected = selectedMovies.map((movie: SelectedMovie, index) => {
        const imgPath = `https://image.tmdb.org/t/p/w300_and_h450_bestv2${movie.posterPath}`
        return (

            <div key={index}>
                <Image className={styles.selectedMovie} src={imgPath} alt={movie.overview} width={150} height={230} onClick={() => removeMovie(movie.id)}/>
            </div>

        )
    }
    )

    const handleNextClick = () => {
        console.log('next click triggered')
        console.log('nextCategory: ', nextCategory)
      router.push({pathname: `/select/[location]`, query : { location: nextCategory }});
    };


    return (
    <div className={styles.movies}>
        <h1 style={{marginLeft: '20px', marginTop: '10px;'}}>Movies</h1>
        {selectedMovies.length ? 
            <div className={styles.selectedMoviesContainer}>
                <h2>Selected Movies</h2>
                <h3>Click a Movie to remove it from the list</h3>
                <div className={styles.selectedMovies}>
                    {Selected}
                </div>
                {selectedMovies.length === 5 ? <button onClick={handleNextClick}>Select your next Top 5...</button> : null}
            </div> 
        : null }
        
        <form onChange={handleFormChange} onSubmit={handleFormSubmit}>
            <div className={styles.search}>
            <label htmlFor="movies">Search: </label>
            <input id='movies' type="text" placeholder="Search for your movie here..." defaultValue={formInputData} />
            </div>
        </form>
        <div className={styles.displayedMovies}>
            <Movies />
        </div>
        
    </div>
    )
}

