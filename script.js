const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const mealContainer = document.getElementById("mealContainer");
const mealDetailsModal = document.getElementById("mealDetailsModal");
const modalBody = document.getElementById("modalBody");
const closeButton = document.querySelector(".close-button");

searchBtn.addEventListener("click", () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMeals(searchTerm);
  } else {
    alert("Please enter the name of a food.");
  }
});

mealContainer.addEventListener("click", (e) => {
  const mealCard = e.target.closest(".meal-card");
  if (mealCard) {
    const mealId = mealCard.dataset.id;
    fetchMealDetails(mealId);
  }
});

closeButton.addEventListener("click", () => {
  mealDetailsModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === mealDetailsModal) {
    mealDetailsModal.style.display = "none";
  }
});

const fetchMeals = async (searchTerm) => {
  mealContainer.innerHTML = "";
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`
    );
    const data = await response.json();

    if (data.meals) {
      displayMeals(data.meals);
    } else {
      mealContainer.innerHTML = '<p class="not-found">No food found.</p>';
    }
  } catch (error) {
    console.error("There was a problem fetching meals:", error);
    mealContainer.innerHTML =
      '<p class="not-found">There was a problem fetching meals.</p>';
  }
};

const displayMeals = (meals) => {
  meals.forEach((meal) => {
    const mealCard = document.createElement("div");
    mealCard.classList.add("meal-card");
    mealCard.dataset.id = meal.idMeal;
    mealCard.innerHTML = `
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
    `;
    mealContainer.appendChild(mealCard);
  });
};

const fetchMealDetails = async (mealId) => {
  modalBody.innerHTML = "Loading...";
  mealDetailsModal.style.display = "flex";

  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await response.json();
    if (data.meals && data.meals.length > 0) {
      displayMealDetails(data.meals[0]);
    } else {
      modalBody.innerHTML = "<p>Details not found.</p>";
    }
  } catch (error) {
    console.error("Problem fetching meal details:", error);
    modalBody.innerHTML = "<p>Could not load meal details.</p>";
  }
};

const displayMealDetails = (meal) => {
  let ingredientsHTML = "<ul>";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredientsHTML += `<li><strong>${ingredient}:</strong> ${measure}</li>`;
    }
  }
  ingredientsHTML += "</ul>";

  modalBody.innerHTML = `
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
    <h2>${meal.strMeal}</h2>
    <h4>Category: ${meal.strCategory}</h4>
    ${meal.strArea ? `<h4>Area: ${meal.strArea}</h4>` : ""}
    <h4>Ingredients:</h4>
    ${ingredientsHTML}
    <h4>Instructions:</h4>
    <p>${meal.strInstructions}</p>
    ${
      meal.strYoutube
        ? `<a href="${meal.strYoutube}" target="_blank">▶ Watch on YouTube</a>`
        : ""
    }
  `;
};
