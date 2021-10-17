import React from 'react';
import { render } from '@testing-library/react';
import MovieDetails from '../components/movie-details';

// Snapshot testy komponentów sprawdzają czy będą one wyglądać tak, jak tego oczekujemy. W szczególności pozwalają na zobaczenie, jak wygląd tego komponentu będzie się zmieniał pod wpływem różnego rodzaju propsów do niego przekazywanych. Dodatkowo, jeśli używamy jakiegoś z narzędzi, które bazuje na ustawianiu styli inline, możemy również walidować ich poprawność (skąd już bardzo blisku do visual regression testing). Nie testują one jednak zachowania komponentu, np. wykonania odpowiednej akcji po kliknięciu. 

const selectedMovie = {
    id: 1,
    title: 'some title',
    description: 'some description',
    avg_rating: 3,
    no_of_ratings: 2,
}

describe('Movie details component', () => {
    test('should match snapshot', () => {
        const { container } = render(<MovieDetails movie={selectedMovie}/>);
       expect(container).toMatchSnapshot();
    }); 
});