const Year: { [key: string]: string } = Object.fromEntries(
  [
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "Alumni",
    "Grad student",
    "Dropout",
    "Faculty",
  ].map((x) => [x, x])
);

const RoleType: { [key: string]: string } = {
  eng: "Software Engineering",
  ai: "AI/ML Engineering",
  hw: "Hardware Engineering",
  ds: "Data Science",
  des: "UX/UI Design",
  bus: "Business",
  mk: "Marketing",
  sa: "Sales",
  gro: "Growth",
  pm: "Product Management",
};

const Interest: { [key: string]: string } = {
  sus: "Sustainability",
  fin: "Fintech",
  cr: "Crypto",
  tr: "Transportation",
  ai: "Artificial Intelligence",
  ec: "E-commerce",
  bio: "Biotech",
  edu: "Education",
  con: "Consumer",
  b2b: "Business-to-business (B2B)",
};

// Consider using slugs here...need a good way to make these
const FieldOfStudy: { [key: string]: string } = Object.fromEntries(
  [
    "Actuarial Mathematics",
    "Aerospace Engineering",
    "Afroamerican and African Studies",
    "American Culture",
    "Anthropology",
    "Applied Exercise Science",
    "Architecture",
    "Art and Design",
    "Arts and Ideas in the Humanities",
    "Asian Studies",
    "Astronomy and Astrophysics",
    "Biochemistry",
    "Biology",
    "Biology, Health, and Society",
    "Biomedical Engineering",
    "Biomolecular Science",
    "Biophysics",
    "Biopsychology, Cognition, and Neuroscience",
    "Business",
    "Cellular and Molecular Biomedical Science",
    "Chemical Engineering",
    "Chemical Science",
    "Chemistry",
    "Civil Engineering",
    "Classical Archaeology",
    "Classical Civilization",
    "Classical Languages and Literatures",
    "Climate and Meteorology",
    "Cognitive Science",
    "Communication and Media",
    "Community and Global Public Health",
    "Comparative Culture and Identity",
    "Comparative Literature",
    "Composition",
    "Computer Engineering",
    "Computer Science",
    "Creative Writing and Literature",
    "Dance",
    "Data Science",
    "Dental Hygiene",
    "Drama",
    "Earth and Environmental Sciences",
    "Ecology, Evolution, and Biodiversity",
    "Economics",
    "Electrical Engineering",
    "Elementary Teacher Education",
    "Engineering Physics",
    "English",
    "Environment",
    "Environmental Engineering",
    "Ethnic Studies",
    "Evolutionary Anthropology",
    "Film, Television, and Media",
    "French and Francophone Studies",
    "Gender and Health",
    "General Studies",
    "German",
    "Global Environment and Health",
    "Greek (Ancient) Language and Literature",
    "Greek (Modern) Language and Culture",
    "History",
    "History of Art",
    "Industrial and Operations Engineering",
    "Informatics",
    "Information",
    "Interarts Performance",
    "Interdisciplinary Astronomy",
    "Interdisciplinary Chemical Sciences",
    "Interdisciplinary Physics",
    "International Security, Norms, and Cooperation",
    "International Studies",
    "Italian",
    "Jazz & Contemporary Improvisation",
    "Judaic Studies",
    "Latin American and Caribbean Studies",
    "Latin Language and Literature",
    "Latina/Latino Studies",
    "Linguistics",
    "Materials Science and Engineering",
    "Mathematical Sciences",
    "Mathematics",
    "Mathematics of Finance and Risk Management",
    "Mechanical Engineering",
    "Microbiology",
    "Middle East Studies",
    "Middle Eastern and North African Studies",
    "Molecular, Cellular, and Developmental Biology",
    "Movement Science",
    "Music",
    "Music Education",
    "Music Theory",
    "Musical Theatre",
    "Musicology",
    "Naval Architecture and Marine Engineering",
    "Neuroscience",
    "Nuclear Engineering and Radiological Sciences",
    "Nursing",
    "Organ",
    "Organizational Studies",
    "Performing Arts Technology",
    "Pharmaceutical Sciences",
    "Philosophy",
    "Philosophy, Politics, and Economics",
    "Physics",
    "Piano",
    "Plant Biology",
    "Polish",
    "Political Economy and Development",
    "Political Science",
    "Psychology",
    "Public Health Sciences",
    "Public Policy",
    "Pure Mathematics",
    "Romance Languages and Literatures",
    "Russian",
    "Russian, East European, and Eurasian Studies",
    "Secondary Teacher Education",
    "Social Theory and Practice",
    "Sociology",
    "Space and Science Engineering",
    "Spanish",
    "Sport Management",
    "Statistics",
    "Strings",
    "Structural Biology",
    "Theatre & Drama",
    "Program",
    "Undecided",
    "Urban Technology",
    "Voice",
    "Winds and Percussion",
    "Women's and Gender Studies",
  ].map((x) => [x, x])
);

export { Year, RoleType, Interest, FieldOfStudy };
