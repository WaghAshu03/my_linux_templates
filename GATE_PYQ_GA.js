const Analytical_Aptitude = {
  "Age Relation": 2,
  "Code Words": 5,
  "Counting Figure": 1,
  "Direction Sense": 11,
  "Family Relationship": 6,
  Inequality: 1,
  "Logical Reasoning": 40,
  "Number Relations": 3,
  "Odd One": 6,
  "Passage Reading": 5,
  "Round Table Arrangement": 6,
  "Seating Arrangement": 4,
  "Sequence Series": 12,
  "Statements Follow": 33,
};

const Quantitative_Aptitude = {
  "Absolute Value": 7,
  "Age Relation": 1,
  Algebra: 6,
  "Alligation Mixture": 3,
  Area: 3,
  "Arithmetic Series": 9,
  Average: 2,
  "Bar Graph": 17,
  Calendar: 2,
  "Cartesian Coordinates": 10,
  Circle: 5,
  "Clock Time": 10,
  Combinatory: 12,
  "Compound Interest": 5,
  "Conditional Probability": 6,
  Cones: 1,
  "Contour Plots": 4,
  "Cost Market Price": 6,
  Counting: 6,
  Cube: 2,
  "Currency Notes": 1,
  Curves: 2,
  "Data Interpretation": 4,
  Factors: 4,
  Fractions: 4,
  Functions: 18,
  Geometry: 26,
  "Graph Coloring": 1,
  Inequality: 4,
  "LCM HCF": 1,
  "Line Graph": 12,
  Lines: 1,
  Logarithms: 14,
  "Maxima Minima": 4,
  "Modular Arithmetic": 2,
  "Number Series": 10,
  "Number System": 7,
  "Number Theory": 6,
  "Numerical Computation": 14,
  Percentage: 21,
  "Permutation and Combination": 3,
  "Pie Chart": 16,
  Polynomials: 4,
  Probability: 28,
  "Probability Density Function": 1,
  "Profit Loss": 6,
  "Quadratic Equations": 11,
  "Radar Chart": 1,
  "Ratio Proportion": 26,
  "Scatter Plot": 1,
  "Seating Arrangement": 4,
  "Sequence Series": 10,
  "Set Theory": 1,
  "Speed Time Distance": 19,
  Squares: 4,
  Statistics: 9,
  "System of Equations": 1,
  "Tabular Data": 10,
  Triangles: 11,
  Trigonometry: 1,
  "Unit Digit": 2,
  "Venn Diagram": 16,
  Volume: 2,
  "Work Time": 17,
};

const Spatial_Aptitude = {
  "Assembling Pieces": 4,
  "Counting Figure": 1,
  Grouping: 1,
  "Image Rotation": 7,
  "Mirror Image": 7,
  "Paper Folding": 10,
  "Patterns In Three Dimensions": 8,
  "Patterns In Two Dimensions": 9,
};

const Verbal_Aptitude = {
  Articles: 1,
  "Comparative Forms": 7,
  "English Grammar": 12,
  "Grammatical Error": 9,
  "Incorrect Sentence Part": 5,
  "Most Appropriate Word": 110,
  "Noun Verb Adjective": 3,
  Opposite: 5,
  "Passage Reading": 56,
  "Phrasal Verb": 2,
  "Phrase Meaning": 8,
  Prepositions: 8,
  Pronouns: 4,
  "Sentence Ordering": 5,
  "Statement Sufficiency": 2,
  "Statements Follow": 2,
  Synonyms: 19,
  Tenses: 24,
  "Verbal Reasoning": 40,
  "Word Meaning": 17,
  "Word Pairs": 29,
};

const subjects = {
  Analytical_Aptitude,
  Quantitative_Aptitude,
  Spatial_Aptitude,
  // Verbal_Aptitude,
};

const topics = Object.keys(subjects);

const ceil = (n) => n - (n % 1) + (n >= 0 ? (n % 1 > 0 ? 1 : 0) : 0);
const floor = (n) => n - (n % 1) - (n >= 0 ? 0 : 1);

let total = 0;
let ratio = 1 / 5.5;
for (let i = 0; i < topics.length; i++) {
  const topic = topics[i];

  const topic_data = subjects[topic];
  const topic_data_keys = Object.keys(topic_data);
  const topic_data_values = Object.values(topic_data);
  let topic_total = 0;

  console.log(topic);
  for (let j = 0; j < topic_data_values.length; j++) {
    topic_total += ceil(topic_data_values[j] * ratio);
    console.log(
      "  ->",
      topic_data_keys[j],
      ceil(topic_data_values[j] * ratio),
      "of",
      topic_data_values[j]
    );
  }
  console.log("     ---------------------------");
  console.log("    ", topic, "Total:", topic_total, "\n");

  total += topic_total;
}

console.log("\n Overall TOTAL:", total);
