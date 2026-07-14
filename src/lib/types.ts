export type Profile = {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  summary: string;
  experience: string;
  education: string;
  skills: string;
};

export type GenerateRequest = {
  profile: Profile;
  jobDescription: string;
  jobTitle: string;
  company: string;
  prompt: string;
};

export type GeneratedDocuments = {
  resume: string;
  coverLetter: string;
  mode: "llm" | "mock";
};

export const emptyProfile: Profile = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  experience: "",
  education: "",
  skills: "",
};
