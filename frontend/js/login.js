 document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
      
            if (!email.includes('@')) {
                alert('Please enter a valid email address');
                return;
            }
            
            if (password.length < 6) {
                alert('Password must be at least 6 characters');
                return;
            }
            console.log('Login attempt with:', { email, password });
            
           
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
   
        document.querySelectorAll('.social-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const provider = this.textContent === 'G' ? 'Google' : 
                               this.textContent === 'f' ? 'Facebook' : 'Apple';
                alert(`Logging in with ${provider} (this is just a demo)`);
            });
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
        document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const username = email.split('@')[0];

  const user = {
    id: 'user-' + Math.random().toString(36).substring(2, 9),
    email: email,
    username: username,
    stickersPurchased: 0,
    lastLogin: new Date().toLocaleString()
  };
  

  localStorage.setItem('zickersUser', JSON.stringify(user));
  

  window.location.href = 'index.html';
});
