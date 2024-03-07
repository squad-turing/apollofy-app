import './playerBar.css';
import { useEffect, useRef, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useSongContext } from '../../../context/useSongContext';
import { useUserContext } from '@/context/useUserContext';

const Play = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 58 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41.2772 29.5695L24.5662 39.7771C23.5581 40.3829 22.2444 39.6862 22.2444 38.5049L22 19.5436C22 18.3926 23.222 17.6354 24.2302 18.1806L41.1855 26.9646C42.2242 27.5098 42.2853 28.994 41.2772 29.5998V29.5695Z"
      fill="#E7C929"
    />
  </svg>
);

const Pause = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 58 58"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.7086 17H23.8762C25.3701 17 26.5848 18.2147 26.5848 19.7086V38.0268C26.5848 39.5207 25.3701 40.7354 23.8762 40.7354H23.7086C22.2147 40.7354 21 39.5207 21 38.0268V19.7226C21 18.2287 22.2147 17.014 23.7086 17.014V17Z"
      fill="#E7C929"
    />
    <path
      d="M34.8782 17H35.0457C36.5397 17 37.7544 18.2147 37.7544 19.7086V38.0268C37.7544 39.5207 36.5397 40.7354 35.0457 40.7354H34.8782C33.3843 40.7354 32.1696 39.5207 32.1696 38.0268V19.7226C32.1696 18.2287 33.3843 17.014 34.8782 17.014V17Z"
      fill="#E7C929"
    />
  </svg>
);

export function PlayerBar() {
  const user = useUserContext();
  const { isPlaying, setIsPlaying, currentSong, volume } = useSongContext();
  const fav = user.user.myFavorites.includes(currentSong.id);
  const [isFav, setIsFav] = useState(fav);
  const audioRef = useRef<HTMLAudioElement>(null);
  function handleClick() {
    setIsPlaying(!isPlaying);
  }

  function handleHeart() {
    const favs = user.user.myFavorites;
    if (isFav) {
      const index = user.user.myFavorites.indexOf(currentSong.id);
      favs.splice(index, 1);
    } else {
      favs.push(currentSong.id);
    }
    fetch(`http://localhost:3000/user/${user.user.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        myFavorites: favs,
      }),
    });
    setIsFav(!isFav);
    localStorage.setItem('user', JSON.stringify(user.user));
    console.log(user.user.myFavorites);
  }

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.url;
      audioRef.current.play();
    }
    const fav = user.user.myFavorites.includes(currentSong.id);
    setIsFav(fav);
  }, [currentSong]);

  useEffect(() => {
    const fav = user.user.myFavorites.includes(currentSong.id);
    setIsFav(fav);
  }, [user.user.myFavorites.length]);

  useEffect(() => {
    if (audioRef.current) {
      isPlaying ? audioRef.current.play() : audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <>
      <Outlet />
      {currentSong.name && (
        <section className="player-bar">
          <div className="song-info">
            <Link to={'/player'}>
              <div className="song">
                <picture>
                  <img src={currentSong.thumbnail} alt={currentSong.name} />
                </picture>
                <div>
                  <h3>{currentSong.name}</h3>
                  <p>{currentSong.artist}</p>
                </div>
              </div>
            </Link>
            <button onClick={handleHeart}>
              {isFav ? (
                <img className="heart" src="/images/heart-icon-2.svg" />
              ) : (
                <img className="heart" src="/images/heart-icon-1.svg" />
              )}
            </button>
          </div>
          <button className="player-btn" onClick={handleClick}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <audio ref={audioRef}></audio>
        </section>
      )}
    </>
  );
}
