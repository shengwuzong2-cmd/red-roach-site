/**
 * 品質ページのロジック
 * - ロットデータ読み込み
 * - チャート描画
 * - 詳細表示
 */

let myLineChart = null;

// ダミーデータ生成（本番はデータベースから取得）
const mockData = [];
const startDate = new Date('2025-10-01');
for (let i = 0; i < 30; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    mockData.push({
        date: d.toISOString().split('T')[0],
        temp: (27 + Math.random() * 2).toFixed(1), // 27~29度
        hum: (45 + Math.random() * 10).toFixed(0), // 45~55%
        food: i % 2 === 0 ? "Organic Pumpkin & Komatsuna" : "High Protein Roach Chow", // 交互に餌を変える
        time: "14:30"
    });
}

/**
 * ロットデータの読み込み
 */
export function loadLotData() {
    const input = document.getElementById('lotInput').value;
    if (!input) {
        alert("Please enter Lot No.");
        return;
    }

    document.getElementById('resultArea').style.display = 'block';
    drawChart();
}

/**
 * チャートの描画
 */
function drawChart() {
    const ctx = document.getElementById('traceChart').getContext('2d');
    if (myLineChart) myLineChart.destroy();

    myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: mockData.map(d => d.date),
            datasets: [
                {
                    label: 'TEMP (°C)',
                    data: mockData.map(d => d.temp),
                    borderColor: '#ff4444',
                    backgroundColor: 'rgba(255, 68, 68, 0.1)',
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    yAxisID: 'y',
                    tension: 0.2
                },
                {
                    label: 'HUMIDITY (%)',
                    data: mockData.map(d => d.hum),
                    borderColor: '#00ccff',
                    backgroundColor: 'rgba(0, 204, 255, 0.1)',
                    borderWidth: 1,
                    pointRadius: 3,
                    pointHoverRadius: 6,
                    yAxisID: 'y1',
                    tension: 0.2
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            onClick: (e, elements) => {
                if (elements.length > 0) {
                    const index = elements[0].index;
                    showDetail(index);
                }
            },
            plugins: {
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                    borderColor: '#444',
                    borderWidth: 1
                },
                legend: { labels: { color: '#ccc' } }
            },
            scales: {
                x: { grid: { color: '#333' }, ticks: { color: '#888' } },
                y: {
                    type: 'linear', display: true, position: 'left',
                    grid: { color: '#333' }, ticks: { color: '#ff4444' }
                },
                y1: {
                    type: 'linear', display: true, position: 'right',
                    grid: { drawOnChartArea: false }, ticks: { color: '#00ccff' }
                }
            }
        }
    });
}

/**
 * 詳細パネルの表示
 * @param {number} index - データのインデックス
 */
function showDetail(index) {
    const data = mockData[index];
    const panel = document.getElementById('dailyDetail');

    document.getElementById('detailDate').innerText = data.date;
    document.getElementById('detailFood').innerText = data.food;
    document.getElementById('detailTime').innerText = data.time;
    document.getElementById('detailTemp').innerText = data.temp + "°C";
    document.getElementById('detailHum').innerText = data.hum + "%";

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * 初期化関数 - DOMContentLoadedで呼び出される
 */
export function initQualityPage() {
    console.log("Quality: Initializing quality page logic...");

    // SearchボタンのイベントリスナーSEARCHボタンのイベントリスナー
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', loadLotData);
    }

    // Enterキーでも検索できるように
    const lotInput = document.getElementById('lotInput');
    if (lotInput) {
        lotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                loadLotData();
            }
        });
    }

    // グローバル関数として公開（HTMLから呼び出せるように）
    window.loadLotData = loadLotData;
}

// DOMContentLoadedで初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initQualityPage);
} else {
    initQualityPage();
}
