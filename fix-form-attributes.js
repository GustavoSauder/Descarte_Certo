const fs = require('fs');
const path = require('path');

// Function to add missing id and name attributes to form fields
function addMissingAttributes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add id attributes to input fields that don't have them
    content = content.replace(
      /<input([^>]*?)(?<!id=)(?<!name=)([^>]*?)>/g,
      (match, before, after) => {
        // Extract name from the match if it exists
        const nameMatch = match.match(/name="([^"]*)"/);
        const name = nameMatch ? nameMatch[1] : 'input';
        
        // Generate a unique id based on the name
        const id = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        // Add id and name attributes
        return `<input id="${id}" name="${name}"${before}${after}>`;
      }
    );

    // Add id attributes to textarea fields that don't have them
    content = content.replace(
      /<textarea([^>]*?)(?<!id=)(?<!name=)([^>]*?)>/g,
      (match, before, after) => {
        // Extract name from the match if it exists
        const nameMatch = match.match(/name="([^"]*)"/);
        const name = nameMatch ? nameMatch[1] : 'textarea';
        
        // Generate a unique id based on the name
        const id = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        // Add id and name attributes
        return `<textarea id="${id}" name="${name}"${before}${after}>`;
      }
    );

    // Add id attributes to select fields that don't have them
    content = content.replace(
      /<select([^>]*?)(?<!id=)(?<!name=)([^>]*?)>/g,
      (match, before, after) => {
        // Extract name from the match if it exists
        const nameMatch = match.match(/name="([^"]*)"/);
        const name = nameMatch ? nameMatch[1] : 'select';
        
        // Generate a unique id based on the name
        const id = name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
        
        // Add id and name attributes
        return `<select id="${id}" name="${name}"${before}${after}>`;
      }
    );

    // Write the modified content back to the file
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed form attributes in: ${filePath}`);
    
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

// List of files to process
const filesToProcess = [
  'client/src/pages/ContactPage.jsx',
  'client/src/pages/KitPage.jsx',
  'client/src/pages/ProfilePage.jsx',
  'client/src/pages/SettingsPage.jsx',
  'client/src/pages/SupportPage.jsx'
];

// Process each file
filesToProcess.forEach(file => {
  if (fs.existsSync(file)) {
    addMissingAttributes(file);
  } else {
    console.log(`File not found: ${file}`);
  }
});

console.log('Form attribute fixing completed!'); 