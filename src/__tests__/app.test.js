import React from "react";
import { render, fireEvent, wait, act, screen, waitForElement, waitForElementToBeRemoved } from "@testing-library/react";
import App from "../App";

// Główne selektory
// getBy - rzuca wyjatek nie przechodzi dalej
// findBy - rzuca wyjatek nie przechodzi dalej, ponadto jest asynchroniczne
// queryBy - zwraca null, przechodzi dalej

global.fetch = require('jest-fetch-mock');

const movies = [
  {
  id: 3,
  title: "This is my first movie",
  description: "and this is longer description",
},
  {
  id: 4,
  title: "This is my second movie",
  description: "and this is longer description for second movie",
},
];

describe("App component", () => {
  test("should display loading", async() => {
    // uzyj act jesli zmienia sie stan komponentu
    // mock dla pobierania filmów
    fetch.mockResponseOnce(JSON.stringify(movies));
    // renderujemy komponent ze zmiennym stanem
    act(() => {
      render(<App />);
    });
    // sprawdzamy czy zadziałał loader
    expect(screen.getByTestId("loading")).toBeTruthy();
    await waitForElement(() => screen.getAllByTestId('list'));
    // sprawdzamy czy po załadowaniu listy loader zniknął
    expect(screen.queryByTestId("loading")).toBeFalsy();
  });

  test("should display an error", async() => {
    // wymuszamy błąd żądania
    fetch.mockResponseOnce(null, {status: 500});

    act(() => {
      render(<App />);
    });
    // w tym przypadku sprawdzamy czy loader zniknął
    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));
    // sprawdzamy czy otrzymamy błąd
    expect(screen.queryByText(/Error loading movies/i)).toBeTruthy();
  });

  test("should display a list of movies after API request", async() => {
    // wymuszamy błąd żądania
    fetch.mockResponseOnce(JSON.stringify(movies));

    act(() => {
      render(<App />);
    });
    // w tym przypadku sprawdzamy czy loader zniknął
    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));
    // sprawdzamy czy otrzymamy błąd
    const list = screen.getAllByTestId('list');
    expect(list).toBeTruthy();
  });

  test("new movie btn should be present and trigger form", async() => {
    // wymuszamy błąd żądania
    fetch.mockResponseOnce(JSON.stringify(movies));

    act(() => {
      render(<App />);
    });
    // w tym przypadku sprawdzamy czy loader zniknął
    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));
    const btn = screen.getByRole("button", {name: "New movie"});
    fireEvent.click(btn);

    await wait(() => {
      expect(screen.getByTestId('movie-form')).toBeTruthy();
    })
  });

  test("should display movie details clicked on heading", async() => {
    // wymuszamy błąd żądania
    fetch.mockResponseOnce(JSON.stringify(movies));

    act(() => {
      render(<App />);
    });
    // w tym przypadku sprawdzamy czy loader zniknął
    await waitForElementToBeRemoved(() => screen.getAllByTestId('loading'));

    // sprawdzamy jak zachowa sie aplikacja po kliknieciu w różne nagłówki
    const headings = screen.getAllByTestId("heading");
    fireEvent.click(headings[0]);
    await wait(() => {
      expect(screen.getByText(movies[0].description)).toBeTruthy();
    });
    fireEvent.click(headings[1]);
    await wait(() => {
      expect(screen.queryByText(movies[0].description)).toBeFalsy();
      expect(screen.getByText(movies[1].description)).toBeTruthy();
    });

  });

});
