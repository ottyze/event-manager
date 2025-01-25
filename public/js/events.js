/**
 * @typedef EngageEvent
 * @type {object}
 * @property {string} title - Title of the event
 * @property {string} guid - Event GUID Link
 * @property {string} link - Event Link
 * @property {string} image - Event background image
 * @property {string} description - Event description
 * @property {string} category - Event category
 * @property {Date} pubDate - The date the event was published
 * @property {Date} start - The date the event starts
 * @property {Date} end - The date the event ends
 * @property {string} location - The location of the event
 * @property {string} status - The status of the event
 * @property {string} author - The author of the event
 * @property {string} host - The host of the event
 */


// Create an empty array to store card contents
const cardsList = [];

// Fetch and process the RSS XML file
export async function parseEvents() {
    try {
        const response = await fetch('events.rss'); // Replace with actual file path or URL
        const str = await response.text();
        const data = (new window.DOMParser()).parseFromString(str, "text/xml");

        const items = data.querySelectorAll("item");

        items.forEach(item => {
            const title = item.querySelector('title')?.textContent || 'Untitled';
            const guid = item.querySelector('guid')?.textContent || 'No GUID';
            const link = item.querySelector('link')?.textContent || '#';
            const description = item.querySelector('description')?.textContent || 'No description available';
            const category = item.querySelector('category')?.textContent || 'Uncategorized';
            const pubDate = new Date(item.querySelector('pubDate')?.textContent || Date.now());
            const startDate = new Date(item.querySelector('start')?.textContent || Date.now());
            const endDate = new Date(item.querySelector('end')?.textContent || Date.now());
            const location = item.querySelector('location')?.textContent || 'Unknown location';
            const status = item.querySelector('status')?.textContent || 'Pending';
            const author = item.querySelector('author')?.textContent || 'Unknown author';
            const host = item.querySelector('host')?.textContent || 'No host specified';
            const image = item.querySelector('enclosure') 
                ? item.querySelector('enclosure').getAttribute('url') 
                : 'https://images.impresa.pt/sicnot/2023-03-17-escola-sala-aula.jpg-217971cb-1/original/mw-720'; // Placeholder image

            // Create an object representing the card content
            const cardContent = {
                title: title,
                guid: guid,
                link: link,
                image: image,
                description: description,
                category: category,
                pubDate: pubDate,
                startDate: startDate,
                endDate: endDate,
                location: location,
                status: status,
                author: author,
                host: host
            };

            // Add the card content to the list
            cardsList.push(cardContent);
        });

        // Return the list after processing all items
        return cardsList;

    } catch (error) {
        console.error('Error:', error);
    }
}
