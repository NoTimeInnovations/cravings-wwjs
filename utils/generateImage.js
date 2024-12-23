export const generateImageUrl = () => {
  const prompt =
    'Generate an image of tasty food item';
  const width = 350;
  const height = 195;
  const seed = new Date().getTime();
  const model = "flux";

  const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(
    prompt
  )}?width=${width}&height=${height}&seed=${seed}&model=${model}`;

  return imageUrl;
};
