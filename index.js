const sendChatBtn = document.querySelector(".chatbot__input-button");
const chatInput = document.querySelector(".chatbot__input-text");
const chatBox = document.querySelector(".chatbot__chatbox");
const chatbotToggler = document.querySelector(".chatbot__toggler");
const chatbotCloseBtn = document.querySelector(".chatbot__header-button--close");

let userMessage = "";
const OPENAI_API_KEY = "";

/** Creates a chat message element
 * @param {string} message
 * @param {string} messageClass
 * @returns {HTMLLIElement} chatMessage
 * */
const createChatMessage = (message, messageClass) => {
    const chatMessage = document.createElement("li");
    chatMessage.classList.add("chatbot__chat-message", messageClass);

    const chatMessageText =
        messageClass == "chatbot__chat-message--outgoing"
            ? `<p class="chatbot__text"></p>`
            : `<span class="material-symbols-outlined chatbot__img">smart_toy</span><p class="chatbot__text"></p>`;

    chatMessage.innerHTML = chatMessageText;
    chatMessage.querySelector(".chatbot__text").textContent = message;
    return chatMessage;
};

/** Generates a message from the chatbot using the OpenAI API */
generateBotMessage = (chatbotMessageElement) => {
    const chatText = chatbotMessageElement.querySelector(".chatbot__text");

    const API_URL = "https://api.openai.com/v1/chat/completions";
    const responseOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: userMessage }],
        }),
    };

    fetch(API_URL, responseOptions)
        .then((response) => {
            if (!response.ok) {
                createErrorMessage(response);
                return;
            }
            response
                .json()
                .then((data) => {
                    const message = data.choices[0].message.content.trim();
                    console.log(message);
                    chatText.textContent = message;
                })
                .catch((error) => {
                    createErrorMessage(error);
                })
                .finally(() => {
                    chatBox.scrollTo(0, chatBox.scrollHeight);
                });
        })
        .catch((error) => {
            createErrorMessage(error);
        })
        .finally(() => {
            chatBox.scrollTo(0, chatBox.scrollHeight);
        });
};

/**
 * Creates an error message and appends it to the chatbox
 * @param {Error} error
 * @returns {HTMLLIElement} errorMessage
 * */
const createErrorMessage = (error) => {
    console.log(error);
    const botErrorMessage = "Sorry, I'm having trouble connecting to the server. Please try again later.";

    const errorMessage = document.createElement("li");
    errorMessage.classList.add("chatbot__chat-message", "chatbot__chat-message--incoming", "chatbot__chat-message--error");
    errorMessage.innerHTML = `<span class="material-symbols-outlined chatbot__img">smart_toy</span><p class="chatbot__text">${botErrorMessage}</p>`;

    chatBox.appendChild(errorMessage);

    chatBox.scrollTo(0, chatBox.scrollHeight);

    return errorMessage;
};

/**
 * Handles the user input and sends it to the OpenAI API
 * */
const handleChatInput = () => {
    userMessage = chatInput.value.trim();

    if (!userMessage) return;
    chatInput.value = "";
    let messageElement = createChatMessage(userMessage, "chatbot__chat-message--outgoing");
    chatBox.appendChild(messageElement);
    chatBox.scrollTo(0, chatBox.scrollHeight);

    setTimeout(() => {
        const chatbotMessageElement = createChatMessage("Thinking...", "chatbot__chat-message--incoming");
        chatBox.appendChild(chatbotMessageElement);
        generateBotMessage(chatbotMessageElement);
    }, 600);
};

/**
 * Event listeners
 * */
sendChatBtn.addEventListener("click", () => {
    handleChatInput();
});

chatInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        handleChatInput();
    }
});

chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");

    if (document.body.classList.contains("show-chatbot")) {
        chatInput.focus();
    }
});

chatbotCloseBtn.addEventListener("click", () => {
    document.body.classList.remove("show-chatbot");
});
