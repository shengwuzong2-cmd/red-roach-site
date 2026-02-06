import { fetchSensorData } from '../utils/switchbot.js';

/**
 * ラボモニターシステムの初期化
 * - サイト全体の温度湿度表示を管理
 * - ページ固有のモニター要素を更新
 * - 1分ごとに自動更新
 */
export async function initLabMonitor() {
    console.log("Monitor: Initializing Lab Monitor...");

    // DOM要素の取得
    const monitorSection = document.getElementById('live-monitor');
    const statusText = document.getElementById('monitor-status');
    const siteTemp = document.getElementById('site-temp');
    const siteHum = document.getElementById('site-hum');

    // ホームページのモニターセクションにIntersection Observerを設定
    if (monitorSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log("Monitor: Main section visible, animating...");
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        observer.observe(monitorSection);
    }

    // モニタリング開始
    startMonitoring();

    /**
     * モニタリングシステムの起動
     */
    async function startMonitoring() {
        console.log("Monitor: Connecting to telemetry stream...");

        // ステータステキストの更新
        if (statusText) {
            statusText.textContent = "ESTABLISHING CONNECTION...";
            await new Promise(r => setTimeout(r, 1000));
            statusText.textContent = "• LIVE TELEMETRY ACTIVE";
            statusText.style.color = "#800020";
            statusText.style.fontWeight = "bold";
        }

        // 初回更新と定期更新の設定
        updateLoop();
        setInterval(updateLoop, 60000); // 1分ごとに更新
    }

    /**
     * センサーデータの取得と表示更新
     */
    async function updateLoop() {
        try {
            const data = await fetchSensorData();
            updateUI(data);
        } catch (error) {
            console.error("Monitor Update Error:", error);
            // エラー時はステータステキストを更新
            if (statusText) {
                statusText.textContent = "CONNECTION ERROR - RETRYING...";
                statusText.style.color = "#999";
            }
        }
    }

    /**
     * UI要素の更新
     * @param {Object} data - センサーデータ {temp, humidity}
     */
    function updateUI(data) {
        // データが無効な場合は更新をスキップ
        if (!data || (data.temp === "--" && data.humidity === "--")) {
            console.warn("Monitor: Invalid sensor data received");
            return;
        }

        // 1. サイト全体のピル表示を更新
        if (siteTemp) siteTemp.textContent = data.temp;
        if (siteHum) siteHum.textContent = data.humidity;

        // 2. ホームページの各ロット表示を更新（バリエーション付き）
        updateHomeLots(data);

        // 3. Qualityページの表示を更新
        updateQualityPage(data);
    }

    /**
     * ホームページのロット表示を更新
     * @param {Object} data - センサーデータ
     */
    function updateHomeLots(data) {
        const targets = ['a', 'b', 'c'];

        targets.forEach((id, index) => {
            let tValue = data.temp;
            let hValue = data.humidity;

            // ロットごとの微妙な差異をシミュレート
            if (typeof tValue === 'number') {
                if (index === 1) {
                    tValue = (tValue - 0.7).toFixed(1);
                    hValue = hValue - 3;
                } else if (index === 2) {
                    tValue = (tValue - 0.3).toFixed(1);
                    hValue = hValue - 1;
                }
            }

            // DOM要素の更新
            const tEl = document.getElementById(`temp-${id}`);
            const hEl = document.getElementById(`hum-${id}`);
            const ringEl = document.getElementById(`ring-${id}`);

            if (tEl) tEl.innerHTML = `${tValue}<span class="unit">°C</span>`;
            if (hEl) hEl.innerHTML = `${hValue}<span class="unit">%</span>`;
            if (ringEl && typeof hValue === 'number') {
                setRingProgress(ringEl, hValue);
            }
        });
    }

    /**
     * Qualityページの表示を更新
     * @param {Object} data - センサーデータ
     */
    function updateQualityPage(data) {
        const qTemp = document.getElementById('temp-q');
        const qHum = document.getElementById('hum-q');

        if (qTemp) qTemp.innerHTML = `${data.temp}<span class="unit">°C</span>`;
        if (qHum) qHum.innerHTML = `${data.humidity}<span class="unit">%</span>`;
    }

    /**
     * SVGリングの進捗表示を設定
     * @param {SVGCircleElement} circle - SVGサークル要素
     * @param {number} percent - パーセンテージ（0-100）
     */
    function setRingProgress(circle, percent) {
        if (!circle || !circle.r || !circle.r.baseVal) return;

        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        const offset = circumference - (percent / 100) * circumference;

        circle.style.transition = 'stroke-dashoffset 2s ease-out';
        circle.style.strokeDashoffset = offset;
    }
}
