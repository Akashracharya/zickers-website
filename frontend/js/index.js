const stickers = [
    { id: 1, name: "Nos", price: 4.99, image: "https://www.stickitup.xyz/cdn/shop/products/1l0E6sE8ISYlqIGugx2aMFJmUmRKUlO0a.jpg?v=1736848719&width=533" },
    { id: 2, name: "Just Chill", price: 3.99, image: "https://i.postimg.cc/mrdRH9Pp/just-chill.jpg" },
    { id: 3, name: "Slay All Day", price: 5.99, image: "https://i.postimg.cc/zXmNK8fN/80s-Stickers-for-Sale.jpg" },
    { id: 4, name: "Mario ?", price: 4.49, image: "https://i.postimg.cc/XY401LFD/download-2.jpg" },
    { id: 5, name: "Ghosted", price: 3.99, image: "https://i.postimg.cc/G2VCM1Jk/Monsters-University-Official-Disney-Sticker.jpg" },
    { id: 6, name: "Play Station", price: 4.99, image: "https://i.postimg.cc/fLJsjbXz/ps.jpg" },
    { id: 7, name: "Lakers", price: 4.29, image: "https://i.postimg.cc/433Rs3W6/lakers.jpg" },
    { id: 8, name: "Nasa", price: 5.49, image: "https://i.postimg.cc/0yn1TS05/NASA-Logo-Sticker.jpg" }
];


document.addEventListener('DOMContentLoaded', function() {
    const stickerGrid = document.querySelector('.sticker-grid');

    stickers.forEach(sticker => {
        const card = document.createElement('div');
        card.className = 'sticker-card doodle-border';
        card.innerHTML = `
            <img src="${sticker.image}" alt="${sticker.name}" class="sticker-img doodle-border">
            <h3 class="sticker-title">${sticker.name}</h3>
            <p class="sticker-price">$${sticker.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${sticker.id}">+</button>
        `;
        stickerGrid.appendChild(card);
    });
});


document.addEventListener('click', function(e) {
    
    if (e.target.classList.contains('add-to-cart')) {
        const stickerId = parseInt(e.target.getAttribute('data-id'));
        const stickerToAdd = stickers.find(s => s.id === stickerId); 

        if (stickerToAdd) {
           
            const event = new CustomEvent('addToCart', { detail: stickerToAdd });
            document.dispatchEvent(event);

          
            e.target.textContent = '✓';
            setTimeout(() => {
                e.target.textContent = '+';
            }, 1000);
        }
    }

  
    if (e.target.id === 'logo-img') {
        location.reload();
    } else if (e.target.classList.contains('login-btn')) {
        window.location.href = "login.html";
    } else if (e.target.classList.contains('cart-btn')) {
        window.location.href = "cart.html";
    } else if (e.target.classList.contains('explore-btn')) {
        window.scrollTo({
            top: document.querySelector('.sticker-grid').offsetTop - 20,
            behavior: 'smooth'
        });
    }
});


document.addEventListener('DOMContentLoaded', function() {
    for (let i = 0; i < 5; i++) {
        const doodle = document.createElement('div');
        doodle.style.position = 'fixed';
        doodle.style.width = Math.random() * 50 + 20 + 'px';
        doodle.style.height = Math.random() * 50 + 20 + 'px';
        doodle.style.border = '2px solid ' + ['#ff5e7d', '#47b8e0', '#333'][Math.floor(Math.random() * 3)];
        doodle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        doodle.style.opacity = '0.3';
        doodle.style.left = Math.random() * 100 + 'vw';
        doodle.style.top = Math.random() * 100 + 'vh';
        doodle.style.pointerEvents = 'none';
        doodle.style.zIndex = '-1';
        doodle.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)';
        document.body.appendChild(doodle);
    }
});


window.addEventListener('DOMContentLoaded', function() {
    const userData = localStorage.getItem('zickersUser');

  
    if (!userData) {
       
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Login';
            loginBtn.style.display = 'block'; 
        }
        const profileContainer = document.querySelector('#user-profile-container');
        if (profileContainer) {
            profileContainer.style.display = 'none';
        }

    } else {
       
        const user = JSON.parse(userData);
        displayUserProfile(user);
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.style.display = 'none';
        }
    }
});

function displayUserProfile(user) {
    let profileContainer = document.querySelector('#user-profile-container');
    if (!profileContainer) {
        profileContainer = document.createElement('div');
        profileContainer.id = 'user-profile-container';
       
        document.querySelector('header .nav-buttons').prepend(profileContainer);
    }

    profileContainer.innerHTML = `
        <div class="profile-card doodle-border">
            <h2>Hey ${user.username}!</h2>
            <p>Member since: ${user.lastLogin}</p>
            <p>Your sticker collection: ${user.stickersPurchased || '0'}</p>
            <button id="logoutBtn" class="doodle-btn">Log Out</button>
        </div>
    `;

    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('zickersUser');
        window.location.href = 'login.html';
    });
}
