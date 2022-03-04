// Eventually, can maybe replace these (and pages/profile/index:Profile)
// with DB types exported from Supabase

// Use string enum so we don't get numbers from Object.keys()
export enum Year {
  "Freshman" = "Freshman",
  "Sophomore" = "Sophomore",
  "Junior" = "Junior",
  "Senior" = "Senior",
  "Alumni" = "Alumni",
  "Grad student" = "Grad student",
  "Dropout" = "Dropout",
  "Faculty" = "Faculty",
}

export enum RoleType {
  "eng" = "Engineering",
  "ds" = "Data Science",
  "des" = "UX/UI Design",
  "bus" = "Business",
  "gro" = "Growth",
  "pm" = "Product Management",
}

export enum Interests {
  "sus" = "Sustainability",
  "fin" = "Fintech",
  "cr" = "Crypto",
  "tr" = "Transportation",
  "ai" = "Artificial Intelligence",
  "ec" = "E-commerce",
  "bio" = "Biotech",
  "edu" = "Education",
  "con" = "Consumer",
  "b2b" = "Business-to-business (B2B)",
}
