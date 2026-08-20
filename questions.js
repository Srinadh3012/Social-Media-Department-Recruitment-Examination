// Base questions for each role
const gd_base = [
    {"q": "Which color mode is best used for digital screens?", "options": ["CMYK", "RGB", "Pantone", "Grayscale"], "a": 1},
    {"q": "What is the standard resolution for web images?", "options": ["300 dpi", "72 ppi", "150 ppi", "600 dpi"], "a": 1},
    {"q": "Which file format supports transparency?", "options": ["JPEG", "PNG", "BMP", "TIFF"], "a": 1},
    {"q": "In typography, what is 'kerning'?", "options": ["The space between lines", "The space between individual characters", "The size of the font", "The alignment of the text"], "a": 1},
    {"q": "Which Adobe software is primarily vector-based?", "options": ["Photoshop", "Premiere Pro", "Illustrator", "After Effects"], "a": 2},
    {"q": "What does UI stand for in design?", "options": ["Universal Interface", "User Interface", "Unified Integration", "User Interaction"], "a": 1},
    {"q": "Which principle of design refers to the visual weight of elements?", "options": ["Contrast", "Balance", "Emphasis", "Rhythm"], "a": 1},
    {"q": "What is the rule of thirds used for?", "options": ["Color mixing", "Typography scaling", "Composition and framing", "File compression"], "a": 2},
    {"q": "Which tool in Photoshop is best for removing a solid background?", "options": ["Magic Wand", "Clone Stamp", "Brush Tool", "Blur Tool"], "a": 0},
    {"q": "What is a 'hex code'?", "options": ["A password for Adobe CC", "A 6-digit code for colors in web design", "A grid system", "A typography rule"], "a": 1}
];

const ve_base = [
    {"q": "What does FPS stand for?", "options": ["Frames Per Second", "First Person Shooter", "Fast Processing System", "Format Per Sequence"], "a": 0},
    {"q": "Which shortcut is universally used to split a clip in Premiere Pro?", "options": ["Ctrl + C", "C (Razor Tool)", "V (Selection Tool)", "M"], "a": 1},
    {"q": "What is 'B-roll'?", "options": ["The main interview footage", "Supplemental footage that sets the scene", "Audio tracks", "A type of transition"], "a": 1},
    {"q": "What does color grading achieve?", "options": ["Fixing white balance", "Establishing a visual tone or mood", "Compressing the file", "Syncing audio"], "a": 1},
    {"q": "Which aspect ratio is standard for TikTok/Reels?", "options": ["16:9", "1:1", "4:3", "9:16"], "a": 3},
    {"q": "What is a J-cut?", "options": ["Video cuts before the audio", "Audio cuts before the video", "A harsh straight cut", "A fade to black"], "a": 1},
    {"q": "Which software is industry standard for visual effects?", "options": ["Premiere Pro", "After Effects", "Lightroom", "Audition"], "a": 1},
    {"q": "What is the purpose of a proxy file?", "options": ["To increase rendering time", "To edit 4K/8K footage smoothly on lower-end systems", "To add subtitles", "To upload directly to YouTube"], "a": 1},
    {"q": "Which audio level is generally considered safe for dialogue?", "options": ["0 dB", "-12 dB to -6 dB", "+6 dB", "-30 dB"], "a": 1},
    {"q": "What is a 'jump cut'?", "options": ["A smooth transition", "An abrupt cut between two sequential shots", "Cutting to a different scene", "A slow motion effect"], "a": 1}
];

const cw_base = [
    {"q": "What is SEO?", "options": ["Social Engagement Optimization", "Search Engine Optimization", "Site Error Output", "Standard English Organization"], "a": 1},
    {"q": "What is a 'Call to Action' (CTA)?", "options": ["A complaint to the manager", "A prompt telling the user what to do next", "A headline", "A copyright claim"], "a": 1},
    {"q": "Which tone is most suitable for a corporate LinkedIn post?", "options": ["Casual and slang-heavy", "Professional and informative", "Highly controversial", "Purely comedic"], "a": 1},
    {"q": "What is the ideal length for a Twitter/X post to maximize engagement?", "options": ["280 characters exact", "71-100 characters", "500 characters", "As long as possible"], "a": 1},
    {"q": "What does 'evergreen content' mean?", "options": ["Content about nature", "Content that remains relevant over a long time", "Content posted on St. Patrick's day", "Content that deletes itself"], "a": 1},
    {"q": "Which is an example of active voice?", "options": ["The post was written by me.", "I wrote the post.", "The post is being written.", "Written was the post."], "a": 1},
    {"q": "What is a 'hook' in content writing?", "options": ["The conclusion", "The first line designed to grab attention", "The meta tags", "The sponsor link"], "a": 1},
    {"q": "What is plagiarism?", "options": ["Using synonyms", "Citing sources properly", "Presenting someone else's work as your own", "Writing about common knowledge"], "a": 2},
    {"q": "What is the primary goal of copywriting?", "options": ["To entertain", "To persuade the reader to take an action (buy, click, etc.)", "To inform objectively", "To write a novel"], "a": 1},
    {"q": "What is A/B testing in email marketing?", "options": ["Testing two completely different platforms", "Sending two variations of an email to see which performs better", "Checking for spelling errors", "A grading system"], "a": 1}
];

const ep_base = [
    {"q": "What does ISO control?", "options": ["Lens zoom", "The camera sensor's sensitivity to light", "The flash power", "The focus point"], "a": 1},
    {"q": "Which aperture lets in the most light?", "options": ["f/1.4", "f/4", "f/8", "f/22"], "a": 0},
    {"q": "What is 'bokeh'?", "options": ["A camera brand", "The aesthetic quality of the blur in out-of-focus areas", "A type of flash", "A memory card error"], "a": 1},
    {"q": "What is the standard shutter speed to freeze human motion at an event?", "options": ["1/30s", "1/60s", "1/200s or faster", "1s"], "a": 2},
    {"q": "What is the rule for setting shutter speed to avoid camera shake handheld?", "options": ["Always 1/100s", "1/focal length (e.g., 50mm = 1/50s)", "Always 1/500s", "Depends on the flash"], "a": 1},
    {"q": "What is a 'prime' lens?", "options": ["A lens that costs the most", "A lens with a fixed focal length (no zoom)", "A lens that zooms very far", "A lens used only for video"], "a": 1},
    {"q": "Why shoot in RAW format instead of JPEG?", "options": ["Smaller file sizes", "Retains maximum data for post-processing", "Ready to upload immediately", "Looks better straight out of camera"], "a": 1},
    {"q": "What is a 'bounce flash'?", "options": ["A broken flash", "Aiming the flash at a ceiling/wall for softer light", "A flash that strobes repeatedly", "A flash attached to the floor"], "a": 1},
    {"q": "What does white balance adjust?", "options": ["Exposure", "Color temperature", "Contrast", "Sharpness"], "a": 1},
    {"q": "In a low-light indoor event without flash, what should you do?", "options": ["Lower the ISO", "Increase the aperture (lower f-stop number) and raise ISO", "Increase shutter speed to 1/1000s", "Use a smaller aperture (f/16)"], "a": 1}
];

// Helper to pad questions to exactly 50 per role
function padQuestions(baseList, categoryName) {
    let padded = [...baseList];
    const templates = [
        {"q": `Advanced ${categoryName} Scenario: How would you handle a tight deadline?`, "options": ["Panic", "Prioritize and execute", "Ignore it", "Resign"], "a": 1},
        {"q": `Which skill is crucial for ${categoryName} professionals?`, "options": ["Typing speed", "Attention to detail", "Lifting heavy objects", "Singing"], "a": 1},
        {"q": `What is the best way to stay updated in ${categoryName}?`, "options": ["Read outdated books", "Follow industry blogs and trends", "Do nothing", "Ask a wizard"], "a": 1},
        {"q": `When delivering a ${categoryName} project, what is the final step?`, "options": ["Start over", "Quality assurance and review", "Delete the files", "Go to sleep"], "a": 1},
        {"q": `How do you handle negative feedback on your ${categoryName} work?`, "options": ["Argue", "Analyze, learn, and improve", "Ignore the client", "Cry"], "a": 1}
    ];
    
    let count = padded.length;
    while (count < 50) {
        let template = {...templates[count % templates.length]};
        template.q = `Question ${count + 1}: ${template.q}`;
        padded.push(template);
        count++;
    }
    return padded;
}

// Export to global window object
window.questionBank = {
    "graphic_design": padQuestions(gd_base, "Graphic Design"),
    "video_editing": padQuestions(ve_base, "Video Editing"),
    "content_writing": padQuestions(cw_base, "Content Writing"),
    "event_photography": padQuestions(ep_base, "Event Photography")
};
