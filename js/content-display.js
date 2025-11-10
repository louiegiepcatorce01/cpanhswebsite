// Content Display System

// Load and display updates
function loadUpdates() {
    const content = window.cmsSystem.getContent();
    const updatesContainer = document.getElementById('schoolUpdates');
    
    if (!updatesContainer) return;
    
    updatesContainer.innerHTML = content.updates.map(update => `
        <article class="update-card">
            ${update.image ? `<img src="${update.image}" alt="${update.title}">` : ''}
            <div class="update-content">
                <h3>${update.title}</h3>
                <div class="update-date">${new Date(update.date).toLocaleDateString()}</div>
                <div class="update-body">${update.content}</div>
            </div>
        </article>
    `).join('');
}

// Load and display events
function loadEvents() {
    const content = window.cmsSystem.getContent();
    const upcomingContainer = document.querySelector('.upcoming-events .event-list');
    const pastContainer = document.querySelector('.past-events .event-list');
    
    if (!upcomingContainer || !pastContainer) return;
    
    const now = new Date();
    const events = content.events.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const [upcoming, past] = events.reduce((result, event) => {
        const eventDate = new Date(event.date);
        const eventHtml = `
            <div class="event-item">
                ${event.image ? `<img src="${event.image}" alt="${event.title}">` : ''}
                <div class="event-content">
                    <h4>${event.title}</h4>
                    <p class="event-date">Date: ${eventDate.toLocaleDateString()}</p>
                    <p class="event-description">${event.description}</p>
                </div>
            </div>
        `;
        
        if (eventDate >= now) {
            result[0].push(eventHtml);
        } else {
            result[1].push(eventHtml);
        }
        return result;
    }, [[], []]);
    
    upcomingContainer.innerHTML = upcoming.length ? upcoming.join('') :
        '<div class="event-item"><p>No upcoming events scheduled.</p></div>';
    
    pastContainer.innerHTML = past.length ? past.join('') :
        '<div class="event-item"><p>No past events to display.</p></div>';
}

// Initialize content loading
function initializeContent() {
    window.cmsSystem.initialize();
    
    // Load content based on current page
    const pagePath = window.location.pathname;
    if (pagePath.includes('updates.html')) {
        loadUpdates();
    } else if (pagePath.includes('events.html')) {
        loadEvents();
    }
}

// Listen for content updates
window.addEventListener('contentUpdated', function(e) {
    const pagePath = window.location.pathname;
    if (pagePath.includes('updates.html')) {
        loadUpdates();
    } else if (pagePath.includes('events.html')) {
        loadEvents();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeContent);