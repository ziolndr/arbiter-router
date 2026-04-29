const API = 'https://api.arbiter.traut.ai/public/compare';

// ============ INITIALIZATION ============
const savedTheme = localStorage.getItem('arbiter-theme') || 'dark';
document.documentElement.dataset.theme = savedTheme;

function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('arbiter-theme', next);
}

// ============ SUBSTRATES ============
const SUBSTRATES = [
  { id: 0, code: 'QU', name: 'Quantum' },
  { id: 1, code: 'AI', name: 'AI/LLM' },
  { id: 2, code: 'NE', name: 'Neuromorphic' },
  { id: 3, code: 'HP', name: 'HPC Service' },
  { id: 4, code: 'DS', name: 'Dask/Spark' },
  { id: 5, code: 'HB', name: 'HPC Batch' }
];

const CANDIDATES = [
  "QPU qubit entanglement superposition Hilbert space wavefunction eigenstate unitary operator Hamiltonian decoherence Bell state variational ansatz quantum annealing Pauli matrix",
  "transformer large language model token embedding attention inference generation prompt reasoning schema extraction natural language structured output document",
  "neuromorphic spike timing synaptic event-driven edge inference sub-millisecond asynchronous low-power streaming continuous sensor anomaly",
  "NVIDIA CUDA driver cuBLAS cuDNN PTX SASS GPU accelerator VRAM PCIe interconnect multiprocessor occupancy register file shared memory throughput profiling nsight compute",
  "Dask Spark dataframe DAG task graph shuffle partition executor worker distributed aggregation cloud-native lazy evaluation parallel scaling",
  "LSF PBS Slurm cron job queue sequential deterministic idempotent checkpoint restart end-of-day serial single-threaded overnight batch non-parallel"
];

const WORKLOAD_GROUPS = [
  {
    label: 'Financial Services',
    items: [
      { code: 'FIN-Q', label: 'Quantum Credit Risk', sub: 'QPU / portfolio optimization', query: 'QPU qubit Hamiltonian eigenstate unitary operator Bell state Pauli matrix superposition entanglement wavefunction decoherence variational ansatz quantum annealing Hilbert space' },
      { code: 'REG', label: 'Regulatory Summarization', sub: 'AI / natural language', query: 'transformer attention head token embedding autoregressive generation prompt inference reasoning chain schema extraction natural language output structured document' },
      { code: 'SUR', label: 'Trade Surveillance Stream', sub: 'neuromorphic / sub-ms', query: 'spike timing dependent plasticity synaptic weight event-driven edge silicon sub-millisecond neuromorphic inference low-power asynchronous streaming continuous sensor signal' },
      { code: 'VAR', label: 'Monte Carlo VaR', sub: 'GPU / stochastic simulation', query: 'NVIDIA CUDA cuBLAS GPU accelerator VRAM multiprocessor occupancy nsight profiling PTX kernel throughput Monte Carlo stochastic path simulation high throughput batch processing' },
      { code: 'PRT', label: 'Portfolio Analytics', sub: 'Dask / distributed dataframe', query: 'Dask dataframe DAG task graph shuffle partitioned executor worker cloud-native lazy evaluation distributed memory aggregation parallel pandas scaling' },
      { code: 'EOD', label: 'Overnight Batch Risk', sub: 'scheduler / serial batch', query: 'LSF PBS Slurm cron scheduler job queue sequential single-threaded deterministic idempotent checkpoint restart end-of-day EOD non-parallel overnight run serial execution' }
    ]
  },
  {
    label: 'Defense + ISR',
    items: [
      { code: 'J2', label: 'Multi-INT Fusion', sub: 'AI / evidence synthesis', query: 'multi intelligence fusion SIGINT HUMINT IMINT OSINT document extraction entity resolution natural language report generation transformer attention reasoning chain structured intelligence summary' },
      { code: 'EDGE', label: 'Edge Sensor Anomaly', sub: 'neuromorphic / event stream', query: 'event driven sensor stream asynchronous spike timing low power edge anomaly detection sub millisecond response continuous signal neuromorphic inference' },
      { code: 'SIM', label: 'Wargame Simulation', sub: 'GPU / HPC simulation', query: 'GPU accelerated Monte Carlo simulation CUDA multiprocessing scenario generation stochastic rollout massive parallel compute throughput battlefield model ensemble' },
      { code: 'SAT', label: 'Satellite Image Batch', sub: 'batch / scheduled ingest', query: 'scheduled overnight imagery ingest batch processing checkpoint restart deterministic queue cron Slurm PBS satellite archive non interactive pipeline' }
    ]
  },
  {
    label: 'Healthcare + Bio',
    items: [
      { code: 'CLN', label: 'Clinical Literature Review', sub: 'AI / document reasoning', query: 'clinical trial literature review transformer natural language extraction structured evidence summary medical abstract reasoning citation candidate generation' },
      { code: 'GEN', label: 'Genomic Variant Sweep', sub: 'Dask / distributed analytics', query: 'distributed dataframe partition worker executor genomic variant annotation large table aggregation parallel scaling Spark Dask lazy evaluation shuffle' },
      { code: 'MOL', label: 'Molecular Docking Batch', sub: 'HPC batch / queued jobs', query: 'batch molecular docking queue scheduler Slurm PBS checkpoint restart deterministic overnight compute job array serial execution end of day pipeline' },
      { code: 'FOLD', label: 'Protein Folding Simulation', sub: 'GPU / HPC service', query: 'CUDA GPU accelerator VRAM tensor core molecular dynamics simulation high throughput kernel occupancy multiprocessor profiling parallel compute' }
    ]
  },
  {
    label: 'Infrastructure + Software',
    items: [
      { code: 'LOG', label: 'Incident Log Triage', sub: 'AI / summarization', query: 'large language model log summarization incident report natural language extraction root cause structured output token embedding transformer attention' },
      { code: 'OBS', label: 'Telemetry Spike Detector', sub: 'neuromorphic / realtime', query: 'real time telemetry spike event driven asynchronous sub millisecond anomaly detection streaming sensor signal low power edge inference' },
      { code: 'ETL', label: 'Distributed ETL', sub: 'Dask / Spark', query: 'Spark Dask dataframe ETL DAG task graph partition shuffle distributed worker executor cloud native parallel aggregation lazy evaluation' },
      { code: 'BKUP', label: 'Nightly Backup Job', sub: 'batch / scheduled', query: 'cron scheduler nightly backup deterministic sequential idempotent checkpoint restart queue batch non parallel overnight file archive job' }
    ]
  },
  {
    label: 'Energy + Industrial',
    items: [
      { code: 'GRID', label: 'Grid Load Forecast', sub: 'Dask / distributed', query: 'distributed time series forecast grid load partitioned dataframe Spark Dask aggregation worker executor parallel scaling cloud native' },
      { code: 'TURB', label: 'Turbine Vibration Alert', sub: 'neuromorphic / edge stream', query: 'vibration sensor continuous stream edge anomaly spike timing event driven asynchronous sub millisecond neuromorphic low power inference' },
      { code: 'RES', label: 'Reservoir Simulation', sub: 'GPU / HPC service', query: 'CUDA GPU reservoir simulation multiphysics numerical solver VRAM high throughput kernel occupancy parallel compute accelerator' },
      { code: 'MAINT', label: 'Maintenance Report Parse', sub: 'AI / extraction', query: 'transformer natural language maintenance report extraction structured output document reasoning token embedding attention summarization' }
    ]
  }
];

// ============ STATE ============
let WORKLOADS = [];
let currentQueryCache = new Map();
let queryHistory = [];
let latestQuery = '';
let latestConfidence = '—';
let latestLatency = '—';

const MAX_HISTORY = 10;

// ============ INITIALIZATION ============
function initialize() {
  buildSidebar();
  renderRouteCards();
  loadHistory();
  setupKeyboardShortcuts();
  setupSidebarSearch();

  const params = new URLSearchParams(window.location.search);
  const sharedQuery = params.get('q');

  if (sharedQuery) {
    document.getElementById('custom-input').value = sharedQuery;
    executeRoute(sharedQuery);
  } else {
    selectWorkload(0);
  }
}

// ============ SIDEBAR MANAGEMENT ============
function buildSidebar() {
  const container = document.getElementById('sidebar-content');
  let html = '';
  let index = 0;

  WORKLOAD_GROUPS.forEach(group => {
    html += `<div class="sidebar-group-label">${group.label}</div>`;
    group.items.forEach(item => {
      WORKLOADS.push(item);
      html += `
        <div class="workload-item ${index === 0 ? 'active' : ''}" onclick="selectWorkload(${index})" data-index="${index}" data-label="${item.label.toLowerCase()}">
          <div class="workload-badge">${item.code}</div>
          <div class="workload-text">
            <div class="workload-label">${item.label}</div>
            <div class="workload-sub">${item.sub}</div>
          </div>
        </div>
      `;
      index++;
    });
  });

  container.innerHTML = html;
}

function setupSidebarSearch() {
  const searchInput = document.getElementById('sidebar-search');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    document.querySelectorAll('.workload-item').forEach(item => {
      const label = item.dataset.label || '';
      item.classList.toggle('hidden', !label.includes(query));
    });
  });
}

// ============ ROUTE CARDS ============
function renderRouteCards() {
  const container = document.getElementById('routes-container');
  let html = '';

  SUBSTRATES.forEach(substrate => {
    html += `
      <div class="route-card" id="card-${substrate.id}">
        <div class="rc-code">${substrate.code}</div>
        <div class="rc-name">${substrate.name}</div>
        <div class="rc-score" id="score-${substrate.id}">—</div>
        <div class="rc-bar">
          <div class="rc-bar-fill" id="bar-${substrate.id}"></div>
        </div>
        <div class="rc-badge" id="badge-${substrate.id}">Standby</div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ============ WORKLOAD SELECTION ============
function selectWorkload(idx) {
  document.querySelectorAll('.workload-item').forEach((el, i) => {
    el.classList.toggle('active', i === idx);
  });

  const w = WORKLOADS[idx];
  document.getElementById('custom-input').value = w.query;
  routeIntent();
}

// ============ ROUTING ============
function routeIntent() {
  const query = document.getElementById('custom-input').value.trim();
  if (!query) return;

  document.querySelectorAll('.workload-item').forEach(el => el.classList.remove('active'));
  executeRoute(query);
}

async function executeRoute(query) {
  const btn = document.getElementById('route-btn');
  const loader = document.getElementById('loading-indicator');

  latestQuery = query;

  btn.disabled = true;
  loader.classList.add('active');

  document.getElementById('route-result').classList.remove('active');
  updateCurlDisplay(query);
  resetRouteCards();

  if (currentQueryCache.has(query)) {
    const cached = currentQueryCache.get(query);
    renderRouteResult(cached.data, cached.latency, query);
    btn.disabled = false;
    loader.classList.remove('active');
    return;
  }

  const t0 = Date.now();

  try {
    const response = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, candidates: CANDIDATES })
    });

    const data = await response.json();
    const latency = Date.now() - t0;

    currentQueryCache.set(query, { data, latency });
    if (currentQueryCache.size > 50) {
      const firstKey = currentQueryCache.keys().next().value;
      currentQueryCache.delete(firstKey);
    }

    renderRouteResult(data, latency, query);
    addToHistory(query);

  } catch (error) {
    showError(error.message);
  }

  btn.disabled = false;
  loader.classList.remove('active');
}

// ============ RESULT RENDERING ============
function renderRouteResult(data, latency, query) {
  const all = data.all || data.top || [];

  const scores = all.map((c, idx) => {
    const substrateIdx = CANDIDATES.findIndex(cand =>
      c.text && cand && c.text.trim().slice(0, 40) === cand.trim().slice(0, 40)
    );

    return {
      substrate: substrateIdx >= 0 ? substrateIdx : idx % SUBSTRATES.length,
      score: c.score,
      text: c.text
    };
  });

  const sorted = [...scores].sort((a, b) => b.score - a.score);
  const winner = sorted[0].substrate;
  const maxScore = sorted[0].score;
  const gap = sorted.length > 1 ? (sorted[0].score - sorted[1].score) : sorted[0].score;
  const confidence = calculateConfidence(gap);
  const confidencePct = maxScore ? Math.round((gap / maxScore) * 100) : 0;

  latestConfidence = confidence;
  latestLatency = latency + 'ms';

  document.getElementById('footer-api-ms').textContent = latestLatency;
  document.getElementById('footer-confidence').textContent = latestConfidence;

  scores.forEach(s => {
    const substrate = SUBSTRATES[s.substrate];
    if (!substrate) return;

    const pct = maxScore > 0 ? (s.score / maxScore) * 100 : 0;
    const isWinner = s.substrate === winner;

    const card = document.getElementById('card-' + s.substrate);
    card.classList.toggle('winner', isWinner);

    document.getElementById('score-' + s.substrate).textContent = s.score.toFixed(4);
    document.getElementById('bar-' + s.substrate).style.width = pct + '%';

    const badge = document.getElementById('badge-' + s.substrate);
    badge.textContent = isWinner ? `Route · ${confidence}` : 'Standby';
  });

  const winnerSubstrate = SUBSTRATES[winner];
  document.getElementById('route-result').textContent = `${winnerSubstrate.name} / ${maxScore.toFixed(4)}`;
  document.getElementById('route-result').classList.add('active');

  document.getElementById('confidence-pct').textContent = confidence;
  document.getElementById('confidence-fill').style.width = Math.min(confidencePct * 2.5, 100) + '%';
  document.getElementById('latest-latency').textContent = latency + 'ms';

  renderCandidates(sorted, maxScore);

  document.getElementById('result-card').classList.add('active');
  document.getElementById('result-badge').textContent = winnerSubstrate.name;
  document.getElementById('result-badge').style.color = getSubstrateColor(winner);

  const resultJSON = {
    route: winnerSubstrate.name,
    score: maxScore.toFixed(4),
    gap: gap.toFixed(4),
    confidence,
    latency_ms: latency,
    engine: '<1ms',
    mode: 'semantic routing'
  };

  document.getElementById('result-body').textContent = JSON.stringify(resultJSON, null, 2);
  document.getElementById('candidate-meta').textContent = `${all.length} candidates`;
  document.getElementById('api-meta').textContent = `${latency}ms API latency`;
}

function renderCandidates(sorted, maxScore) {
  const html = sorted.map((s, i) => {
    const isTop = i === 0;
    const pct = maxScore > 0 ? (s.score / maxScore) * 100 : 0;

    return `
      <div class="candidate-row ${isTop ? 'top' : ''}" style="--route-color:${getSubstrateColor(s.substrate)}">
        <div class="candidate-num">${i + 1}</div>
        <div class="candidate-body">
          <div class="candidate-text">${s.text}</div>
          <div class="candidate-bar-wrap">
            <div class="candidate-bar" style="width:${pct}%"></div>
          </div>
        </div>
        <div class="candidate-score">${s.score.toFixed(4)}</div>
      </div>
    `;
  }).join('');

  document.getElementById('candidate-list').innerHTML = html;
}

function resetRouteCards() {
  SUBSTRATES.forEach(s => {
    const card = document.getElementById('card-' + s.id);
    card.classList.remove('winner');
    document.getElementById('score-' + s.id).textContent = '—';
    document.getElementById('bar-' + s.id).style.width = '0%';
    document.getElementById('badge-' + s.id).textContent = 'Standby';
  });
}

// ============ UTILITY FUNCTIONS ============
function calculateConfidence(gap) {
  if (gap > 0.25) return 'HIGH';
  if (gap > 0.1) return 'MODERATE';
  return 'LOW';
}

function getSubstrateColor(idx) {
  const colors = ['#6366f1', '#2563eb', '#059669', '#d97706', '#dc2626', '#16a34a'];
  return colors[idx] || '#0969da';
}

function updateCurlDisplay(query) {
  const short = query.length > 60 ? query.slice(0, 60) + '...' : query;
  const curlCmd = `curl -X POST https://api.arbiter.traut.ai/public/compare \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "${short}",
    "candidates": [
      "QPU qubit Hamiltonian eigenstate...",
      "transformer attention token embedding...",
      "neuromorphic spike timing event-driven...",
      "NVIDIA CUDA GPU VRAM multiprocessor...",
      "Dask Spark dataframe DAG task graph...",
      "LSF PBS Slurm cron job queue..."
    ]
  }'`;

  document.getElementById('curl-block').textContent = curlCmd;
}

function showError(message) {
  document.getElementById('result-card').classList.add('active');
  document.getElementById('result-badge').textContent = 'Error';
  document.getElementById('result-body').textContent = `API Error: ${message}`;
}

// ============ HISTORY ============
function addToHistory(query) {
  if (!queryHistory.includes(query)) {
    queryHistory.unshift(query);
    if (queryHistory.length > MAX_HISTORY) queryHistory.pop();
    saveHistory();
    renderHistory();
  }
}

function saveHistory() {
  localStorage.setItem('arbiter-history', JSON.stringify(queryHistory));
}

function loadHistory() {
  const saved = localStorage.getItem('arbiter-history');
  queryHistory = saved ? JSON.parse(saved) : [];
  renderHistory();
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[char]));
}

function renderHistory() {
  const container = document.getElementById('history-container');
  if (queryHistory.length === 0) {
    container.innerHTML = '';
    return;
  }

  const html = queryHistory.slice(0, 5).map((query, index) => `
    <div class="history-item" onclick="loadHistoryQuery(${index})" title="${escapeHTML(query)}">
      ${escapeHTML(query.slice(0, 30))}${query.length > 30 ? '...' : ''}
    </div>
  `).join('');

  container.innerHTML = '<div style="width:100%;margin-top:12px;padding:8px 12px;border-bottom:1px solid var(--border-muted);font-size:10px;color:var(--text-tertiary);font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">Recent</div>' + html;
}

function loadHistoryQuery(index) {
  const query = queryHistory[index];
  if (!query) return;

  document.getElementById('custom-input').value = query;
  routeIntent();
}

// ============ KEYBOARD SHORTCUTS ============
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      routeIntent();
    }

    if (e.key === 'Escape') {
      document.getElementById('custom-input').value = '';
    }
  });
}

// ============ COPY FUNCTIONS ============
async function writeToClipboard(text) {
  if (!text) return false;

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);

    return copied;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

async function copyCurl(btn) {
  const text = document.getElementById('curl-block')?.textContent || '';
  const ok = await writeToClipboard(text);
  showCopyState(btn, ok);
}

async function copyJSON(btn) {
  const text = document.getElementById('result-body')?.textContent || '';
  const ok = await writeToClipboard(text);
  showCopyState(btn, ok);
}

async function copyShareLink(btn) {
  const query = document.getElementById('custom-input')?.value.trim() || latestQuery;

  if (!query) {
    showCopyState(btn, false);
    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set('q', query);

  const ok = await writeToClipboard(url.toString());
  showCopyState(btn, ok);
}

function showCopyState(btn, ok) {
  if (!btn) return;

  const original = btn.dataset.originalText || btn.textContent;
  btn.dataset.originalText = original;

  btn.textContent = ok ? 'Copied' : 'Failed';
  btn.classList.toggle('success', ok);
  btn.classList.toggle('error', !ok);

  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove('success', 'error');
  }, 1500);
}

// ============ START ============
initialize();
