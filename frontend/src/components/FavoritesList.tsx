import React from 'react';
import { Favorite } from '../types/weathertypes';

interface FavoritesListProps {
  favorites: Favorite[];
  setFavorites: React.Dispatch<React.SetStateAction<Favorite[]>>;
  onSelectLocation: (city: string, state: string) => void;
  onDelete: (id: string) => Promise<void>;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, 
  onSelectLocation, 
  onDelete  }) => {

  return (
    <div className="favorites-list">
      {favorites.length === 0 ? (
        <div className='alert alert-warning text-start'>Sorry. No records found.</div>
      ) : (
        <table className='table'>
        <thead>
          <tr>
            <th>#</th>
            <th className='text-start'>City</th>
            <th className='text-start'>State</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {favorites.map((favorite, index) => (
            <tr key={favorite._id}>
              <td>{index + 1}</td>
              <td className='text-start'><button className="btn btn-link text-start p-0" onClick={() => onSelectLocation(favorite.city, favorite.state)}>{favorite.city}</button></td>
              <td className='text-start'><button className="btn btn-link text-start p-0" onClick={() => onSelectLocation(favorite.city, favorite.state)}>{favorite.state}</button></td>
              <td>
                
                  <i className="bi bi-trash" onClick={() => onDelete(favorite._id)} style={{cursor: "pointer"}}></i>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
};

export default FavoritesList;