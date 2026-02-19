import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// ===== INTERSECTION OBSERVER FOR REVEAL ANIMATIONS =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // For staggered children (timeline, checklist, scorecard, pipeline)
      const staggerItems = entry.target.querySelectorAll(
        '.timeline-item, .checklist-item, .scorecard-row, .pipeline-step'
      );
      staggerItems.forEach((item, i) => {
        setTimeout(() => item.classList.add('visible'), i * 150);
      });
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== NUMBER COUNTERS =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0');
  const suffix = el.dataset.suffix || '';
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;
    el.textContent = current.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ===== QUIZ INTERACTIVITY =====
document.querySelectorAll('.quiz-container').forEach(quiz => {
  const options = quiz.querySelector('.quiz-options');
  const result = quiz.querySelector('.quiz-result');

  options.addEventListener('click', (e) => {
    const btn = e.target.closest('.quiz-option');
    if (!btn || options.classList.contains('answered')) return;

    btn.classList.add('selected');
    options.classList.add('answered');

    setTimeout(() => {
      result.classList.add('visible');
      result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 400);
  });
});

// ===== PERSONA CAROUSEL FILTER =====
document.querySelectorAll('.carousel-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('.carousel-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.persona-carousel .persona-card').forEach(card => {
      if (filter === 'all' || card.dataset.community === filter) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== EXPANDABLE CARDS =====
document.querySelectorAll('.expandable-header').forEach(header => {
  header.addEventListener('click', () => {
    const card = header.closest('.expandable-card');
    card.classList.toggle('open');
  });
});

// ===== CHART.JS — SHARED CONFIG =====
const goldColor = '#edd496';
const blueColor = '#3b82f6';
const redColor = '#ef4444';
const greenColor = '#22c55e';
const grayColor = '#6b7280';

Chart.defaults.color = '#8b8fa3';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.font.size = 13;
Chart.defaults.plugins.legend.labels.boxWidth = 14;
Chart.defaults.plugins.legend.labels.padding = 16;

const chartObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.chartInit) {
      entry.target.dataset.chartInit = 'true';
      // Small delay to ensure container is fully visible
      setTimeout(() => initChart(entry.target.id), 100);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('canvas').forEach(c => chartObserver.observe(c));

function initChart(id) {
  const ctx = document.getElementById(id);
  if (!ctx) return;

  // Ensure parent has explicit height for chart rendering
  const container = ctx.closest('.chart-container');
  if (container) {
    container.style.position = 'relative';
  }

  switch(id) {
    case 'chart-sentiment':
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Bilt 2.0', 'Amex Refresh'],
          datasets: [
            { label: 'Negative (1-2)', data: [70, 20], backgroundColor: redColor, borderRadius: 4 },
            { label: 'Neutral (3)', data: [27, 40], backgroundColor: grayColor, borderRadius: 4 },
            { label: 'Positive (4-5)', data: [3, 40], backgroundColor: greenColor, borderRadius: 4 },
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (c) => c.dataset.label + ': ' + c.raw + '%'
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { callback: v => v + '%' }
            },
            y: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { weight: '600', size: 14 } }
            }
          },
          animation: { duration: 1500, easing: 'easeOutQuart' }
        }
      });
      break;

    case 'chart-waterfall':
      // Before/after Reddit scores — shows Bilt ending dangerously low vs Amex staying moderate
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [
            'Bilt: Emotional', 'Bilt: Overall', 'Bilt: Action',
            'Amex: Emotional', 'Amex: Overall', 'Amex: Likelihood'
          ],
          datasets: [
            {
              label: 'Before Reddit',
              data: [2.13, 2.03, 1.83, 3.27, 3.20, 2.73],
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.25)',
              borderWidth: 1,
              borderRadius: 4,
              maxBarThickness: 40,
            },
            {
              label: 'After Reddit',
              data: [1.67, 1.47, 1.27, 2.77, 2.60, 2.33],
              backgroundColor: 'rgba(255,69,0,0.8)',
              borderRadius: 4,
              maxBarThickness: 40,
            }
          ]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (c) => c.dataset.label + ': ' + c.raw.toFixed(2) + ' / 5'
              }
            }
          },
          scales: {
            x: {
              min: 0, max: 5,
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { stepSize: 1 },
              title: { display: true, text: '1-5 Scale (higher = better)', color: '#555970', font: { size: 11 } }
            },
            y: {
              grid: { display: false },
              ticks: { font: { weight: '600', size: 12 } }
            }
          },
          animation: { duration: 1500, easing: 'easeOutQuart' }
        }
      });
      break;

    case 'chart-tiers':
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Blue ($0)', 'Obsidian ($95)', 'Palladium ($495)', 'None (wouldn\'t adopt)'],
          datasets: [
            {
              label: 'Before Reddit (R1)',
              data: [12, 1, 2, 15],
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderColor: 'rgba(255,255,255,0.25)',
              borderWidth: 1,
              borderRadius: 4,
              maxBarThickness: 50,
            },
            {
              label: 'After Reddit (R2)',
              data: [7, 0, 0, 23],
              backgroundColor: 'rgba(255,69,0,0.8)',
              borderRadius: 4,
              maxBarThickness: 50,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: (c) => c.dataset.label + ': ' + c.raw + ' personas'
              }
            }
          },
          scales: {
            x: {
              grid: { display: false },
              ticks: { font: { size: 12 } }
            },
            y: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: { stepSize: 5 },
              title: { display: true, text: 'Number of Personas', color: '#555970' }
            }
          },
          animation: { duration: 1500, easing: 'easeOutQuart' }
        }
      });
      break;

    case 'chart-cost':
      // Time to insights comparison (in hours)
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [['Synthetic Twins', '(once built)'], 'User Surveys', ['Focus Groups /', 'Live Calls']],
          datasets: [{
            data: [2, 336, 504],
            backgroundColor: [greenColor, grayColor, grayColor],
            borderRadius: 6,
            maxBarThickness: 60,
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (c) => {
                  const h = c.raw;
                  if (h < 24) return h + ' hours';
                  const weeks = Math.round(h / 168);
                  return '~' + weeks + ' week' + (weeks > 1 ? 's' : '');
                }
              }
            }
          },
          scales: {
            x: {
              grid: { color: 'rgba(255,255,255,0.04)' },
              ticks: {
                callback: v => {
                  if (v < 24) return v + 'h';
                  return Math.round(v / 168) + 'w';
                }
              },
              title: { display: true, text: 'Time to actionable insights', color: '#555970' }
            },
            y: {
              grid: { display: false },
              ticks: { font: { weight: '600', size: window.innerWidth < 600 ? 11 : 13 } }
            }
          },
          animation: { duration: 1500, easing: 'easeOutQuart' }
        }
      });
      break;
  }
}

// ===== SMOOTH SCROLL INDICATOR =====
document.querySelector('.scroll-indicator')?.addEventListener('click', () => {
  document.getElementById('disaster')?.scrollIntoView({ behavior: 'smooth' });
});

// ===== QUIZ SCROLL HINT =====
document.querySelector('.quiz-scroll-hint')?.addEventListener('click', () => {
  document.getElementById('synthetic-twins')?.scrollIntoView({ behavior: 'smooth' });
});
