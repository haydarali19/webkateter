/**
 * CareKateter Lansia — High-End Logika Antarmuka Editorial (ATM Webkegel)
 * 1. Navigasi Bab & Tab Pane + Live Header Context
 * 2. Kuis Evaluasi Pemahaman Mandiri (Enhanced Clinical Assessment)
 * 3. Daily Checklist Tracker (LocalStorage & Cetak A4)
 * 4. Symptom Checker & Triase Tanda Bahaya ISK
 * 5. Font Scale Controller (A- / A+)
 * 6. Academic Citation Copy & Toast Notification
 */

document.addEventListener('DOMContentLoaded', () => {
  initEditorialNavigation();
  initStationeryQuiz();
  initDailyChecklist();
  initSymptomChecker();
  initBackToTop();
});

/* ==========================================================================
   1. NAVIGASI BAB & TAB PANE
   ========================================================================== */
function initEditorialNavigation() {
  const chapterButtons = document.querySelectorAll('.chapter-nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const jumpLinks = document.querySelectorAll('[data-target-tab]');
  const siteHeader = document.getElementById('siteHeader');
  const btnMobileMenu = document.getElementById('btnMobileMenu');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function closeMobileMenu() {
    if (siteHeader && siteHeader.classList.contains('menu-open')) {
      siteHeader.classList.remove('menu-open');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
      if (btnMobileMenu) {
        btnMobileMenu.setAttribute('aria-expanded', 'false');
      }
    }
  }

  function toggleMobileMenu() {
    if (!siteHeader) return;
    const isOpen = siteHeader.classList.toggle('menu-open');
    if (isOpen) {
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }
    if (btnMobileMenu) {
      btnMobileMenu.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  function navigateToChapter(targetChapterId) {
    // Tutup menu drawer mobile jika terbuka
    closeMobileMenu();

    // Perbarui tombol tab aktif
    chapterButtons.forEach(btn => {
      if (btn.dataset.tab === targetChapterId) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        // Hanya scroll horizontally jika di viewport desktop/tablet yang scrollable
        if (window.innerWidth > 768) {
          btn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // Perbarui tampilan bab aktif
    tabPanes.forEach(pane => {
      if (pane.id === targetChapterId) {
        pane.classList.add('active');
      } else {
        pane.classList.remove('active');
      }
    });

    // Gulir halus ke atas
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Event listener tombol tab bab
  chapterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      navigateToChapter(btn.dataset.tab);
    });
  });

  // Event listener link pintasan (data-target-tab)
  jumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.dataset.targetTab;
      if (target) {
        navigateToChapter(target);
      }
    });
  });

  // Event listener kontrol mobile menu drawer
  if (btnMobileMenu) {
    btnMobileMenu.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (mobileNavBackdrop) {
    mobileNavBackdrop.addEventListener('click', closeMobileMenu);
    mobileNavBackdrop.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  if (siteHeader) {
    siteHeader.addEventListener('touchmove', (e) => {
      if (siteHeader.classList.contains('menu-open') && !e.target.closest('.chapter-nav-wrapper')) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  // Tutup menu saat menekan tombol Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // Tutup menu saat resize ke desktop (> 768px)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  // Auto-center tombol aktif saat halaman dimuat
  setTimeout(() => {
    const activeBtn = document.querySelector('.chapter-nav-item.active');
    if (activeBtn) {
      if (window.innerWidth > 768) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, 150);
}

/* ==========================================================================
   2. KUIS EVALUASI PEMAHAMAN MANDIRI (ENHANCED CLINICAL ASSESSMENT)
   ========================================================================== */
const quizQuestions = [
  {
    topic: "Hukum Gravitasi & Aliran Balik",
    question: "1. Mengapa kantung urine (urine bag) TIDAK BOLEH diletakkan di atas tempat tidur atau sejajar dengan perut lansia saat berbaring?",
    options: [
      { letter: "A", text: "Agar selang tidak mudah kusut dan seprai tempat tidur tampak lebih rapi.", correct: false },
      { letter: "B", text: "Mencegah aliran balik (refluks) urine kotor berkoloni kuman dari kantung kembali ke kandung kemih.", correct: true },
      { letter: "C", text: "Supaya urine di dalam kantung terlihat lebih penuh dan warnanya tampak lebih jernih.", correct: false }
    ],
    explanation: "Hukum gravitasi mutlak berlaku dalam drainase kateter. Meletakkan kantung sejajar atau lebih tinggi dari kandung kemih memicu aliran balik urine yang membawa jutaan kuman masuk kembali ke vesika urinaria, meningkatkan risiko infeksi hingga 3.8 kali lipat.",
    citation: "Riset: Asda, Rabiah, & Maryam (2024), RSUD Undata"
  },
  {
    topic: "Patogenesis & Keunggulan CIC",
    question: "2. Berdasarkan riset ilmiah, apa keunggulan klinis utama teknik Clean Intermittent Catheterization (CIC) dibanding kateter menetap (Foley)?",
    options: [
      { letter: "A", text: "Menghilangkan keberadaan selang permanen yang menjadi media sarang lapisan lendir (biofilm) bakteri kebal antibiotik.", correct: true },
      { letter: "B", text: "Pasien lansia tidak perlu lagi mengonsumsi air minum dan kebutuhan cairannya berkurang drastis.", correct: false },
      { letter: "C", text: "Selang kateter bebas tidak perlu dicuci atau dibersihkan sama sekali sebelum dimasukkan ke uretra.", correct: false }
    ],
    explanation: "Jurnal Sewaka Bhakti (2023) membuktikan bahwa CIC meniadakan selang permanen yang menjadi sarang biofilm kuman. Pengosongan berkala memulihkan siklus fisiologis kandung kemih dan menekan rekurensi infeksi jangka panjang.",
    citation: "Riset: Jurnal Sewaka Bhakti UNHI (2023)"
  },
  {
    topic: "SOP Higiene & Sirkuit Tertutup",
    question: "3. Apa tindakan higienitas yang PALING TEPAT saat membersihkan area meatus saluran kemih lansia yang terpasang kateter menetap di rumah?",
    options: [
      { letter: "A", text: "Mengusap bolak-balik dengan kassa yang sama berulang kali di sekitar mulut kelamin.", correct: false },
      { letter: "B", text: "Membuka sambungan selang setiap pagi untuk dibilas dengan rebusan air daun sirih rumahan.", correct: false },
      { letter: "C", text: "Mengusap secara lembut satu arah dari lubang kemih keluar menjauhi tubuh (sentrifugal) minimal 2 kali sehari.", correct: true }
    ],
    explanation: "Pembersihan meatus harus selalu dilakukan satu arah menjauhi lubang uretra guna mencegah kuman perineum tersorong ke dalam. Sambungan sirkuit tertutup steril dilarang keras diputus untuk pembilasan mandiri di rumah karena memicu kontaminasi patogen.",
    citation: "Riset: Kumala et al. (2023) & Asda et al. (2024)"
  },
  {
    topic: "Manifestasi Geriatri Atipikal",
    question: "4. Bagaimana manifestasi klinis Infeksi Saluran Kemih (CAUTI) yang sering terjadi secara atipikal pada lansia di rumah?",
    options: [
      { letter: "A", text: "Selalu ditandai secara klasik dengan demam tinggi menggigil di atas suhu 40°C.", correct: false },
      { letter: "B", text: "Kerap tidak disertai demam jelas, melainkan penurunan kesadaran, lemas tiba-tiba, atau linglung mendadak (delirium).", correct: true },
      { letter: "C", text: "Lansia secara tiba-tiba mengalami lonjakan energi tinggi dan menjadi sangat bugar.", correct: false }
    ],
    explanation: "Respon imun sistemik lansia kerap tumpul karena proses penuaan. ISK pada geriatri seringkali tidak menimbulkan demam tinggi, melainkan bermanifestasi sebagai delirium akut (kebingungan mendadak), anoreksia mendadak, atau urine berbau menyengat keruh.",
    citation: "Riset: Sintesis Keperawatan Urologi Geriatri"
  },
  {
    topic: "Fiksasi Mekanis & Mikrolesi",
    question: "5. Mengapa selang kateter urine WAJIB difiksasi pada paha atas lansia menggunakan plester medis berpori?",
    options: [
      { letter: "A", text: "Mencegah tarikan mekanis (traksi) yang dapat melukai dan merobek mukosa epitel uretra saat pasien bergerak.", correct: true },
      { letter: "B", text: "Supaya bahan silikon atau lateks selang kateter tidak mengalami perubahan warna menjadi kusam.", correct: false },
      { letter: "C", text: "Agar aliran urine mengalir lebih cepat tanpa hambatan menuju kantung penampung bawah.", correct: false }
    ],
    explanation: "Kumala et al. (2023) menegaskan bahwa traksi tanpa fiksasi plester paha menimbulkan mikrolesi dan erosi mukosa uretra akibat pergerakan tubuh pasien saat tidur. Luka epitel ini menjadi pintu masuk utama bakteri uropatogen.",
    citation: "Riset: Kumala et al. (2023), Jurnal Medika Malahayati"
  }
];

let currentQIdx = 0;
let scoreCount = 0;
let userHasChosen = false;

function initStationeryQuiz() {
  const qSection = document.getElementById('quizQuestionSection');
  if (!qSection) return;
  renderQuestion(currentQIdx);

  const btnNext = document.getElementById('btnNextQuestion');
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      currentQIdx++;
      if (currentQIdx < quizQuestions.length) {
        renderQuestion(currentQIdx);
      } else {
        showQuizResults();
      }
    });
  }

  const btnRestart = document.getElementById('btnRestartQuiz');
  if (btnRestart) {
    btnRestart.addEventListener('click', () => {
      currentQIdx = 0;
      scoreCount = 0;
      document.getElementById('quizResultsCard').style.display = 'none';
      document.getElementById('quizQuestionSection').style.display = 'block';
      const liveScore = document.getElementById('quizLiveScore');
      if (liveScore) liveScore.innerText = `Skor: 0 poin`;
      renderQuestion(currentQIdx);
    });
  }
}

function renderQuestion(idx) {
  userHasChosen = false;
  const q = quizQuestions[idx];

  const progressText = document.getElementById('quizProgressText');
  const progressFill = document.getElementById('quizProgressFill');
  const topicBadge = document.getElementById('quizTopicBadge');
  const questionText = document.getElementById('quizQuestionText');
  const optionsList = document.getElementById('quizOptionsList');
  const feedbackBox = document.getElementById('quizFeedback');
  const btnNext = document.getElementById('btnNextQuestion');

  if (progressText) progressText.innerText = `Pertanyaan ${idx + 1} dari ${quizQuestions.length}`;
  if (progressFill) progressFill.style.width = `${((idx + 1) / quizQuestions.length) * 100}%`;
  if (topicBadge) topicBadge.innerText = q.topic;
  if (questionText) questionText.innerText = q.question;
  if (feedbackBox) feedbackBox.style.display = 'none';
  if (btnNext) btnNext.style.display = 'none';

  if (!optionsList) return;
  optionsList.innerHTML = '';

  q.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'quiz-choice-btn';
    btn.innerHTML = `<span style="font-weight: 700; color: var(--color-primary); background: var(--color-sand); border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;">${opt.letter}</span> <span>${opt.text}</span>`;
    btn.addEventListener('click', () => handleOptionClick(btn, opt, q));
    optionsList.appendChild(btn);
  });
}

function handleOptionClick(btnEl, option, question) {
  if (userHasChosen) return;
  userHasChosen = true;

  const allBtns = document.querySelectorAll('.quiz-choice-btn');
  allBtns.forEach(b => (b.disabled = true));

  const feedbackBox = document.getElementById('quizFeedback');
  const feedbackTitle = document.getElementById('quizFeedbackTitle');
  const feedbackText = document.getElementById('quizFeedbackText');
  const citationTag = document.getElementById('quizCitationTag');
  const btnNext = document.getElementById('btnNextQuestion');
  const liveScore = document.getElementById('quizLiveScore');

  if (option.correct) {
    scoreCount += 20;
    btnEl.classList.add('selected-correct');
    if (feedbackTitle) feedbackTitle.innerHTML = 'Analisis Tepat Berdasarkan Eviden';
  } else {
    btnEl.classList.add('selected-incorrect');
    if (feedbackTitle) feedbackTitle.innerHTML = 'Kurang Tepat &bull; Evaluasi Protokol';
  }

  if (liveScore) liveScore.innerText = `Skor: ${scoreCount} poin`;
  if (feedbackText) feedbackText.innerText = `${question.explanation} (${question.citation})`;
  if (feedbackBox) feedbackBox.style.display = 'block';
  if (btnNext) btnNext.style.display = 'inline-block';
}

function showQuizResults() {
  document.getElementById('quizQuestionSection').style.display = 'none';
  const resultsCard = document.getElementById('quizResultsCard');
  const scoreDisplay = document.getElementById('quizScoreDisplay');
  const badgeReward = document.getElementById('quizBadgeReward');
  const resultMessage = document.getElementById('quizResultMessage');

  if (scoreDisplay) scoreDisplay.innerText = `${scoreCount}%`;

  if (scoreCount >= 80) {
    if (badgeReward) badgeReward.innerText = 'Luar Biasa, Caregiver Sangat Kompeten!';
    if (resultMessage) resultMessage.innerText = 'Selamat! Seluruh prinsip penting pencegahan CAUTI, hukum gravitasi kantung, fiksasi paha, dan sirkuit tertutup telah Anda kuasai dengan sempurna berbasis bukti ilmiah terkini.';
  } else if (scoreCount >= 60) {
    if (badgeReward) badgeReward.innerText = 'Pemahaman Cukup Baik';
    if (resultMessage) resultMessage.innerText = 'Anda sudah memahami prinsip dasar perawatan kateter. Disarankan meninjau kembali Bab 02 mengenai faktor risiko dan Bab 03 mengenai SOP untuk mematangkan protokol keselamatan orang tua.';
  } else {
    if (badgeReward) badgeReward.innerText = 'Perlu Pemantapan Ulang Modul';
    if (resultMessage) resultMessage.innerText = 'Sangat dianjurkan untuk membaca kembali Bab 02 (Faktor Risiko) dan Bab 03 (SOP Kateter Foley) sebelum melakukan prosedur perawatan mandiri di rumah.';
  }

  if (resultsCard) resultsCard.style.display = 'block';
}

/* ==========================================================================
   4. DAILY CHECKLIST TRACKER
   ========================================================================== */
const CHECKLIST_KEY = 'carekateter_daily_checklist_atm';

function initDailyChecklist() {
  const checkboxes = document.querySelectorAll('.editorial-task-check');
  if (!checkboxes.length) return;

  const saved = localStorage.getItem(CHECKLIST_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      checkboxes.forEach((cb, idx) => {
        if (data[idx] !== undefined) cb.checked = data[idx];
      });
    } catch (e) {
      console.error(e);
    }
  }

  updateDailyMetrics();

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const states = [];
      checkboxes.forEach(c => states.push(c.checked));
      localStorage.setItem(CHECKLIST_KEY, JSON.stringify(states));
      updateDailyMetrics();
    });
  });

  const btnReset = document.getElementById('btnResetChecklist');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Reset seluruh checklist untuk memulai pemantauan hari baru?')) {
        checkboxes.forEach(c => (c.checked = false));
        localStorage.removeItem(CHECKLIST_KEY);
        updateDailyMetrics();
      }
    });
  }

  const btnPrint = document.getElementById('btnPrintChecklist');
  if (btnPrint) {
    btnPrint.addEventListener('click', () => window.print());
  }
}

function updateDailyMetrics() {
  const checkboxes = document.querySelectorAll('.editorial-task-check');
  const checked = document.querySelectorAll('.editorial-task-check:checked');
  const count = checked.length;
  const total = checkboxes.length;
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;

  const bar = document.getElementById('checklistProgressBar');
  const text = document.getElementById('checklistProgressText');

  if (bar) bar.style.width = `${pct}%`;
  if (text) text.innerText = `${pct}% Terpenuhi (${count} dari ${total} tindakan harian)`;
}

/* ==========================================================================
   5. SYMPTOM CHECKER TRIAGE
   ========================================================================== */
function initSymptomChecker() {
  const inputs = document.querySelectorAll('.symptom-editorial-check');
  if (!inputs.length) return;

  function evaluateSymptoms() {
    let hasCritical = false;
    let checkedCount = 0;

    inputs.forEach(input => {
      if (input.checked) {
        checkedCount++;
        if (input.dataset.critical === 'true') {
          hasCritical = true;
        }
      }
    });

    const outputBox = document.getElementById('symptomTriageOutput');
    const badgeEl = document.getElementById('triageBadge');
    const titleEl = document.getElementById('triageTitle');
    const descEl = document.getElementById('triageDesc');

    if (!outputBox) return;

    if (checkedCount === 0) {
      outputBox.style.borderColor = 'var(--color-sand-border)';
      outputBox.style.backgroundColor = 'var(--color-surface)';
      if (badgeEl) {
        badgeEl.style.color = 'var(--color-primary)';
        badgeEl.innerText = 'STATUS NORMAL';
      }
      if (titleEl) titleEl.innerText = 'Kondisi Perawatan Stabil';
      if (descEl) descEl.innerText = 'Tidak terdeteksi gejala klinis infeksi saluran kemih saat ini. Lanjutkan protokol pembersihan perineal rutin 2 kali sehari dan pantau aliran gravitasi kantung urine.';
    } else if (hasCritical || checkedCount >= 3) {
      outputBox.style.borderColor = 'var(--color-danger)';
      outputBox.style.backgroundColor = 'var(--color-danger-soft)';
      if (badgeEl) {
        badgeEl.style.color = 'var(--color-danger)';
        badgeEl.innerText = 'TANDA BAHAYA (RED FLAG)';
      }
      if (titleEl) titleEl.innerText = 'Perlu Konsultasi Medis Segera';
      if (descEl) descEl.innerText = 'Terdeteksi tanda infeksi sistemik akut atau sumbatan drainase. Jangan mencabut selang secara paksa. Segera bawa lansia ke IGD terdekat atau hubungi dokter urologi / perawat home care hari ini.';
    } else {
      outputBox.style.borderColor = 'var(--color-warning-border)';
      outputBox.style.backgroundColor = 'var(--color-warning-soft)';
      if (badgeEl) {
        badgeEl.style.color = 'var(--color-accent-deep)';
        badgeEl.innerText = 'PERHATIAN KHUSUS';
      }
      if (titleEl) titleEl.innerText = 'Terdapat Indikasi Iritasi Ringan';
      if (descEl) descEl.innerText = 'Periksa alur selang dari lekukan (kinking), bersihkan kembali meatus kelamin secara perlahan, dan cukupi asupan cairan minum. Bila keluhan bertahan >24 jam, konsultasikan ke tenaga medis.';
    }
  }

  inputs.forEach(i => i.addEventListener('change', evaluateSymptoms));
  evaluateSymptoms();
}

/* ==========================================================================
   6. SALIN SITASI APA 7 & TOAST NOTIFICATION
   ========================================================================== */
function copyCitation(citationText) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(citationText).then(() => {
      showToast("Sitasi APA 7th berhasil disalin ke clipboard!");
    }).catch(() => {
      fallbackCopy(citationText);
    });
  } else {
    fallbackCopy(citationText);
  }
}

function fallbackCopy(text) {
  const tempInput = document.createElement("textarea");
  tempInput.value = text;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand("copy");
  document.body.removeChild(tempInput);
  showToast("Sitasi APA 7th berhasil disalin!");
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById("toastNotification");
  if (!toast) return;
  toast.innerText = message;
  toast.classList.add("show");
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2800);
}

/* ==========================================================================
   7. FLOATING BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const btnTop = document.getElementById('btnBackToTop');
  if (!btnTop) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btnTop.classList.add('visible');
    } else {
      btnTop.classList.remove('visible');
    }
  }, { passive: true });

  btnTop.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
