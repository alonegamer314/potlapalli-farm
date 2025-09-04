// JS for navbar scroll effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.style.background = '#ffffff';
    header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    header.style.background = '#f8f8f8';
    header.style.boxShadow = 'none';
  }
});
