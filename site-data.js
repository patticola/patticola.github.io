// Single data object representing what an API might return
const siteData = {
  owner: "Patti Kolo",
  phonetic: "/ˈpæ•ti ˈkoʊ•loʊ/",
  email: "patti dot messages at gmail dot com",
  abouts: 
    [
      "Patti is a software developer and artist based in Ann Arbor, Michigan. She has a passion for building creative and engaging web applications, and enjoys exploring the intersection of technology and art.",
      "With a background in both front-end and back-end development, Patti is skilled in a variety of programming languages and frameworks, and is always eager to learn new technologies.",
      "In her free time, she enjoys drawing, making and listening to music, and working on personal projects. This page, itself a work-in-progress, is a list of some of those projects, along with the lessons she learned from building them.",
    ],
  projects: [
    {
      id: "p1",
      title: "Yacht Or Nyacht? (redux)",
      date: "2023 - Present",
      sources: [
				{"label": "Live Site","link": "https://yachtornyacht.com"},
        {"label": "Source", "link":"https://github.com/yon-dev/yon-dev.github.io"}
			],
      description: [
        "After years of lagging on updates, I created this streamlined version of yachtornyacht.com with a focus on performance and ease-of-use. I replaced bloated and difficult to use Rails backend/CMS with a single-page site populated by a local JSON data file that anyone can easily update. The new site continues to serve as a trusted reference for fans of the Yacht Rock genre.",
        "Users can see the entire \"Yachtski Scale\" on one page, with dynamic filtering and sorting options. The site is built with a simple, clean design that emphasizes usability and accessibility, while still providing a visually engaging experience for visitors. By simplifying the architecture and focusing on core functionality, I was able to create a more maintainable and user-friendly platform for exploring the world of Yacht Rock.",
      ],
      technologies: ["HTML", "CSS", "JavaScript"],
      categories: ["Music", "Data Visualization"],
      lessons: [
        "Sometimes it's important to stop building new features and focus on core functionality. I wanted a good experience for visitors, not a complex, hard to use CMS for myself.",
        "Even if you set up a site with the best intentions for regular updates, it's important to consider how the architecture will support those updates in the long term. If it's too difficult or time-consuming to update, it may not happen as often as you'd like.",
        "A well-structured data file can replace a full API for small projects.",
        "GitHub can be am accessible tool for managing content and updates for a site, even for non-developers."
      ]
    },
    {
      id: "p2",
      title: "Yacht Or Nyacht? (original)",
      date: "2017 - 2023",
      links: [
        {"label":"Source (API)", "link":"https://github.com/pkolo/yon-api"},
				{"label":"Source (Frontend)", "link":"https://github.com/pkolo/yacht-or-nyacht-vue"},
			],
      description: [
        "Independently designed, developed, and maintain yachtornyacht.com, a data-driven reference site for the Yacht Rock genre, drawing thousands of weekly visitors. Created a high-performance, visually engaging platform for exploring the \"Yachtski Scale,\" with a clean and interactive design, including individual show views for songs, artists, albums, and contributing performers.",
        "The site has been officially endorsed by the creators of Yacht Rock and featured on HBO's Music Box series (as well as r/dataisbeautiful). Since its launch, it has become a trusted reference for fans and casual listeners alike.",
      ],
      technologies: ["Ruby on Rails", "PostgreSQL", "Vue.js", "Nuxt.js", "Heroku"],
      categories: ["Music", "Data Visualization"],
      lessons: [
        "Decoupling the front-end and back-end allowed for better separation of concerns (and a better dev porfolio), but was overkill for a solo dev project.",
        "It's costly to maintain a large database, both in terms of literal storage costs, and also the overhead of designing and maintaing a very complex schema.",
        "Visual app design and database design are two distinct yet highly interrelated skills. Regardless if one is working on the front-end or back-end, it's important to understand how the other side works in order to create a cohesive and effective user experience.",
        "I enjoy working with Vue.js, as far as front-end frameworks go. I Like the way components are structured coherently, and that the ecosystem is robust and well-documented.",
        "Building a site for a niche audience can still attract a large number of visitors if the content is unique and well-presented.",
        "Github Projects and Issues helped me stay organized and track progress, allowing for agile-style development."
      ]
    },
    {
      id: "p3",
      title: "Besten Dogs",
      date: "2024 - Present",
      sources: [
				{"label": "Live Site","link": "https://bestendogs.rip"},
        {"label": "Source", "link":"https://github.com/bestendogs/bestendogs.github.io"}
			],
      description: [
        "A simple gallery site for my drawings. Image assets are hosted on a CDN, and displayed in a simple, responsive three-column grid. The site itself mimics the way I prefer to display these drawings- as they're all created in the same medium (sharpie on 8.5x11 cardstock), it's fun to create a bigger picture from smaller pieces. Users can manipulate the grid by clicking the images to flip them over, and also drag and drop to switch their positions. The site is built with a simple JSON data file that can be easily updated with new drawings, and the source code is open for anyone to use as a template for their own gallery site.",
        "Experimentally, the site also employs a GitHub Action that generates an RSS feed from the data file after update are pushed, which allows users to subscribe to updates when new drawings are added, without needing to check the site manually.",
      ],
      technologies: ["GitHub Actions","HTML", "CSS", "JavaScript", "CDN"],
      categories: ["Visual Art"],
      lessons: [
        "Github actions are powerful enough to replace the side-effecty callbacks of a backend server for simple projects, like generating an RSS feed from a data file.",
        "Asset optimization is an important thing to consider in the user experience, especially in the age of limited mobile data plans. I still need to update the site with proper thumbnail images, and loading images as the user scrolls.",
        "A simple, clean design can be more effective than a complex one, especially for a gallery site where the focus should be on the artwork itself.",
        "I wanted to start very small with this project, to see how it would grow organically over time. I expect to add more features and functionality as I continue to develop the site.",
      ]
    },
    {
      id: "p4",
      title: "TDX Override Chrome Extension",
      date: "2025 - Present",
      sources: [
        {"label": "Source", "link":"https://github.com/pattiko-um/tdx-override-chrome"}
			],
      description: [
        "Following an unpopular update to TDX (the ticketing and asset management system used LSA-IT), I created this plugin to to restore some of the previous functionality around how internal links open, and allow users to choose various color themes, improving usability and accessibility for the LSA-IT staff who rely on TDX for their daily work. The extension is open source, and has been well-received by users who appreciate the improved experience."
      ],
      technologies: ["HTML", "CSS", "JavaScript"],
      categories: ["Utility"],
      lessons: [
        "It's satisfying to build something that directly benefits a specific group of users, even if it's not a large audience.",
        "When forces outside of your control negatively impact your user experience, it's empowering to take matters into your own hands and create a solution that works for you and others in the same situation.",
        "Users need options to customize their experience, especially when it comes to accessibility. Providing different color themes can make a big difference for users with visual impairments or preferences.",
      ]
    },
    {
      id: "p5",
      title: "Patti-Fi",
      date: "2026 - Present",
      sources: [],
      description: [
        "A self-hosted music streaming server built with Navidrome, running on a Raspberry Pi with an Nginx reverse proxy. The server is accessible from anywhere, allowing me to stream my music collection on the go. I set up a custom domain and SSL certificate for secure access, and configured the server to automatically update my music library when new files are added. The project has been a fun way to learn about self-hosting and server management, and has provided a convenient way to access my music collection from anywhere.",
        "I've mostly implemented Navidrome as-is, but I added some style and functionality improvements on top of the default view for shared playlists, which I use to share music with friends and family."
      ],
      technologies: ["Nginx", "Docker","HTML", "CSS", "JavaScript", "PostgreSQL"],
      categories: ["Music", "Self-Hosting"],
      lessons: [
        "Self-hosting is easy, especially in the Docker era, and everyone should try it. It's a great way to learn about how the web works, and can provide a lot of benefits in terms of privacy, control, and customization.",
        "Navidrome is a great option for self-hosted music streaming- it's lightweight, easy to set up, and utilizes the popular Subsonic API, which allows for easy integration with other music players and services.",
        "I get a lot of satisfaction knowing that my friends around the world are connected to the tiny computer in my closet, streaming music from my personal collection. It's a fun way to share music and connect with others, even if we're not in the same physical location."
      ]
    },
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
