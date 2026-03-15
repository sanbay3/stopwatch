'use strict';

document.addEventListener('DOMContentLoaded', function() {
    // ========== ストップウォッチ機能 ==========
    const stopwatchDisplay = document.getElementById('stopwatch-display');
    const stopwatchStartBtn = document.getElementById('stopwatch-start');
    const stopwatchStopBtn = document.getElementById('stopwatch-stop');
    const stopwatchResetBtn = document.getElementById('stopwatch-reset');
    const stopwatchLapBtn = document.getElementById('stopwatch-lap');
    const lapList = document.getElementById('lap-list');

    let stopwatchTime = 0; // ミリ秒
    let stopwatchIntervalId = null;
    let lapTimes = [];

    // ストップウォッチの時間を表示形式に変換
    function formatStopwatchTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = Math.floor((ms % 1000) / 10);
        
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(2, '0')}`;
    }

    // ストップウォッチの更新
    function updateStopwatchDisplay() {
        stopwatchTime += 10;
        stopwatchDisplay.textContent = formatStopwatchTime(stopwatchTime);
    }

    // ストップウォッチスタート
    stopwatchStartBtn.addEventListener('click', function() {
        if (stopwatchIntervalId === null) {
            stopwatchIntervalId = setInterval(updateStopwatchDisplay, 10);
            stopwatchStartBtn.disabled = true;
            stopwatchStopBtn.disabled = false;
            stopwatchLapBtn.disabled = false;
        }
    });

    // ストップウォッチストップ
    stopwatchStopBtn.addEventListener('click', function() {
        if (stopwatchIntervalId !== null) {
            clearInterval(stopwatchIntervalId);
            stopwatchIntervalId = null;
            stopwatchStartBtn.disabled = false;
            stopwatchStopBtn.disabled = true;
            stopwatchLapBtn.disabled = true;
        }
    });

    // ストップウォッチリセット
    stopwatchResetBtn.addEventListener('click', function() {
        if (stopwatchIntervalId !== null) {
            clearInterval(stopwatchIntervalId);
            stopwatchIntervalId = null;
        }
        stopwatchTime = 0;
        stopwatchDisplay.textContent = formatStopwatchTime(0);
        stopwatchStartBtn.disabled = false;
        stopwatchStopBtn.disabled = true;
        stopwatchLapBtn.disabled = true;
        lapTimes = [];
        lapList.innerHTML = '';
    });

    // ラップタイム記録
    stopwatchLapBtn.addEventListener('click', function() {
        if (lapTimes.length < 10) {
            lapTimes.unshift({
                lap: lapTimes.length + 1,
                time: stopwatchTime
            });
            
            // 最大10件まで保持
            if (lapTimes.length > 10) {
                lapTimes = lapTimes.slice(0, 10);
            }
            
            updateLapList();
        }
    });

    // ラップタイムリストの更新
    function updateLapList() {
        lapList.innerHTML = '';
        lapTimes.forEach((lap, index) => {
            const li = document.createElement('li');
            const lapNumber = index === 0 ? `ラップ ${lap.lap} (最新)` : `ラップ ${lap.lap}`;
            li.innerHTML = `<span>${lapNumber}</span><span>${formatStopwatchTime(lap.time)}</span>`;
            lapList.appendChild(li);
        });
    }

    // ========== タイマー機能 ==========
    const timerDisplay = document.getElementById('timer-display');
    const minutesInput = document.getElementById('minutes');
    const secondsInput = document.getElementById('seconds');
    const timerStartBtn = document.getElementById('timer-start');
    const timerStopBtn = document.getElementById('timer-stop');
    const timerResetBtn = document.getElementById('timer-reset');

    let timerTime = 0; // 秒
    let timerIntervalId = null;
    let isTimerFinished = false;

    // タイマーの時間を表示形式に変換
    function formatTimerTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    // タイマーの更新
    function updateTimerDisplay() {
        if (timerTime > 0) {
            timerTime--;
            timerDisplay.textContent = formatTimerTime(timerTime);
        } else {
            // タイマー終了
            clearInterval(timerIntervalId);
            timerIntervalId = null;
            timerDisplay.textContent = '00:00';
            timerStartBtn.disabled = false;
            timerStopBtn.disabled = true;
            
            // 視覚的な通知
            if (!isTimerFinished) {
                isTimerFinished = true;
                document.body.classList.add('timer-finished');
            }
        }
    }

    // タイマースタート
    timerStartBtn.addEventListener('click', function() {
        if (timerIntervalId === null) {
            // 入力値から時間を取得
            const mins = parseInt(minutesInput.value) || 0;
            const secs = parseInt(secondsInput.value) || 0;
            timerTime = mins * 60 + secs;
            
            if (timerTime > 0) {
                // 終了状態をリセット
                if (isTimerFinished) {
                    isTimerFinished = false;
                    document.body.classList.remove('timer-finished');
                }
                
                timerDisplay.textContent = formatTimerTime(timerTime);
                timerIntervalId = setInterval(updateTimerDisplay, 1000);
                timerStartBtn.disabled = true;
                timerStopBtn.disabled = false;
                minutesInput.disabled = true;
                secondsInput.disabled = true;
            }
        }
    });

    // タイマーストップ
    timerStopBtn.addEventListener('click', function() {
        if (timerIntervalId !== null) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
            timerStartBtn.disabled = false;
            timerStopBtn.disabled = true;
            minutesInput.disabled = false;
            secondsInput.disabled = false;
        }
    });

    // タイマーリセット
    timerResetBtn.addEventListener('click', function() {
        if (timerIntervalId !== null) {
            clearInterval(timerIntervalId);
            timerIntervalId = null;
        }
        timerTime = 0;
        timerDisplay.textContent = formatTimerTime(0);
        minutesInput.value = 0;
        secondsInput.value = 0;
        timerStartBtn.disabled = false;
        timerStopBtn.disabled = true;
        minutesInput.disabled = false;
        secondsInput.disabled = false;
        
        // 終了状態をリセット
        if (isTimerFinished) {
            isTimerFinished = false;
            document.body.classList.remove('timer-finished');
        }
    });

    // 入力値の検証
    minutesInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        if (value < 0) value = 0;
        if (value > 99) value = 99;
        this.value = value;
    });

    secondsInput.addEventListener('input', function() {
        let value = parseInt(this.value) || 0;
        if (value < 0) value = 0;
        if (value > 59) value = 59;
        this.value = value;
    });

    // ========== タブ切り替え ==========
    const tabButtons = document.querySelectorAll('.tab-button');
    const panels = document.querySelectorAll('.panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // タブボタンの状態を更新
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // パネルの表示を切り替え
            panels.forEach(panel => panel.classList.remove('active'));
            document.getElementById(`${targetTab}-panel`).classList.add('active');
            
            // タイマーが実行中の場合は停止
            if (targetTab === 'stopwatch' && timerIntervalId !== null) {
                clearInterval(timerIntervalId);
                timerIntervalId = null;
                timerStartBtn.disabled = false;
                timerStopBtn.disabled = true;
                minutesInput.disabled = false;
                secondsInput.disabled = false;
            } else if (targetTab === 'timer' && stopwatchIntervalId !== null) {
                clearInterval(stopwatchIntervalId);
                stopwatchIntervalId = null;
                stopwatchStartBtn.disabled = false;
                stopwatchStopBtn.disabled = true;
                stopwatchLapBtn.disabled = true;
            }
        });
    });
});
