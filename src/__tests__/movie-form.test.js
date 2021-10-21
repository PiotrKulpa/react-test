import React from "react";
import { render, fireEvent, wait } from "@testing-library/react";
import MovieForm from "../components/movie-form";

global.fetch = require('jest-fetch-mock');

const empty_movie = {
  title: "",
  description: "",
};


const movie = {
  id: 3,
  title: "This is my first movie",
  description: "and this is longer description",
};

describe("Movie form component", () => {
  test("should have form elements", () => {
    // wybieranie elementów po label i roli
    const { getByLabelText, getByRole } = render(<MovieForm movie={empty_movie} />);
    expect(getByLabelText(/title/i)).toBeTruthy();
    expect(getByLabelText(/description/i)).toBeTruthy();
    expect(getByRole("button", {name: /create/i})).toBeTruthy();
  });

  test("should display form elements with movie data", () => {
    const { getByLabelText, getByRole, debug } = render(<MovieForm movie={movie} />);
    // przydatne do debugowania konkretnego elementu html
    // debug(getByLabelText(/title/i));
    expect(getByLabelText(/title/i).value).toBe(movie.title);
    expect(getByLabelText(/description/i).value).toBe(movie.description);
    expect(getByRole("button", {name: /update/i})).toBeTruthy();
  });

  test("shouldn't trigger API request when form is empty", async () => {
    const updatedMovie = jest.fn();

    // bibliotek umożliwia symulację requestów
    fetch.mockImplementationOnce(JSON.stringify(empty_movie));

    const { getByRole } = render(<MovieForm movie={empty_movie} {...{updatedMovie}}/>);
    const submitButton = getByRole("button", {name: /create/i});
    fireEvent.click(submitButton);

    // wait umorzliwia testowanie asynchroniczne
    await wait(() => {
      expect(updatedMovie).toBeCalledTimes(0);
    });
    
  });
});
