<template>
    <div class="rosco-page">
        <Transition name="wrong-flash">
            <div v-if="wrongFlash" class="wrong-overlay"></div>
        </Transition>
        <div v-if="visible" class="overlay-content" :class="{ 'is-hiding': hiding }">
            <div class="game-screen">
                <div class="game-main">
                    <div class="wheel-wrapper">
                        <div class="rosco-wheel">
                            <div v-for="(ltr, i) in letters" :key="ltr.char" class="letter-bubble glass"
                                :class="[ltr.status, { active: currentIndex === i }]"
                                :style="{ ...letterPos(i), '--i': i }">{{ ltr.char }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="glass-info">
                <div class="info-bubble timer-bubble"
                    :class="{ warning: timeLeft <= 30 && timeLeft > 10, danger: timeLeft <= 10 }">
                    <span>{{ formattedTime }}</span>
                </div>
            </div>
            <div class="glass-info glass-info--right">
                <div class="info-bubble correct-bubble">
                    {{ correctCount }}
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { socket } from '../src/utils/ws.js';
import { getRosco, showRosco, hideRosco } from '../src/utils/fetch.js';

const WHEEL_SIZE = 800;
const RADIUS = 380;
const BUBBLE_SIZE = 64;

const alphabet = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');

const wordStatus = (w) => w.green ? 'correct' : w.red ? 'wrong' : w.orange ? 'passed' : 'pending';

const words = ref(alphabet.map((x, i) => ({ letter: x, index: i })));
const activeIndex = ref(0);
const timeLeft = ref(150);

const visible = ref(false);
const hiding = ref(false);
const wrongFlash = ref(false);

const doShow = () => {
    hiding.value = false;
    visible.value = true;
};
const doHide = () => {
    hiding.value = true;
    setTimeout(() => { visible.value = false; hiding.value = false; }, (26 * 30) + 400);
};

const triggerWrongFlash = () => {
    wrongFlash.value = true;
    setTimeout(() => { wrongFlash.value = false; }, 800);
};

const letters = computed(() => words.value.map(w => ({ char: w.letter, status: wordStatus(w) })));
const currentIndex = computed(() => activeIndex.value);
const correctCount = computed(() => words.value.filter(w => w.green).length);
const formattedTime = computed(() => {
    const t = Math.round(timeLeft.value);
    return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
});

const letterPos = (index) => {
    const total = words.value.length || 27;
    const center = WHEEL_SIZE / 2;
    const angle = ((index / total) * 360 - 90) * (Math.PI / 180);
    const x = center + RADIUS * Math.cos(angle);
    const y = center + RADIUS * Math.sin(angle);
    return {
        left: `${x - BUBBLE_SIZE / 2}px`,
        top: `${y - BUBBLE_SIZE / 2}px`,
    };
};

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const audioBuffers = {};
let tickingSource = null;

const loadBuffer = async (name, url) => {
    try {
        const res = await fetch(url);
        const arr = await res.arrayBuffer();
        audioBuffers[name] = await audioCtx.decodeAudioData(arr);
    } catch (e) { }
};

Promise.all([
    loadBuffer('correct', '/sounds/correct.aac'),
    loadBuffer('wrong', '/sounds/wrong.aac'),
    loadBuffer('passed', '/sounds/skip.aac'),
    loadBuffer('ticking', '/sounds/ticking.aac'),
    loadBuffer('intro', '/sounds/intro.aac'),
    loadBuffer('win', '/sounds/win.aac'),
]);

const resumeCtx = () => { if (audioCtx.state === 'suspended') audioCtx.resume(); };
window.addEventListener('click', resumeCtx, { once: true });
window.addEventListener('keydown', resumeCtx, { once: true });

const playSound = (name) => {
    const buf = audioBuffers[name];
    if (!buf) return;
    resumeCtx();
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    src.connect(audioCtx.destination);
    src.start(0);
};

const inited = ref(false);
const paused = ref(false);

const startTicking = () => {
    if (tickingSource) return;
    const buf = audioBuffers['ticking'];
    if (!buf) return;
    resumeCtx();
    tickingSource = audioCtx.createBufferSource();
    tickingSource.buffer = buf;
    tickingSource.loop = true;
    tickingSource.connect(audioCtx.destination);
    tickingSource.start(0);
};

const stopTicking = () => {
    if (!tickingSource) return;
    try { tickingSource.stop(); } catch (e) { }
    tickingSource.disconnect();
    tickingSource = null;
};

socket.on('show', () => { doShow(); playSound('intro'); });
socket.on('hide', () => doHide());

socket.on('time:update', ({ time }) => {
    timeLeft.value = time;
});

socket.on('update', (data) => {
    const prevInited = inited.value;
    const prevPaused = paused.value;
    const prevWords = words.value.map(w => ({ ...w }));
    if (data.words !== undefined) words.value = data.words;
    if (data.index !== undefined) activeIndex.value = data.index;
    if (data.inited !== undefined) inited.value = data.inited;
    if (data.paused !== undefined) paused.value = data.paused;
    if (data.time?.current !== undefined) timeLeft.value = data.time.current;

    const nowRunning = inited.value && !paused.value;
    const wasRunning = prevInited && !prevPaused;
    if (nowRunning && !wasRunning) startTicking();
    if (!nowRunning && wasRunning) stopTicking();

    const newWords = data.words ?? words.value;
    for (let i = 0; i < newWords.length; i++) {
        const prev = prevWords[i];
        const next = newWords[i];
        if (!prev || !next) continue;
        if (next.green && !prev.green) {
            playSound('correct');
            const newWords2 = data.words ?? words.value;
            if (newWords2.every(w => w.green)) { stopTicking(); playSound('win'); }
            break;
        }
        if (next.red && !prev.red) { playSound('wrong'); triggerWrongFlash(); stopTicking(); break; }
        if (next.orange && !prev.orange) { playSound('passed'); stopTicking(); break; }
    }
});

socket.connect();

(async () => {
    const d = await getRosco();
    if (!d || d.error) return;
    if (d.words !== undefined) words.value = d.words;
    if (d.index !== undefined) activeIndex.value = d.index;
    if (d.time?.current !== undefined) timeLeft.value = d.time.current;
    if (d.inited !== undefined) inited.value = d.inited;
    if (d.paused !== undefined) paused.value = d.paused;
    if (d.shown) doShow();
    if (inited.value && !paused.value) startTicking();
})();
</script>

<style scoped lang="less">
.rosco-page {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    // &::before {
    //     content: '';
    //     position: absolute;
    //     inset: 0;
    //     background: url('/img/mernosketti.png') no-repeat center;
    //     pointer-events: none;
    // }
}

.overlay-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;

    .letter-bubble {
        animation: bubblePopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) backwards;
        animation-delay: calc(var(--i) * 30ms);
    }

    .glass-info {
        animation: fadeSlideIn 0.35s ease both;
        animation-delay: calc(25 * 30ms);
    }

    &.is-hiding {
        .letter-bubble {
            animation: bubblePopOut 0.25s ease both;
            animation-delay: calc((24 - var(--i)) * 30ms);
        }

        .glass-info {
            animation: fadeSlideOut 0.2s ease both;
        }
    }
}

@keyframes bubblePopIn {
    0% {
        opacity: 0;
        transform: scale(0);
    }

    70% {
        opacity: 1;
        transform: scale(1.12);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes bubblePopOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0);
    }
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: scale(0.7);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeSlideOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.7);
    }
}

@keyframes fadeSlideIn {
    from {
        opacity: 0;
        transform: scale(0.7);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes fadeSlideOut {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.7);
    }
}

.game-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.game-main {
    display: flex;
    align-items: center;
    gap: 24px;
}

.wheel-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 800px;
    height: 800px;
    flex-shrink: 0;

    @media (max-width: 720px) {
        transform: scale(0.6);
        transform-origin: center top;
        margin-bottom: -200px;
    }
}

.rosco-wheel {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    height: 100%;
}

.letter-bubble {
    position: absolute;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: 900;
    color: #fff;
    user-select: none;
    isolation: isolate;
    transition: background .35s ease, box-shadow .35s ease, transform .6s cubic-bezier(0.34, 1.56, 0.64, 1);

    &.pending {
        background: linear-gradient(132deg, #3d48ef, #75b4f9);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
    }

    &.passed {
        background: linear-gradient(132deg, #bb840f, #ffd000);
        box-shadow: 0 0 14px rgba(217, 119, 6, 0.6);
    }

    &.correct {
        background: linear-gradient(132deg, #0c8a3a, #4fde4a);
        box-shadow: 0 0 16px rgba(22, 163, 74, 0.7);
    }

    &.wrong {
        background: linear-gradient(132deg, #ff0000, #f87171);
        box-shadow: 0 0 16px rgba(220, 38, 38, 0.7);
    }

    &.active {
        z-index: 2;
        transform: scale(1.4);

        &::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: #ffffff63;
            animation: activeBlink 1.2s step-start infinite;
            pointer-events: none;
        }
    }
}

.glass {
    overflow: visible;

    &::before {
        content: '';
        position: absolute;
        inset: -4px;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 0.25);
        pointer-events: none;
        z-index: -1;
    }
}

.wheel-inner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 520px;
    height: 520px;
    border-radius: 50%;
    background: rgba(7, 14, 28, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .avatar-svg {
        width: 110px;
        height: 110px;
        opacity: 0.6;
    }

    .wheel-brand {
        font-size: 11px;
        letter-spacing: 6px;
        color: rgba(255, 255, 255, 0.2);
        font-weight: 800;
        text-transform: uppercase;
        margin-top: 6px;
    }
}

@keyframes activeBlink {

    0%,
    49% {
        opacity: 1;
    }

    50%,
    100% {
        opacity: 0;
    }
}

.glass-info {
    position: fixed;
    bottom: calc(50% - 390px);
    left: calc(50% - 520px);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 5px;

    .info-bubble {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 55px;
        font-weight: 900;
        color: #fff;
    }

    .timer-bubble {
        background: linear-gradient(360deg, #1e2592, #387cc4);

        &.warning {
            background: linear-gradient(360deg, #d97706, #fbbf24);
        }

        &.danger {
            background: linear-gradient(360deg, #dc2626, #f87171);

            span {
                animation: activeBlink 1s step-start infinite;
            }
        }
    }
}

.correct-bubble {
    background: linear-gradient(360deg, #016626, #4ade80);
}

.glass-info--right {
    left: auto;
    right: calc(50% - 520px);
}

.wrong-overlay {
    position: fixed;
    inset: 0;
    background: rgba(220, 38, 38, 0.45);
    pointer-events: none;
    z-index: 9;
}

.wrong-flash-enter-active {
    animation: wrongFlashIn .12s ease-out;
}

.wrong-flash-leave-active {
    animation: wrongFlashOut .7s ease-in forwards;
}

@keyframes wrongFlashIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes wrongFlashOut {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}
</style>
