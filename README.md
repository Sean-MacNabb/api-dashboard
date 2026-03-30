# JavaScript API Dashboard

An interactive web dashboard that integrates multiple public APIs into a single, responsive interface. This project demonstrates real-time data fetching, dynamic UI updates, and clean component-based layout using vanilla JavaScript.

## Overview
This dashboard connects to 8 different APIs and displays their data through user-friendly components. Each section is designed to handle user input, fetch external data asynchronously, and render structured results dynamically.

![JavaScript API Dashboard](screenshots/api-dashboard.png)

The application emphasizes:
- Asynchronous programming with fetch and async/await
- Dynamic DOM manipulation
- Responsive layout using CSS Grid and Flexbox
- Clean separation of logic and UI

The interface is built as a grid of independent API cards, each functioning as its own mini application.

# Features
## Features

### API Gallery

<table>
  <tr>
    <td align="center">
      <img src="screenshots/dog-api.png" width="220"><br>
      <b>HTTP Status Dogs</b>
    </td>
    <td align="center">
      <img src="screenshots/dictionary-api.png" width="220"><br>
      <b>Dictionary</b>
    </td>
    <td align="center">
      <img src="screenshots/weather-api.png" width="220"><br>
      <b>Weather</b>
    </td>
    <td align="center">
      <img src="screenshots/currency-api.png" width="220"><br>
      <b>Currency</b>
    </td>
  </tr>

  <tr>
    <td align="center">
      <img src="screenshots/useless-fact-api.png" width="220"><br>
      <b>Random Fact</b>
    </td>
    <td align="center">
      <img src="screenshots/trivia-api.png" width="220"><br>
      <b>Trivia</b>
    </td>
    <td align="center">
      <img src="screenshots/pokemon-api.png" width="220"><br>
      <b>Pokémon</b>
    </td>
    <td align="center">
      <img src="screenshots/quote-api.png" width="220"><br>
      <b>Quotes</b>
    </td>
  </tr>
</table>

## Tech Stack
- HTML5
- CSS3 (Grid, Flexbox, responsive design)
- JavaScript (ES6+)
- Public APIs (Open-Meteo, OpenTDB, PokéAPI, DictionaryAPI, Frankfurter, etc.)

## Key Concepts Demonstrated
- Asynchronous data fetching with async/await
- Dynamic DOM creation and manipulation
- Event-driven programming
- Input validation and error handling
- Conditional API query construction (unit selection)
- Reusable helper functions (HTML decoding, array shuffling, data formatting)
- Responsive UI patterns using CSS Grid

## How to Run
1. Clone the repository
2. Open index.html in your browser

## Future Improvements
- Add loading states and animations
- Improve accessibility (ARIA roles, keyboard navigation)
- Implement custom UI components (dropdowns, toggles)
- Expand API integrations
- Add persistent state or user preferences

## Why I Built This
This project was built to strengthen my understanding of working with external APIs, handling asynchronous data, and building interactive user interfaces using vanilla JavaScript. It allowed me to practice structuring scalable front-end logic without relying on frameworks.