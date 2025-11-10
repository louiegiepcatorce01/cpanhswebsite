// Content Management System for CPANHS Website

// Initialize the content storage system
function initializeContentStorage() {
    if (!localStorage.getItem('websiteContent')) {
        const defaultContent = {
            pages: {
                home: {
                    welcome: {
                        title: "Welcome to Colonel Patrocino Artuz National High School of Tapaz Capiz!",
                        subtitle: "Empowering Minds, Shaping Futures"
                    },
                    highlights: [
                        {
                            title: "Quality Education from DEPED",
                            description: "Providing excellent education to shape tomorrow's leaders"
                        },
                        {
                            title: "Dedicated Faculty",
                            description: "Expert teachers committed to student success"
                        },
                        {
                            title: "Modern Facilities",
                            description: "State-of-the-art facilities for optimal learning"
                        }
                    ]
                },
                about: {
                    // About page content structure
                    mission: "",
                    vision: "",
                    history: ""
                },
                academics: {
                    // Academics content structure
                    programs: [],
                    curriculum: "",
                    requirements: ""
                },
                contact: {
                    // Contact information
                    address: "",
                    phone: "",
                    email: "",
                    officeHours: ""
                }
            },
            updates: [],
            events: []
        };
        
        localStorage.setItem('websiteContent', JSON.stringify(defaultContent));
    }
}

// Get all website content
function getWebsiteContent() {
    return JSON.parse(localStorage.getItem('websiteContent'));
}

// Update specific page content
function updatePageContent(pageName, content) {
    const websiteContent = getWebsiteContent();
    websiteContent.pages[pageName] = content;
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
    updateWebsiteDisplay(pageName);
}

// Add new update
function addUpdate(update) {
    const websiteContent = getWebsiteContent();
    update.id = Date.now(); // Use timestamp as ID
    update.date = new Date().toISOString();
    websiteContent.updates.unshift(update);
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
    return update;
}

// Delete update
function deleteUpdate(updateId) {
    const websiteContent = getWebsiteContent();
    websiteContent.updates = websiteContent.updates.filter(update => update.id !== Number(updateId));
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
    // Dispatch update event
    window.dispatchEvent(new CustomEvent('contentUpdated', {
        detail: {
            type: 'updates'
        }
    }));
}

// Add new event
function addEvent(event) {
    const websiteContent = getWebsiteContent();
    event.id = Date.now(); // Use timestamp as ID
    websiteContent.events.push(event);
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
    return event;
}

// Delete event
function deleteEvent(eventId) {
    const websiteContent = getWebsiteContent();
    websiteContent.events = websiteContent.events.filter(event => event.id !== eventId);
    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
}

// Update website display
function updateWebsiteDisplay(pageName) {
    const content = getWebsiteContent();
    
    // Dispatch custom event to notify page of content update
    window.dispatchEvent(new CustomEvent('contentUpdated', {
        detail: {
            pageName: pageName,
            content: content.pages[pageName]
        }
    }));
}

// Export functions
window.cmsSystem = {
    initialize: initializeContentStorage,
    getContent: getWebsiteContent,
    updatePage: updatePageContent,
    addUpdate: addUpdate,
    deleteUpdate: deleteUpdate,
    addEvent: addEvent,
    deleteEvent: deleteEvent
};