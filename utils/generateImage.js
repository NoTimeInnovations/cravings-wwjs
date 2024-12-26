export const generateImageUrl = (foodItem) => {
  const prompt =
    "Generate an image unique food item image should be. it should be realistic of" + foodItem;
  const width = 400;
  const height = 400;
  const seed = 344;
  const model = "flux";

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    prompt
  )}?width=${width}&height=${height}&seed=${seed}&model=${model}`;

  return imageUrl;
};

let foodItems = ['Samoosa'];

export const generateRandomFoodItem = async () => {
  const foodItemResponse = await fetch(
    `https://text.pollinations.ai/${encodeURIComponent(
      "generate a single word single item food item indian not" +
        foodItems.join(",")
    )}`
  );
  let foodItem = null;
  if (foodItemResponse.ok) {
    foodItem = await foodItemResponse.text();
  }

  foodItems.push(foodItem);

  console.log("Generated Food Item:", foodItem);
  

  return foodItem;
};
