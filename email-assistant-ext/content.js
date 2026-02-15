const getEmailContent = () => {
    const selectors = [
        '.h7',
        '.a3s.aiL',
        '.gmail_quote',
        '[role="presentation"]'
    ];

    for (const selector of selectors) {
        const content = document.querySelector(selector);
        if (content) {
            return content.innerHTML.trim();
        }
    }
    return '';
}

const createAIButton = () => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3 ai-reply-button';
    button.textContent = 'AI Reply';
    button.setAttribute('data-tooltip', 'Generate AI Reply');
    button.setAttribute('aria-label', 'Generate AI Reply');
    return button;
}

const findComposeToolbars = () => {
    const selectors = ['.btC', '.aDh', '[role="toolbar"]', '.gU.Up'];

    for (const selector of selectors) {
        const toolbar = document.querySelector(selector);
        if (toolbar) {
            return toolbar;
        }
    }
    return null;
}

const injectButton = () => {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) {
        existingButton.remove();
    }
    const toolbar = findComposeToolbars();
    if (!toolbar) {
        return;
    }
    const button = createAIButton();

    button.addEventListener('click', async () => {
        try {
            button.textContent = "Generating...";
            button.disabled = true;
            button.setAttribute('aria-busy', 'true');
            button.classList.add('is-loading');
            const emailContent = getEmailContent();

            const response = await fetch("http://localhost:8081/api/email/generate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: 'professional',
                })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');

            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, data);
            }
        } catch (error) {
            alert('Failed to generate reply');
        } finally {
            button.textContent = "AI Reply";
            button.disabled = false;
            button.removeAttribute('aria-busy');
            button.classList.remove('is-loading');
        }
    })

    toolbar.insertBefore(button, toolbar.firstChild);
}

const observer = new MutationObserver((mutations) => {

    for (const mutation of mutations) {
        const hasComposeElements = Array.from(mutation.addedNodes).some(node => {
            if (node.nodeType !== Node.ELEMENT_NODE) return false;

            return node.matches('.aDh, .btC, [role="dialog"]') ||
                node.querySelector('.aDh, .btC, [role="dialog"]');
        });

        if (hasComposeElements) {
            setTimeout(injectButton, 500);
        }
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});
