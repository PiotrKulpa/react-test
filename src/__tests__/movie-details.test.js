import React from "react";
import { render , fireEvent } from "@testing-library/react";
import MovieDetails from "../components/movie-details";

// Snapshot testy komponentów sprawdzają czy będą one wyglądać tak, jak tego oczekujemy. W szczególności pozwalają na zobaczenie, jak wygląd tego komponentu będzie się zmieniał pod wpływem różnego rodzaju propsów do niego przekazywanych. Dodatkowo, jeśli używamy jakiegoś z narzędzi, które bazuje na ustawianiu styli inline, możemy również walidować ich poprawność (skąd już bardzo blisku do visual regression testing). Nie testują one jednak zachowania komponentu, np. wykonania odpowiednej akcji po kliknięciu.

const selectedMovie = {
  id: 1,
  title: "some title",
  description: "some description",
  avg_rating: 3,
  no_of_ratings: 2,
};

describe("Movie details component", () => {
  // snapshots
  test("should match snapshot", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    expect(container).toMatchSnapshot();
  });

  // selecting elements
  test("should display title and description", () => {
    const { queryByText } = render(<MovieDetails movie={selectedMovie} />);
    expect(queryByText(selectedMovie.title)).toBeTruthy();
    expect(queryByText(selectedMovie.description)).toBeTruthy();
  });

  test("should display color stars", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const selectedStars = container.querySelectorAll(".orange");
    expect(selectedStars.length).toBe(selectedMovie.avg_rating);
  });

  test("should display number of ratings", () => {
    const { getByTestId } = render(<MovieDetails movie={selectedMovie} />);
    expect(getByTestId("no_ratings").innerHTML).toBe(`(${selectedMovie.no_of_ratings})`);
  });

  // fire events
  test("mouseover should hightlight the stars", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const stars = container.querySelectorAll(".rate_container svg");
    stars.forEach((star, index) => {
      fireEvent.mouseOver(star);
      const selected_stars = container.querySelectorAll(".purple");
      expect(index + 1).toBe(selected_stars.length)
    })
  });

  test("mouseleave should unhightlight the stars", () => {
    const { container } = render(<MovieDetails movie={selectedMovie} />);
    const stars = container.querySelectorAll(".rate_container svg");
    stars.forEach((star, index) => {
      fireEvent.mouseOver(star);
      fireEvent.mouseOut(star);
      const selected_stars = container.querySelectorAll(".purple");
      expect(selected_stars.length).toBe(0)
    })
  });

  test("click stars should trigger rating function to update", () => {
    const loadMovie = jest.fn(); // mock some function
    const { container } = render(<MovieDetails movie={selectedMovie} updateMovie={loadMovie} />);

    const stars = container.querySelectorAll(".rate_container svg");
    stars.forEach(star => {
      fireEvent.click(star);

    });
    setTimeout(() => {
      expect(loadMovie).toBeCalledTimes(stars.length)
    });
    
  });
});
