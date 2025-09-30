console.log(
  "friendship, making friends, social skills, emotional support, personal growth, introverts, trust and empathy, mental health, confidence building,"
    .split(" ")
    .map((tag) => tag.trim())
    .filter((tag) => tag)
);
