document.addEventListener('DOMContentLoaded', async () => {
    const chatContainer = document.getElementById('chat-container');
    let messageCount = 0;
    let isAutoScroll = true;

    let EMOJI_MAPPING = {};
    try {
        const response = await fetch(`/emojis.json?nocache=${Date.now()}`);
        EMOJI_MAPPING = await response.json();
    } catch (e) {
        console.error('Error loading emojis:', e);
    }

    const ws = new WebSocket(`ws://${window.location.host}`);

    ws.onmessage = (event) => {
        try {
            const msg = JSON.parse(event.data);
            if (msg.type === 'chat') addMessage(msg);
            else if (msg.type === 'batch') {
 
                msg.messages.forEach(m => addMessage(m));
            }
        } catch (e) {
            console.error('Error processing message:', e);
        }
    };

    const CYBERPUNK_PALETTE = [
        { bg: 'rgba(17, 255, 121, 0.8)', text: '#000', border: 'rgba(17, 255, 121, 0.9)' },
        { bg: 'rgba(255, 17, 121, 0.8)', text: '#000', border: 'rgba(255, 17, 121, 0.9)' },
        { bg: 'rgba(121, 17, 255, 0.8)', text: '#fff', border: 'rgba(121, 17, 255, 0.9)' },
        { bg: 'rgba(17, 121, 255, 0.8)', text: '#fff', border: 'rgba(17, 121, 255, 0.9)' },
        { bg: 'rgba(255, 255, 17, 0.8)', text: '#000', border: 'rgba(255, 255, 17, 0.9)' },
        { bg: 'rgba(21, 25, 40, 0.93)', text: '#11ff79', border: 'rgba(19, 19, 19, 0.9)' }
    ];

    function getCyberpunkStyle(username) {
        let hash = 0;
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % CYBERPUNK_PALETTE.length;
        
        return CYBERPUNK_PALETTE[index];
    }

function addMessage(msg) {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${messageCount++ % 2 ? 'odd' : ''}`;
    
    const header = document.createElement('div');
    header.className = 'message-header';

    if (msg.avatar) {
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        
        const img = document.createElement('img');
        img.src = msg.avatar;
        img.alt = msg.channelTitle || 'Anónimo';
        img.onerror = () => avatar.style.display = 'none';
        
        avatar.appendChild(img);
        header.appendChild(avatar);
    }

    const userContainer = document.createElement('div');
    userContainer.className = 'message-user-container';
    
    const username = msg.channelTitle || 'Anónimo';
    const style = getCyberpunkStyle(username);
    
    const usernameElement = document.createElement('span');
    usernameElement.className = 'message-username cyberpunk';
    usernameElement.textContent = username + ':';

    const membershipIcons = [
        'crown', 'star', 'diamond', 'heart', 'rocket', 
        'moon', 'fire', 'ghost', 'alien', 'dragon'
    ];

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const iconIndex = Math.abs(hash) % membershipIcons.length;
    const iconType = membershipIcons[iconIndex];
    
    const iconElement = document.createElement('span');
    iconElement.className = `membership-icon ${iconType}`;
    usernameElement.insertBefore(iconElement, usernameElement.firstChild);
    
    usernameElement.style.backgroundColor = style.bg;
    usernameElement.style.color = style.text;
    usernameElement.style.textShadow = `0 0 8px ${style.border}`;
    usernameElement.style.border = `1px solid ${style.border}`;
    usernameElement.style.padding = '0px 2px';
    usernameElement.style.borderRadius = '4px';
    usernameElement.style.fontWeight = '700';
    usernameElement.style.fontSize = '18px';
    usernameElement.style.transition = 'all 0.3s ease';
    usernameElement.style.display = 'inline-block';
    
    userContainer.appendChild(usernameElement);
    
    const cleanMessage = msg.message.replace(/&lt;stkr&gt;(.*?)&lt;\/stkr&gt;/g, '<stkr>$1</stkr>');
    const hasSticker = /<stkr>/.test(cleanMessage);
    const normalText = cleanMessage.replace(/<stkr>.*?<\/stkr>/g, '').trim();
    
    if (normalText.length > 0) {
        const textElement = document.createElement('span');
        textElement.className = msg.credits > 0 ? 'message-text-inline has-donation' : 'message-text-inline';
        textElement.innerHTML = formatText(normalText);
        userContainer.appendChild(textElement);
    }
    
    header.appendChild(userContainer);

if (msg.credits > 0) {
    const donation = document.createElement('span');
    donation.className = 'message-donation highlight';
    donation.textContent = `$${msg.credits} USD`;
    header.appendChild(donation);

    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';

    for (let i = 0; i < 200; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.width = `${6 + Math.random() * 6}px`;
        confetti.style.height = confetti.style.width;
        
        const colors = ['#ff69b4', '#ffd700', '#ffffff', '#e81161', '#0070ff', '#00ff28'];
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const duration = 2 + Math.random() * 8;
        const delay = Math.random() * 10;
        confetti.style.animation = `confettiFall ${duration}s linear ${delay}s forwards`;
        
        if (Math.random() > 0.5) {
            confetti.style.borderRadius = '50%';
        }
        
        confettiContainer.appendChild(confetti);
    }
    
    messageEl.appendChild(confettiContainer);
    
    setTimeout(() => {
        donation.classList.remove('highlight');
        
        confettiContainer.style.opacity = '0';
        setTimeout(() => {
            confettiContainer.remove();
        }, 1000);
    }, 20000);
}
    
    messageEl.appendChild(header);

    if (hasSticker) {
        const stickerContainer = document.createElement('div');
        stickerContainer.className = 'message-sticker-container';
        const stickersOnly = cleanMessage.match(/<stkr>.*?<\/stkr>/g)?.join('') || '';
        stickerContainer.innerHTML = formatText(stickersOnly);
        messageEl.appendChild(stickerContainer);
    }

    chatContainer.appendChild(messageEl);
    
    if (isAutoScroll) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function formatText(text) {
    if (!text) return '';
    let formatted = escapeHtml(text);
    
    formatted = formatted.replace(/<stkr>(.*?)<\/stkr>/g, (match, url) => {
        if (url.match(/^https?:\/\//i)) {
            return `<img src="${url}" alt="Sticker" class="comment-sticker" loading="lazy" />`;
        }
        return match;
    });

    if (Object.keys(EMOJI_MAPPING).length > 0) {
        for (const [code, url] of Object.entries(EMOJI_MAPPING)) {
            const isSticker = url.includes('/stickers/');
            const className = isSticker ? 'comment-sticker' : 'comment-emoji';
            const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            formatted = formatted.replace(
                new RegExp(escapedCode, 'g'),
                `<img src="${url}" alt="${code}" class="${className}" loading="lazy" />`
            );
        }
    }

    return formatted;
}

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML
            .replace(/&lt;stkr&gt;/g, '<stkr>')
            .replace(/&lt;\/stkr&gt;/g, '</stkr>');
    }

    chatContainer.addEventListener('scroll', () => {
        isAutoScroll = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 50;
    });
});