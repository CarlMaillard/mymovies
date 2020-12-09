import React, {useState, useEffect} from 'react';
import './App.css';
import {  Nav, NavItem, Row, NavLink, Button, Container,Popover,PopoverHeader, PopoverBody,ListGroupItemText, ListGroup,ListGroupItem} from 'reactstrap';
import Movie from './components/Movie'


function App() {

const [moviesCount, setMoviesCount] = useState(0)
const [popoverOpen, setPopoverOpen] = useState(false);

const[moviesWishList,setMoviesWishList] = useState([])
const[moviesList, setMoviesList] = useState([])

const toggle = () => setPopoverOpen(!popoverOpen);




useEffect(() => {
  async function fetchData() {
    const response = await fetch('/new-movies');
    const JsonResponse = await response.json();
    console.log(JsonResponse)
    setMoviesList(JsonResponse.movies)

    const responseWish = await fetch('/wishlist-movie')
    const jsonResponseWish = await responseWish.json()
    console.log(jsonResponseWish)

    const wishlistFromDb = jsonResponseWish.movies.map((movie,i)=>{
      return {name : movie.movieName, img: movie.movieImg}
    })
    setMoviesWishList(wishlistFromDb)
    setMoviesCount(jsonResponseWish.movies.length)
  }
  fetchData()
}, []);


var handleClickAddMovie = async (name, img) => {
  setMoviesCount(moviesCount+1)
  setMoviesWishList([...moviesWishList, {name: name, img: img}])
    
  const response = await fetch('/wishlist-movie', {
  method: 'POST',
  headers: {'Content-Type':'application/x-www-form-urlencoded'},
  body: `name=${name}&img=${img}`
});

}


  
var handleClickDeleteMovie = async (name) => { 
  setMoviesCount(moviesCount-1)
  setMoviesWishList( moviesWishList.filter( e => e.name !== name) );
  
  const response = await fetch(`/wishlist-movie/${name}`, {
    method: 'DELETE',
    
  });
  }

  
var cardWish = moviesWishList.map((movie,i) => {
  return (
    <ListGroupItem>
      <ListGroupItemText onClick={() => handleClickDeleteMovie(movie.name)}>
        <img width="50%" src={movie.img}/>{movie.name}
      </ListGroupItemText>
    </ListGroupItem>
  )
})




  var movieListItems = moviesList.map(function(movie, i){
  var result = moviesWishList.find(element => element.name == movie.title);
  var isSee = false
  if(result != undefined){
    isSee = true
  }
  
  var result = movie.overview

  var str = movie.overview
  if(str.length > 80){
    result = str.slice(0, 80) +"..."
  }
 
  return <Movie handleClickDeleteMovieParent={handleClickDeleteMovie} handleClickAddMovieParent={handleClickAddMovie} movieSee={isSee} movieName={movie.title} movieDesc={result} movieImg={'https://image.tmdb.org/t/p/w500/'+movie.backdrop_path} globalRating={movie.popularity} globalCountRating={movie.vote_count} key={i}/>
  
}
)

  return (
  <div style={{backgroundColor: '#232528'}}>
    <Container>
      <Nav>
          <span className="navbar-brand">
              <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo"/>
          </span>
        <NavItem>
          <NavLink style={{color:"white"}}>Last Releases</NavLink>
        </NavItem>
        <NavItem>
          <NavLink><Button id="Popover1" type="button" color="secondary" size="sm">{moviesCount} films</Button>
            <Popover placement="bottom" isOpen={popoverOpen} target="Popover1" toggle={toggle}>
              <PopoverHeader>Wish list</PopoverHeader>
              <PopoverBody>
              <ListGroup>
               {cardWish}
              </ListGroup>
              </PopoverBody>
            </Popover>
          </NavLink>
        </NavItem>
      </Nav> 
    </Container>

    <Row>
        {movieListItems}
    </Row>
  
  </div>
  );
}

export default App;
