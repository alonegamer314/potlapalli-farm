const fs = require('fs');
const path = require('path');

// Map of placeholder strings (from your HTML) to GitHub Secret names (from Step 1)
const REPLACEMENTS = {
    "##FIREBASE_API_KEY##": process.env.FIREBASE_API_KEY,
    "##FIREBASE_AUTH_DOMAIN##": process.env.FIREBASE_AUTH_DOMAIN,
    "##FIREBASE_PROJECT_ID##": process.env.FIREBASE_PROJECT_ID,
    "##FIREBASE_STORAGE_BUCKET##": process.env.FIREBASE_STORAGE_BUCKET,
    "##FIREBASE_APP_ID##": process.env.FIREBASE_APP_ID,
};

// Files that contain the sensitive configuration
const targetFiles = [
    'index.html', 
    'about.html', 
    'signin.html', 
    'signup.html',
    'cart.html',
    'profile.html',
    'contact-us.html',
    'gallery.html',
    'maps.html' // Assuming you deploy the maps dashboard as well
];

console.log("Starting security injection...");

targetFiles.forEach(fileName => {
    try {
        const filePath = path.join(__dirname, fileName);
        if (!fs.existsSync(filePath)) {
             console.log(`ⓘ File not found: ${fileName}. Skipping.`);
             return;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        let changesMade = false;

        for (const [placeholder, secretValue] of Object.entries(REPLACEMENTS)) {
            // Replaces the placeholder text with the actual secret value
            const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
            
            if (content.match(regex)) {
                content = content.replace(regex, secretValue);
                changesMade = true;
            }
        }

        if (changesMade) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Successfully secured: ${fileName}`);
        }

    } catch (error) {
        console.error(`❌ Failed to process ${fileName}: ${error.message}`);
    }
});

console.log("Injection complete. Ready for deployment.");
