// scripts.js — render the page from `siteData` and wire interactions

(function () {
  // Local state for filters and toggles
  const state = {
    selectedProjects: new Set(),
    selectedCategories: new Set(),
    selectedTechnologies: new Set(),
    showSidebar: false // for mobile filter toggle
  };
  // Toggle showing the About content in the main area
  state.showAbout = false;

  // Utility: create an element with attrs and children
  function el(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") node.className = v;
      else if (k.startsWith("data-")) node.setAttribute(k, v);
      else if (k === "html") node.innerHTML = v;
      else node.setAttribute(k, v);
    }
    children.flat().forEach(c => {
      if (typeof c === "string") node.appendChild(document.createTextNode(c));
      else if (c instanceof Node) node.appendChild(c);
    });
    return node;
  }

  // Helper: parse start year from project.date (first 4 chars)
  function getStartYear(p) {
    if (!p || !p.date) return 0;
    const raw = String(p.date).slice(0, 4);
    const y = parseInt(raw, 10);
    return Number.isFinite(y) ? y : 0;
  }

  // Helper: return projects sorted by start year desc
  function getSortedProjects(list) {
    return (list || siteData.projects || []).slice().sort((a, b) => getStartYear(b) - getStartYear(a));
  }

  // Initialization
  function init() {
    if (!window.siteData) {
      console.error('siteData not found');
      return;
    }

    const { owner, links, projects } = siteData;

    // Default select all projects
    projects.forEach(p => state.selectedProjects.add(p.id));

    renderHeader(owner);
    renderSubheader(links);
    renderSidebar(siteData);
    renderMain(siteData);
  }

  // Header
  function renderHeader(owner) {
    const header = document.getElementById('site-header');
    header.innerHTML = '';
    const title = el('div', { class: 'site-title' }, owner);
    // Toggle about overlay when header is clicked
    title.addEventListener('click', () => {
      toggleAbout();
    });
    // reflect current about state visually
    title.classList.toggle('about-active', state.showAbout);
    header.appendChild(title);
  }

  // Subheader with links
  function renderSubheader(links = []) {
    const sub = document.getElementById('site-subheader');
    sub.innerHTML = '';
    // Render About link and phonetic/email inline on a single line
    const nav = el('nav', { class: 'subnav' });

    // Phonetic and email as plain text, inline and smaller
    if (siteData.phonetic) {
      const ph = el('span', { class: 'sub-phonetic' }, siteData.phonetic);
      nav.appendChild(ph);
    }
    if (siteData.email) {
      const em = el('span', { class: 'sub-email' }, siteData.email);
      nav.appendChild(em);
    }

    sub.appendChild(nav);
  }

  // Sidebar: projects, categories, technologies
  function renderSidebar(data) {
    const sidebar = document.getElementById('site-sidebar');
    sidebar.innerHTML = '';

    // Responsive: show/hide sidebar on small screens
    const isMobile = window.innerWidth < 825;
    if (isMobile) {
      const toggleBtn = el('a', { href: '#', class: 'sidebar-toggle' }, state.showSidebar ? 'Hide Filters' : 'Show Filters');
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        state.showSidebar = !state.showSidebar;
        renderSidebar(data);
      });
      sidebar.appendChild(toggleBtn);
      if (!state.showSidebar) return;
    }

    // Projects list (toggle-on/off)
    const projSection = el('section', { class: 'side-section' });
    projSection.appendChild(el('h3', {}, 'Projects'));
    const projList = el('ul', { class: 'side-list projects' });
    getSortedProjects(data.projects).forEach(p => {
      const li = el('li', {});
      const link = el('a', { href: '#', class: 'side-button', 'data-project': p.id }, p.title);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        toggleProject(p.id);
      });
      li.appendChild(link);
      projList.appendChild(li);
    });
    projSection.appendChild(projList);

    // Categories
    const catSection = el('section', { class: 'side-section' });
    catSection.appendChild(el('h3', {}, 'Categories'));
    const catList = el('ul', { class: 'side-list categories' });
    data.categories.forEach(c => {
      const li = el('li', {});
      const link = el('a', { href: '#', class: 'side-button', 'data-category': c }, c);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        toggleCategory(c);
      });
      li.appendChild(link);
      catList.appendChild(li);
    });
    catSection.appendChild(catList);

    // Technologies
    const techSection = el('section', { class: 'side-section' });
    techSection.appendChild(el('h3', {}, 'Technologies'));
    const techList = el('ul', { class: 'side-list technologies' });
    data.technologies.forEach(t => {
      const li = el('li', {});
      const link = el('a', { href: '#', class: 'side-button', 'data-tech': t }, t);
      link.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTechnology(t);
      });
      li.appendChild(link);
      techList.appendChild(li);
    });
    techSection.appendChild(techList);

    // Clear filters
    const clear = el('div', { class: 'side-section' });
    const clearLink = el('a', { href: '#', class: 'clear-button' }, 'Clear filters');
    clearLink.addEventListener('click', (e) => {
      e.preventDefault();
      clearFilters();
    });
    clear.appendChild(clearLink);

    sidebar.appendChild(projSection);
    sidebar.appendChild(catSection);
    sidebar.appendChild(techSection);
    sidebar.appendChild(clear);

    refreshSidebarUI();
  }

  // Main content: show filtered projects
  function renderMain(data) {
    const main = document.getElementById('site-main');
    main.innerHTML = '';

    // Ensure main can contain positioned overlay
    main.style.position = main.style.position || 'relative';

    const filtered = getSortedProjects(data.projects).filter(p => {
      // project toggled on
      if (!state.selectedProjects.has(p.id)) return false;
      // categories: if any selected categories then project must include one
      if (state.selectedCategories.size > 0) {
        const has = p.categories.some(c => state.selectedCategories.has(c));
        if (!has) return false;
      }
      // technologies: similar
      if (state.selectedTechnologies.size > 0) {
        const has = p.technologies.some(t => state.selectedTechnologies.has(t));
        if (!has) return false;
      }
      return true;
    });

    if (filtered.length === 0) {
      main.appendChild(el('p', { class: 'no-results' }, 'No projects match the current filters.'));
      return;
    }

    const grid = el('div', { class: 'projects-grid' });
    filtered.forEach(p => grid.appendChild(renderProjectCard(p)));
    main.appendChild(grid);

    // If About is toggled on, add an overlay on top of the main content
    if (state.showAbout) {
      const abouts = siteData.abouts || [];
      const overlay = el('div', { class: 'about-overlay'});
      const wrap = el('div', { class: 'about-wrap' });
      if (abouts.length === 0) {
        wrap.appendChild(el('div', { class: 'about-item' }, el('p', {}, 'No about content available.')));
      } else {
        abouts.forEach((txt, idx) => {
          const item = el('div', { class: 'about-item' }, el('p', {}, txt));
          wrap.appendChild(item);
        });
      }
      overlay.appendChild(wrap);
      main.appendChild(overlay);
    }
  }

  function renderProjectCard(p) {
    const card = el('article', { class: 'project-card', 'data-id': p.id });
    card.appendChild(el('h2', { class: 'project-title' }, p.title));

    // Date and links line
    if (p.date || (p.links && p.links.length) || (p.sources && p.sources.length)) {
      const headerLine = el('div', { class: 'project-header-line' });
      if (p.date) {
        headerLine.appendChild(el('span', { class: 'project-date' }, p.date));
      }
      const linkList = p.links || p.sources || [];
      if (linkList.length > 0) {
        const separator = el('span', {}, ' | ');
        headerLine.appendChild(separator);
        linkList.forEach((link, idx) => {
          if (idx > 0) {
            const bullet = el('span', {}, ' ◦ ');
            headerLine.appendChild(bullet);
          }
          const a = el('a', { href: link.link, class: 'project-link', target: '_blank' }, link.label);
          headerLine.appendChild(a);
        });
      }
      card.appendChild(headerLine);
    }
    
    p.description.forEach(d => card.appendChild(el('p', { class: 'project-description' }, d)));
  
    if (p.lessons && p.lessons.length) {
      const lessons = el('ul', { class: 'lessons' });
      p.lessons.forEach(l => lessons.appendChild(el('li', {}, l)));
      card.appendChild(el('div', { class: 'lessons-wrap' }, el('strong', {}, 'Lessons:'), lessons));
    }

    const meta = el('div', { class: 'project-meta' });
    meta.appendChild(el('div', { class: 'meta-group' }, el('strong', {}, 'Technologies: '), el('span', {}, p.technologies.join(', '))));
    meta.appendChild(el('div', { class: 'meta-group' }, el('strong', {}, 'Categories: '), el('span', {}, p.categories.join(', '))));
    card.appendChild(meta);

    return card;
  }

  // Helper: get all categories from selected projects
  function getCategoriesFromProjects(projectIds) {
    const cats = new Set();
    projectIds.forEach(id => {
      const proj = siteData.projects.find(p => p.id === id);
      if (proj) proj.categories.forEach(c => cats.add(c));
    });
    return cats;
  }

  // Helper: get all technologies from selected projects
  function getTechnologiesFromProjects(projectIds) {
    const techs = new Set();
    projectIds.forEach(id => {
      const proj = siteData.projects.find(p => p.id === id);
      if (proj) proj.technologies.forEach(t => techs.add(t));
    });
    return techs;
  }

  // Helper: get all projects that have a given category
  function getProjectsByCategory(cat) {
    return new Set(siteData.projects.filter(p => p.categories.includes(cat)).map(p => p.id));
  }

  // Helper: get all projects that have a given technology
  function getProjectsByTechnology(tech) {
    return new Set(siteData.projects.filter(p => p.technologies.includes(tech)).map(p => p.id));
  }

  // Toggle helpers with cascading logic
  function toggleAbout() {
    state.showAbout = !state.showAbout;
    refreshSidebarUI();
    renderSubheader(siteData.links);
    // Update header visual state (title may be re-rendered)
    const titleEl = document.querySelector('.site-title');
    if (titleEl) titleEl.classList.toggle('about-active', state.showAbout);
    renderMain(siteData);
  }
  function toggleProject(id) {
    const allSelected = state.selectedProjects.size === siteData.projects.length &&
                        state.selectedCategories.size === 0 &&
                        state.selectedTechnologies.size === 0;
    // If currently all selected or multiple selected, select only this project.
    // If this project is already the sole selection, reset to all.
    if (state.selectedProjects.size === 1 && state.selectedProjects.has(id) && !state.selectedCategories.size && !state.selectedTechnologies.size) {
      // This case shouldn't generally occur because single project selection sets cats/techs,
      // but keep symmetry: reset to all
      state.selectedProjects = new Set(siteData.projects.map(p => p.id));
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
    } else if (state.selectedProjects.size === 1 && state.selectedProjects.has(id)) {
      // If this project is already the only selected project (with cats/techs), clicking again resets to all
      state.selectedProjects = new Set(siteData.projects.map(p => p.id));
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
    } else {
      // Select only this project and its related categories/technologies
      state.selectedProjects = new Set([id]);
      state.selectedCategories = new Set();
      state.selectedTechnologies = new Set();
      const proj = siteData.projects.find(p => p.id === id);
      if (proj) {
        proj.categories.forEach(c => state.selectedCategories.add(c));
        proj.technologies.forEach(t => state.selectedTechnologies.add(t));
      }
    }
    refreshSidebarUI();
    renderMain(siteData);
  }

  function toggleCategory(cat) {
    // If this category is already the sole selected category, reset to all
    if (state.selectedCategories.size === 1 && state.selectedCategories.has(cat)) {
      state.selectedProjects = new Set(siteData.projects.map(p => p.id));
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
    } else {
      // Select only this category and its related projects and technologies
      const projsWithCat = getProjectsByCategory(cat);
      state.selectedProjects = new Set();
      projsWithCat.forEach(id => state.selectedProjects.add(id));
      state.selectedCategories = new Set([cat]);
      const techs = getTechnologiesFromProjects(projsWithCat);
      state.selectedTechnologies = new Set();
      techs.forEach(t => state.selectedTechnologies.add(t));
    }
    refreshSidebarUI();
    renderMain(siteData);
  }

  function toggleTechnology(tech) {
    // If this technology is already the sole selected technology, reset to all
    if (state.selectedTechnologies.size === 1 && state.selectedTechnologies.has(tech)) {
      state.selectedProjects = new Set(siteData.projects.map(p => p.id));
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
    } else {
      // Select only projects with this tech and their categories
      const projsWithTech = getProjectsByTechnology(tech);
      state.selectedProjects = new Set();
      projsWithTech.forEach(id => state.selectedProjects.add(id));
      state.selectedTechnologies = new Set([tech]);
      const cats = getCategoriesFromProjects(projsWithTech);
      state.selectedCategories = new Set();
      cats.forEach(c => state.selectedCategories.add(c));
    }
    refreshSidebarUI();
    renderMain(siteData);
  }

  function clearFilters() {
    state.selectedProjects = new Set(siteData.projects.map(p => p.id));
    state.selectedCategories.clear();
    state.selectedTechnologies.clear();
    refreshSidebarUI();
    renderMain(siteData);
  }

  // Visual update for sidebar links to reflect state
  function refreshSidebarUI() {
    // Projects
    document.querySelectorAll('[data-project]').forEach(link => {
      const id = link.getAttribute('data-project');
      link.classList.toggle('active', state.selectedProjects.has(id));
    });
    // Categories
    document.querySelectorAll('[data-category]').forEach(link => {
      const v = link.getAttribute('data-category');
      link.classList.toggle('active', state.selectedCategories.has(v));
    });
    // Technologies
    document.querySelectorAll('[data-tech]').forEach(link => {
      const v = link.getAttribute('data-tech');
      link.classList.toggle('active', state.selectedTechnologies.has(v));
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
