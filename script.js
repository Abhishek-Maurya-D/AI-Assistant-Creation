let systemContext = '';
let GEMINI_API_KEY = 'AIzaSyBDCid_GCBeLSaSBdEHfsuV8TzCoMTc7qw'; // default key

// Called when user clicks "Start Chatting"
function startChat() {
    const contextInput = document.getElementById('context').value.trim();
    const apiKeyInput = document.getElementById('apiKey').value.trim();

    if (contextInput) {
        // Store context and key if provided
        systemContext = contextInput;
        if (apiKeyInput) GEMINI_API_KEY = apiKeyInput;

        // Hide setup section, show chat section
        document.getElementById('setupSection').style.display = 'none';
        document.getElementById('chatSection').style.display = 'flex';
    } else {
        alert('Please enter a chatbot context.');
    }
}

// Allow pressing "Enter" to send messages
function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

// Main function to handle sending message to Gemini API
async function sendMessage() {
    const inputEl = document.getElementById('userInput');
    const chatWindow = document.getElementById('chatWindow');
    const typing = document.getElementById('typingIndicator');

    const userText = inputEl.value.trim();
    if (!userText) return;

    // Create and show user message in chat window
    const userMsg = document.createElement('div');
    userMsg.className = 'message user';
    userMsg.innerText = userText;
    chatWindow.appendChild(userMsg);
    inputEl.value = ''; // Clear input

    typing.style.display = 'block'; // Show typing indicator

    // Call Gemini API to get response
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `${systemContext}\n${userText}` } // Context + user question
                    ]
                }
            ]
        })
    });

    const data = await res.json();
    typing.style.display = 'none'; // Hide typing indicator

    // Create bot response element
    const botMsg = document.createElement('div');
    botMsg.className = 'message bot';
    botMsg.innerText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    chatWindow.appendChild(botMsg);

    // Scroll to latest message
    chatWindow.scrollTop = chatWindow.scrollHeight;
}