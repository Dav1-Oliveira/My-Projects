document.addEventListener('DOMContentLoaded', function() {
  const projects = document.querySelectorAll('.project');

  projects.forEach(project => {
    project.addEventListener('touchstart', function(e) {
      // Adiciona a classe 'touch-active' para dar feedback visual do toque
      e.currentTarget.classList.add('touch-active');
    }, {passive: true});

    project.addEventListener('touchend', function(e) {
      // Remove a classe 'touch-active' após o toque
      e.currentTarget.classList.remove('touch-active');
    });
  });
});
