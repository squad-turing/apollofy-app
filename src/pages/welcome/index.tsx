import { useEffect, useState } from "react";
import Page from "../../components/layout/page";
import { useUserContext } from "../../context/useUserContext";
import "./welcome.css";
import { Track } from "../../utils/interfaces/track";
import { getArtist, getTracks, getUsers } from "../../utils/functions";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import { useSongContext } from "../../context/useSongContext";
import Search from "../../components/layout/search";
import { Artist } from "../../utils/interfaces/artist";
import { SquareCard } from "@/components/global/squareCard";
import { SmallCard } from "@/components/global/smallCard";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { User } from "../../utils/interfaces/user";

export function Welcome() {
  const [showSearch, setShowSearch] = useState({
    artists: [] as Artist[],
    tracks: [] as Track[],
  });
  const userContext = useUserContext();
  const { setCurrentSong, setIsPlaying } = useSongContext();
  const [tracks, setTracks] = useState([] as Track[]);
  const [artists, setArtists] = useState([] as Artist[]);
  const [users, setUsers] = useState([] as User[]);
  // const slidesPerView =
  //   userContext.user?.myFavorites.length < 3
  //     ? userContext.user?.myFavorites.length
  //     : 3.5;
  const { user: auth0User, isLoading, getAccessTokenSilently } = useAuth0();
  // console.log('🚀 ~ Welcome ~ userContext:', userContext);
  // console.log('🚀 ~ Welcome ~ user:', auth0User);

  useEffect(() => {
    async function setDataAPI() {
      const UsersAPI = await getUsers();
      setUsers(UsersAPI);
    }
    setDataAPI();
    if (auth0User) {
      userValidation();
    }
  }, [auth0User]);

  async function userValidation() {
    const foundUser = users.find((u) => {
      return u.email === auth0User?.email;
    });
    if (foundUser) {
      console.log("🚀 ~ foundUser ~ foundUser:", foundUser);
      // console.log('el usuario existe en la base de datos');
      localStorage.setItem("user", JSON.stringify(foundUser));
      userContext.setUser(foundUser);
    } else {
      console.log("el usuario no existe en la base de datos", auth0User);
      const newUser = await fetch(`http://localhost:3000/user`, {
        method: "POST",
        body: JSON.stringify({
          username: auth0User?.nickname,
          name: auth0User?.name,
          email: auth0User?.email,
          profilePicture: auth0User?.picture,
          myFavorites: [],
        }),
      });
      const newUserJSON = await newUser.json();
      localStorage.setItem("user", JSON.stringify(newUserJSON));
      userContext.setUser(newUserJSON);
      // console.log('🚀 ~ userValidation ~ newUser:', newUserJSON);
    }
  }

  useEffect(() => {
    async function setDataAPI() {
      // const { VITE_AUTH0_AUDIENCE: audience } = import.meta.env;
      // const token = await getAccessTokenSilently({
      //   authorizationParams: {
      //     audience: audience,
      //   },
      // });
      // console.log(token);
      const TracksAPI = await getTracks(getAccessTokenSilently);
      const ArtistsAPI = await getArtist(getAccessTokenSilently);
      setTracks(TracksAPI);
      setArtists(ArtistsAPI);
    }
    setDataAPI();
  }, [userContext.user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Page>
      <div className="search-container">
        <Search setShowSearch={setShowSearch} />
      </div>
      {showSearch.tracks.length === 0 && showSearch.artists.length === 0 ? (
        <>
          <h1 className="welcomeTitle">Welcome</h1>
          <h1 className="welcome-user">{`${userContext.user?.name}!`}</h1>
          <h3 className="newIn">New in this week!</h3>
          <section className="newInSection">
            {tracks
              .filter((track) => track.new)
              .slice(0, 6)
              .map((track) => {
                return (
                  <SquareCard
                    key={track.id}
                    handleClick={() => {
                      setCurrentSong(track);
                      setIsPlaying(true);
                    }}
                    src={track.thumbnail}
                    text1={track.artist}
                    text2={track.name}
                  />
                );
              })}
          </section>

          <Link to="/favourites">
            <h3 className="newIn">My favourites</h3>
          </Link>
          {/* <section className="favouriteList">
            <Swiper
              slidesPerView={slidesPerView}
              freeMode={true}
              pagination={{
                clickable: true,
              }}
            >
              {userContext.user?.myFavorites.map((track) => {
                const showSong = tracks.find((t) => {
                  return t.id === track;
                });
                return (
                  <SwiperSlide
                    key={track}
                    onClick={() => {
                      setCurrentSong(showSong);
                      setIsPlaying(true);
                    }}
                  >
                    <img className="albumFav" src={showSong?.thumbnail} />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </section> */}

          {/* FAVOURITES LIST IN LAPTOP */}
          {/* <section className="favouriteList-laptop">
            {userContext.user?.myFavorites.slice(0, 8).map((track) => {
              const showSong = tracks.find((t) => {
                return t.id === track;
              });
              return (
                <div
                  key={track}
                  onClick={() => {
                    setCurrentSong(showSong);
                    setIsPlaying(true);
                  }}
                >
                  <div className="container">
                    <img
                      className="albumFav-laptop"
                      src={showSong?.thumbnail}
                    />
                    <p className="albumFav-trackName">{showSong?.name}</p>
                  </div>
                </div>
              );
            })}
          </section> */}
        </>
      ) : (
        <section className="search-section">
          {showSearch.artists.length > 0 && (
            <>
              <h3 className="newIn">Artists</h3>
              {showSearch.artists.map((artist) => (
                <SmallCard
                  key={artist.id}
                  src={artist.photoUrl}
                  text2={artist.name}
                  class="searchContainer"
                />
              ))}
            </>
          )}
          {showSearch.tracks.length > 0 && (
            <>
              <h3 className="newIn">Tracks</h3>
              {showSearch.tracks.map((track) => (
                <SmallCard
                  key={track.id}
                  src={track.thumbnail}
                  text2={track.name}
                  handleClick={() => {
                    setCurrentSong(track);
                    setIsPlaying(true);
                  }}
                  class="searchContainer"
                />
              ))}
            </>
          )}
        </section>
      )}
      <h3 className="newIn artistsTitle">Artists</h3>
      <section className="section-artists">
        {artists.slice(0, 8).map((artist) => {
          return (
            <div key={artist.id} className="artist-card">
              <img
                className="artist-photo"
                src={artist.photoUrl}
                alt={artist.name}
              />
              <p>{artist.name}</p>
            </div>
          );
        })}
      </section>
    </Page>
  );
}
