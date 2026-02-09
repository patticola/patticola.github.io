// Single data object representing what an API might return
const siteData = {
  owner: "Patti Kolo",
  links: [
    {label: "About", href: "#about"},
    {label: "Resume", href: "#resume"},
    {label: "Contact", href: "#contact"}
  ],
  projects: [
    {
      id: "p1",
      title: "Yacht Or Nyacht? (redux)",
      date: "2023 - Present",
      sources: [
				{"label": "Live","link": "https://yachtornyacht.com"},
        {"label": "Src", "link":"https://github.com/yon-dev/yon-dev.github.io"}
			],
      description: "Overhauled and redesigned the YachtOrNyacht.com site with a focus on performance and ease-of-use. Replaced bloated and difficult to use backend API with a single-page site populated by a local JSON data file that anyone can easily update with new Song objects via GitHub. The new site continues to serve as a trusted resource for fans of the Yacht Rock genre.",
      technologies: ["HTML", "CSS", "JavaScript"],
      categories: ["Frontend"],
      lessons: [
        "Sometimes it's important to stop building new features and focus on core functionality. I wanted a great experience for visitors, not a complex CMS for myself.",
        "A well-structured data file can replace a full API for small projects.",

      ]
    },
    {
      id: "p2",
      title: "Yacht Or Nyacht? (original)",
      date: "2017 - 2023",
      links: [
        {"label":"Src (API)", "link":"https://github.com/yon-dev/yon-dev.github.io"},
				{"label":"Src (Frontend)", "link":"https://github.com/yon-dev/yon-dev.github.io"},
			],
      description: "Independently designed, developed, and maintain YachtOrNyacht.com, a data-driven reference site for the Yacht Rock genre, drawing thousands of weekly visitors. Created a high-performance, visually engaging platform for exploring the \"Yachtski Scale,\" with a clean and interactive design. The database included individual show pages for songs, artists, albums, and contributing performers. Endorsed by the creators of Yacht Rock and featured on HBO's Music Box series (as well as r/dataisbeautiful), the site has become a trusted resource for fans and casual listeners alike.",
      technologies: ["Ruby on Rails", "PostGreSQL", "Vue.js"],
      categories: ["Full-stack", "Web App"],
      lessons: [
        "Decoupling the front-end and back-end allowed for better separation of concerns, but it's not necessarily ideal for a solo dev project.",
        "It's costly to maintain a large database.",
        "I enjoy working with Vue.js, as far as front-end frameworks go. I Like the way components are structured.",
        "Building a site for a niche audience can still attract a large number of visitors if the content is unique and well-presented.",
      ]
    }
  ],
  // Categories and technologies are derived from projects
  get categories() {
    const cats = new Set();
    this.projects.forEach(p => p.categories.forEach(c => cats.add(c)));
    return Array.from(cats).sort();
  },
  get technologies() {
    const techs = new Set();
    this.projects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs).sort();
  }
};

// Expose for debugging in the console
window.siteData = siteData;
