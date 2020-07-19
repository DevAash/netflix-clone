import React, {
    useState,
    useEffect
} from 'react';
import axios from './axios';
import "./Row.css"
import YouTube from 'react-youtube';
import movieTrailer from 'movie-trailer';

const baseUrl = "https://image.tmdb.org/t/p/original/";

function Row({
    title,
    fetchUrl,
    isLargeRow
}) {
    const [movies, setMovies] = useState([]);
    const[trailerUrl,setTrailerUrl] = useState("");
    useEffect(() => {
        //if [],run once when row loads and dont run again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            //console.log(request.data.results);
            setMovies(request.data.results)
            return request;
        }
        fetchData();
    }, [fetchUrl]);

    //console.table(movies)
    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
          // https://developers.google.com/youtube/player_parameters
          autoplay: 1,
        }
    };

    const handleClick=(movie)=>{
        if (trailerUrl){
            setTrailerUrl("");
        }
        else{
            movieTrailer(movie?.name ||"")
            .then(url => {
                const urlParams = new URLSearchParams(new URL(url).search);
                setTrailerUrl(urlParams.get('v'));
            })
            .catch((error)=> console.log(error));
        }
    };
    return ( <
        div className = "row" >
        <
        h2 > {title}</h2>
        <div className = "row_posters" > {
            /* container -> posters */
        } {
            movies.map(movie => ( 
            <img className = {`row_poster ${isLargeRow && "row_posterLarge"}`}
            key = {movie.id}
            onClick={() => handleClick(movie)}
            src = {`${baseUrl}${isLargeRow ? movie.poster_path:movie.backdrop_path}`}
            alt = {movie.name}/>
            ))
        } 
        </div> 
        {trailerUrl && <YouTube videoId={trailerUrl} opts={opts}></YouTube>
    }
        </div >
    )
}

export default Row