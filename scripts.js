// scripts.js — render the page from `siteData` and wire interactions

(function () {
  // Local state for filters and toggles
  const state = {
    selectedProjects: new Set(),
    selectedCategories: new Set(),
    selectedTechnologies: new Set()
  };

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
    renderFooter(owner);

    document.getElementById('year').textContent = new Date().getFullYear();
    document.getElementById('owner').textContent = owner;
  }

  // Header
  function renderHeader(owner) {
    const header = document.getElementById('site-header');
    header.innerHTML = '';
    const title = el('div', { class: 'site-title' }, owner);
    header.appendChild(title);
  }

  // Subheader with links
  function renderSubheader(links = []) {
    const sub = document.getElementById('site-subheader');
    sub.innerHTML = '';
    const nav = el('nav', { class: 'subnav' });
    links.forEach(link => {
      const a = el('a', { href: link.href }, link.label);
      nav.appendChild(a);
    });
    sub.appendChild(nav);
  }

  // Sidebar: projects, categories, technologies
  function renderSidebar(data) {
    const sidebar = document.getElementById('site-sidebar');
    sidebar.innerHTML = '';

    // Projects list (toggle-on/off)
    const projSection = el('section', { class: 'side-section' });
    projSection.appendChild(el('h3', {}, 'Projects'));
    const projList = el('ul', { class: 'side-list projects' });
    data.projects.forEach(p => {
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

    const filtered = data.projects.filter(p => {
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

    card.appendChild(el('p', { class: 'project-desc' }, p.description));

    const meta = el('div', { class: 'project-meta' });
    meta.appendChild(el('div', { class: 'meta-group' }, el('strong', {}, 'Technologies: '), el('span', {}, p.technologies.join(', '))));
    meta.appendChild(el('div', { class: 'meta-group' }, el('strong', {}, 'Categories: '), el('span', {}, p.categories.join(', '))));
    card.appendChild(meta);

    if (p.lessons && p.lessons.length) {
      const lessons = el('ul', { class: 'lessons' });
      p.lessons.forEach(l => lessons.appendChild(el('li', {}, l)));
      card.appendChild(el('div', { class: 'lessons-wrap' }, el('strong', {}, 'Lessons:'), lessons));
    }

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
  function toggleProject(id) {
    const allSelected = state.selectedProjects.size === siteData.projects.length &&
                        state.selectedCategories.size === 0 &&
                        state.selectedTechnologies.size === 0;
    if (allSelected) {
      // First click: deselect all, select only this one
      state.selectedProjects.clear();
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
      state.selectedProjects.add(id);
      // Add its categories and technologies
      const proj = siteData.projects.find(p => p.id === id);
      if (proj) {
        proj.categories.forEach(c => state.selectedCategories.add(c));
        proj.technologies.forEach(t => state.selectedTechnologies.add(t));
      }
    } else {
      // Normal toggle
      if (state.selectedProjects.has(id)) {
        state.selectedProjects.delete(id);
        // Remove categories/techs that no other selected project has
        const remaining = getCategoriesFromProjects(state.selectedProjects);
        state.selectedCategories = new Set([...state.selectedCategories].filter(c => remaining.has(c)));
        const remainingTechs = getTechnologiesFromProjects(state.selectedProjects);
        state.selectedTechnologies = new Set([...state.selectedTechnologies].filter(t => remainingTechs.has(t)));
      } else {
        state.selectedProjects.add(id);
        // Add its categories and technologies
        const proj = siteData.projects.find(p => p.id === id);
        if (proj) {
          proj.categories.forEach(c => state.selectedCategories.add(c));
          proj.technologies.forEach(t => state.selectedTechnologies.add(t));
        }
      }
    }
    refreshSidebarUI();
    renderMain(siteData);
  }

  function toggleCategory(cat) {
    const allSelected = state.selectedProjects.size === siteData.projects.length &&
                        state.selectedCategories.size === 0 &&
                        state.selectedTechnologies.size === 0;
    if (allSelected) {
      // First click: deselect all, select only projects with this category
      const projsWithCat = getProjectsByCategory(cat);
      state.selectedProjects.clear();
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
      state.selectedCategories.add(cat);
      // Add all projects and techs that have this category
      projsWithCat.forEach(id => state.selectedProjects.add(id));
      const techs = getTechnologiesFromProjects(projsWithCat);
      techs.forEach(t => state.selectedTechnologies.add(t));
    } else {
      // Normal toggle
      if (state.selectedCategories.has(cat)) {
        state.selectedCategories.delete(cat);
        // Remove projects and techs that only belonged to this category
        const projsWithCat = getProjectsByCategory(cat);
        const remaining = getCategoriesFromProjects(state.selectedProjects);
        state.selectedProjects = new Set([...state.selectedProjects].filter(id => {
          const proj = siteData.projects.find(p => p.id === id);
          return proj && proj.categories.some(c => remaining.has(c));
        }));
        const remainingTechs = getTechnologiesFromProjects(state.selectedProjects);
        state.selectedTechnologies = new Set([...state.selectedTechnologies].filter(t => remainingTechs.has(t)));
      } else {
        state.selectedCategories.add(cat);
        // Add all projects and techs with this category
        const projsWithCat = getProjectsByCategory(cat);
        projsWithCat.forEach(id => state.selectedProjects.add(id));
        const techs = getTechnologiesFromProjects(state.selectedProjects);
        techs.forEach(t => state.selectedTechnologies.add(t));
      }
    }
    refreshSidebarUI();
    renderMain(siteData);
  }

  function toggleTechnology(tech) {
    const allSelected = state.selectedProjects.size === siteData.projects.length &&
                        state.selectedCategories.size === 0 &&
                        state.selectedTechnologies.size === 0;
    if (allSelected) {
      // First click: deselect all, select only projects with this tech
      const projsWithTech = getProjectsByTechnology(tech);
      state.selectedProjects.clear();
      state.selectedCategories.clear();
      state.selectedTechnologies.clear();
      state.selectedTechnologies.add(tech);
      // Add all projects and categories that have this tech
      projsWithTech.forEach(id => state.selectedProjects.add(id));
      const cats = getCategoriesFromProjects(projsWithTech);
      cats.forEach(c => state.selectedCategories.add(c));
    } else {
      // Normal toggle
      if (state.selectedTechnologies.has(tech)) {
        state.selectedTechnologies.delete(tech);
        // Remove projects and categories that only belonged to this tech
        const projsWithTech = getProjectsByTechnology(tech);
        const remaining = getCategoriesFromProjects(state.selectedProjects);
        state.selectedProjects = new Set([...state.selectedProjects].filter(id => {
          const proj = siteData.projects.find(p => p.id === id);
          return proj && proj.technologies.some(t => state.selectedTechnologies.has(t));
        }));
        const cats = getCategoriesFromProjects(state.selectedProjects);
        state.selectedCategories = new Set([...state.selectedCategories].filter(c => cats.has(c)));
      } else {
        state.selectedTechnologies.add(tech);
        // Add all projects and categories with this tech
        const projsWithTech = getProjectsByTechnology(tech);
        projsWithTech.forEach(id => state.selectedProjects.add(id));
        const cats = getCategoriesFromProjects(state.selectedProjects);
        cats.forEach(c => state.selectedCategories.add(c));
      }
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

  function renderFooter(owner) {
    // Footer content already present via year and owner placeholders
  }

  document.addEventListener('DOMContentLoaded', init);
})();
