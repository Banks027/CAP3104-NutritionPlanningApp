document.querySelectorAll('.faq-question').forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const isOpen = button.classList.contains('active');

    if (isOpen) {
      button.classList.remove('active');
      answer.style.maxHeight = null;
    } else {
      button.classList.add('active');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});