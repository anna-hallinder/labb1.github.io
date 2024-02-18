// funktionen som hämtar och visar skämt
function fetchJoke() {
  fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById("jokeText").textContent = data.joke;
  })
  .catch(error => console.error("Error:", error));
}

// Bind funktionen till "click"-eventet för knappen när sidan är redo
document.addEventListener('DOMContentLoaded', () => {
  const jokeButton = document.getElementById("getJoke");
  if (jokeButton) {
    jokeButton.addEventListener("click", fetchJoke);
  }
});
