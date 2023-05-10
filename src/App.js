import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchedPokemon, setSearchedPokemon] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');

  const colours = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  const fetchPokemonList = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=50`);
      const promises = response.data.results.map(result => axios.get(result.url));
      const pokemonResponses = await Promise.all(promises);
      const pokemons = pokemonResponses.map(res => res.data);
      setPokemonList(pokemons);
      setMessage('');
    } catch (error) {
      setPokemonList([]);
      setMessage('Failed to fetch Pokemon');
    }
  };

  const fetchPokemon = async (name = '') => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setSearchedPokemon([response.data]);
      setMessage('');
    } catch (error) {
      setSearchedPokemon(null);
      setMessage('No Pokemon found with that name');
    }
  };

  useEffect(() => {
    fetchPokemonList();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    if (searchTerm !== '') {
      fetchPokemon(searchTerm);
    } else {
      setSearchedPokemon(null);
    }
  };

  // Helper function to capitalize first letter of strings
  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="container mt-3">
      <form onSubmit={handleSearch}>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search for a Pokemon..."
            onChange={event => setSearchTerm(event.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Search
          </button>
        </div>
      </form>

      {message && <div className="alert alert-warning mt-3">{message}</div>}
      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Image</th>
            <th scope="col">Name</th>
            <th scope="col">Height</th>
            <th scope="col">Weight</th>
            <th scope="col">Type</th>
          </tr>
        </thead>
        <tbody>
          {!searchedPokemon && pokemonList.map(pokemon => (
            <tr key={pokemon.id} className='align-middle'>
              <td>{pokemon.id}</td>
              <td>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '100px' }} />
              </td>
              <td>{capitalizeFirstLetter(pokemon.name)}</td>
              <td>{pokemon.height}</td>
              <td>{pokemon.weight}</td>
              <td>
                {pokemon.types.map((type, index) => (
                  <span key={index} style={{
                    backgroundColor: colours[type.type.name],
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginRight: '5px',
                  }}>
                    {capitalizeFirstLetter(type.type.name)}
                  </span>
                ))}
              </td>
            </tr>
          ))}
          {searchedPokemon && searchedPokemon.map(pokemon => (
            <tr key={pokemon.id} className='align-middle'>
              <td>{pokemon.id}</td>
              <td>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} style={{ width: '100px' }} />
              </td>
              <td>{capitalizeFirstLetter(pokemon.name)}</td>
              <td>{pokemon.height}</td>
              <td>{pokemon.weight}</td>
              <td>
                {pokemon.types.map((type, index) => (
                  <span key={index} style={{
                    backgroundColor: colours[type.type.name],
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    marginRight: '5px',
                  }}>
                    {capitalizeFirstLetter(type.type.name)}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;