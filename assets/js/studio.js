"use strict";

(function () {
    const bootNode = document.getElementById("studio-boot-data");
    if (!bootNode) {
        return;
    }

    let studioData;
    try {
        studioData = JSON.parse(bootNode.textContent || "{}");
    } catch (err) {
        console.error("Failed to parse studio boot data:", err);
        return;
    }

    const audioMeta = studioData.audio || {};
    const segments = Array.isArray(studioData.segments) ? studioData.segments : [];

    // Bilingual UI Dictionary (Default: 'ja', with all English pledge & vocabulary kept in English)
    const I18N = {
        ja: {
            pageTitle: "The Nightingale Pledge — 赤十字看護学校 発音・リズム練習スタジオ",
            headerTitle: "The Nightingale Pledge — 発音・リズム練習スタジオ",
            headerSubtitle: "赤十字看護学校 — ネイティブ音声による発音・リズム・イントネーション練習",
            helpBtn: "使い方ガイド",
            playheadLabel: "再生位置",
            selectionLabel: "選択範囲",
            fullTrackSelectionText: "全体（波形をドラッグ、または下のフレーズをタップして範囲選択）",
            zoomIn: "＋ 拡大",
            zoomOut: "－ 縮小",
            zoomSel: "🔍 選択範囲に合わせる",
            zoomFit: "⇄ 全体表示",
            clearSel: "✕ 選択解除",
            overviewLabel: "全体トラック (59.4秒) — タップ・ドラッグで表示位置を移動",
            waveformTip: "💡 波形をドラッグして範囲を選択 • 黄色い <strong>IN ◄</strong> / <strong>► OUT</strong> タブで微調整",
            nudgeStartLabel: "開始位置 (IN)",
            nudgeEndLabel: "終了位置 (OUT)",
            playBtn: "再生",
            playSelectionBtn: "選択範囲を再生",
            pauseBtn: "一時停止",
            cancelWaitBtn: "待機をキャンセル",
            replayHighlight: "↺ 選択範囲を最初から",
            stopAndReady: "■ 停止して開始位置へ",
            whenSelectionEnds: "選択範囲の再生が終わったとき：",
            modeStopReady: "⏹ 1回再生して待機",
            modeShadow: "🗣 反復の間を空ける",
            modeLoop: "🔁 連続ループ再生",
            speedLabel: "再生スピード（声の高さ維持）",
            slow: "ゆっくり",
            fast: "速い",
            vocabFocusLabel: "🎯 重要単語・フレーズ集中練習：",
            savedHighlightsLabel: "⭐ マイ保存リスト：",
            saveCurrentHighlight: "＋ 現在の選択範囲を保存",
            emptyBookmarksText: "波形上で練習したい部分を選択し、「＋ 現在の選択範囲を保存」を押すとここに登録されます。",
            removeBookmarkTitle: "この保存を削除",
            scriptSectionTitle: "The Nightingale Pledge — フレーズ別練習リスト",
            scriptSectionSubtitle: "練習したいフレーズや文をタップすると、波形上で自動選択されてすぐに再生されます。",
            selectSentenceBtnPrefix: "▶ この文全体を選択して再生",
            voiceMirrorTitle: "🎙 自分の声を録音して比較（セルフチェック）",
            voiceMirrorSubtitle: "自分の暗唱を録音して、先生の発音やリズムと聴き比べることができます。",
            recordStartBtn: "● 自分の声を録音する",
            recordStopBtn: "■ 録音を停止する",
            guideTitle: "📖 自宅での効果的な練習方法",
            guideSubtitle: "iPad・タブレット・スマートフォン・パソコンすべてに対応しています。",
            guideItem1: "<strong>波形の好きな部分をハイライト選択：</strong> 青い波形の上を指やマウスでドラッグすると、1単語だけでも、1フレーズでも自由に選択できます。",
            guideItem2: "<strong>「1回再生して待機」モード（初期設定）：</strong> 選択範囲を再生すると、<strong>選んだ部分の最後で自動的に一時停止し、再生位置が選択範囲の先頭に自動で戻ります</strong>。自分のペースで発音練習をしてから、もう一度再生ボタンを押すだけですぐに同じ箇所を聴き直せます。",
            guideItem3: "<strong>選択範囲の微調整：</strong> 波形上の黄色い <strong>IN ◄</strong> と <strong>► OUT</strong> タブをドラッグするか、<strong>-0.1s / +0.1s</strong> ボタンで細かく調整できます。",
            guideItem4: "<strong>声の高さを変えずに速度変更：</strong> <strong>0.65×</strong>、<strong>0.75×</strong>、<strong>0.85×</strong> を選ぶと、自然な声のままゆっくり発音を確認できます。",
            guideItem5: "<strong>キーボードショートカット（PC / iPadキーボード）：</strong> <span class=\"kbd-badge\">Space</span> で再生/一時停止、<span class=\"kbd-badge\">R</span> で選択範囲を最初から再生、<span class=\"kbd-badge\">Esc</span> で選択解除。",
            statusReadyInitial: "準備完了 — 波形をドラッグするか下のフレーズをタップしてください",
            statusSelectionReady: "選択完了・再生待機中",
            statusSelectionAdjusted: "選択範囲を調整しました",
            statusPausedAt: "一時停止中：",
            statusStoppedReadyHighlight: "再生待機中（選択範囲の先頭に戻りました）",
            statusStoppedResetStart: "停止・先頭（0:00.00）に戻りました",
            statusShadowWaiting: "あなたの番です：声に出して繰り返してみましょう…",
            statusPlayingSelection: "選択範囲を再生中",
            statusPlayingFull: "全体を再生中",
            statusFinishedReset: "再生終了 — 先頭（0:00.00）に戻りました",
            statusSelectionCleared: "選択を解除しました — 全体再生モード",
            shadowCountdownFormat: "あなたの番です！声に出して練習しましょう（あと {sec} 秒で再再生）",
            captionReadyTag: "準備完了 • The Nightingale Pledge",
            captionReadyText: "波形をドラッグして単語やフレーズを選択するか、下のリストをタップしてください。",
            captionReadyHint: "初期設定：「1回再生して待機」モード（選択範囲の最後で自動停止し、開始位置に戻って次の再生に備えます）",
            captionFocusedTag: "集中練習範囲",
            captionCustomWaveformText: "波形上のカスタム選択範囲",
            captionPronunciationFocus: "発音・アクセントの目安: ",
            captionCustomHighlightTag: "カスタム選択範囲",
            captionCustomHighlightText: "波形上の選択範囲がセットされました — 「選択範囲を再生」またはスペースキーを押してください。",
            captionCustomHighlightHint: "ヒント：波形上の黄色い IN ◄ / ► OUT タブをドラッグして範囲を微調整できます。",
            modalCloseBtn: "閉じる",
            helpModalTitle: "使い方ガイド — The Nightingale Pledge 練習スタジオ",
            helpModalHtml:
                "<p>このアプリは、<strong>The Nightingale Pledge（ナイチンゲール誓詞）</strong>の正しい英語の発音・リズム・息継ぎ（ポーズ）を自宅で自由に練習できるように設計されています。</p>" +
                "<ol style=\"padding-left:1.2rem; display:flex; flex-direction:column; gap:0.55rem;\">" +
                "<li><strong>部分選択（ハイライト）：</strong> 画面上部の青い波形を指やマウスでなぞるか、画面下のフレーズ一覧・重要単語ボタンをタップすると、その部分だけが黄色くハイライトされます。</li>" +
                "<li><strong>1回再生して自動待機（初期モード）：</strong> 「選択範囲を再生」を押すと、ハイライトされた部分だけを再生して<strong>自動的にストップし、再生カーソルがハイライトの先頭に戻ります</strong>。連続ループに追われることなく、自分のペースで声に出して練習し、もう一度ボタンを押して何度でも聴き直せます。</li>" +
                "<li><strong>3つの再生モード：</strong><br>• <strong>⏹ 1回再生して待機：</strong> 1回再生後に先頭で一時停止します。<br>• <strong>🗣 反復の間を空ける：</strong> お手本再生のあと、同じ秒数だけ自動でポーズが入るので、その間にシャドーイング（復唱）できます。<br>• <strong>🔁 連続ループ再生：</strong> 選択範囲をノンストップで繰り返し再生します。</li>" +
                "<li><strong>速度調整：</strong> 0.5×〜1.15×まで、先生の声の高さを変えずにスピードだけを変えられます。</li>" +
                "</ol>",
            micUnsupportedTitle: "マイク録音をご利用いただけません",
            micUnsupportedBody: "お使いのブラウザまたは環境ではマイク録音機能（MediaDevices API）がサポートされていません。",
            micPermissionTitle: "マイクへのアクセスが許可されていません",
            micPermissionBody: "声を録音するには、ブラウザのマイク使用許可をオンにしてください。"
        },
        en: {
            pageTitle: "The Nightingale Pledge — Red Cross Nursing School Audio Studio",
            headerTitle: "The Nightingale Pledge — Pronunciation & Rhythm Studio",
            headerSubtitle: "Red Cross Nursing School — Native Speaker Pronunciation, Rhythm & Cadence Studio",
            helpBtn: "How to Use",
            playheadLabel: "Playhead",
            selectionLabel: "Selection",
            fullTrackSelectionText: "Full Track (Drag waveform or tap a clause below)",
            zoomIn: "＋ Zoom In",
            zoomOut: "－ Zoom Out",
            zoomSel: "🔍 Fit Selection",
            zoomFit: "⇄ Full Track",
            clearSel: "✕ Clear Highlight",
            overviewLabel: "Overview Track (59.4s) — Tap or drag to move viewport",
            waveformTip: "💡 Drag on waveform to highlight a section • Drag <strong>IN ◄</strong> / <strong>► OUT</strong> handles to trim",
            nudgeStartLabel: "Start (IN)",
            nudgeEndLabel: "End (OUT)",
            playBtn: "Play",
            playSelectionBtn: "Play Selection",
            pauseBtn: "Pause",
            cancelWaitBtn: "Cancel Wait",
            replayHighlight: "↺ Replay Highlight",
            stopAndReady: "■ Stop & Ready",
            whenSelectionEnds: "When Highlighted Part Ends:",
            modeStopReady: "⏹ Stop & Ready",
            modeShadow: "🗣 Shadow Pause",
            modeLoop: "🔁 Non-Stop Loop",
            speedLabel: "Playback Speed (Natural Pitch)",
            slow: "Slow",
            fast: "Fast",
            vocabFocusLabel: "🎯 Key Vocabulary Focus:",
            savedHighlightsLabel: "⭐ My Saved Highlights:",
            saveCurrentHighlight: "＋ Save Current Highlight",
            emptyBookmarksText: "Highlight any section on the waveform and click “+ Save Current Highlight” to bookmark it for home practice.",
            removeBookmarkTitle: "Remove bookmark",
            scriptSectionTitle: "The Nightingale Pledge — Clause-by-Clause Practice",
            scriptSectionSubtitle: "Tap any clause or full sentence below to highlight it on the waveform and play it immediately.",
            selectSentenceBtnPrefix: "▶ Highlight Full Sentence",
            voiceMirrorTitle: "🎙 Voice Mirror (Optional Self-Check)",
            voiceMirrorSubtitle: "Record yourself reciting the highlighted part and compare your rhythm and pronunciation.",
            recordStartBtn: "● Record My Voice",
            recordStopBtn: "■ Stop Recording",
            guideTitle: "📖 How to Practice at Home",
            guideSubtitle: "Works on iPad, iPhone, Android tablets/phones, and computers.",
            guideItem1: "<strong>Highlight Any Part on the Waveform:</strong> Drag your finger or mouse across the blue waveform to highlight a single word, a clause, or a full sentence.",
            guideItem2: "<strong>Stop &amp; Ready Mode (Default):</strong> When you press <strong>Play Selection</strong>, the player plays your highlighted region once, <strong>stops automatically at the end</strong>, and snaps the playhead back to the start of your highlight—ready to play again whenever you press Play!",
            guideItem3: "<strong>Adjust Selection Edges:</strong> Drag the yellow <strong>IN ◄</strong> and <strong>► OUT</strong> tabs on the waveform, or tap the <strong>-0.1s / +0.1s</strong> buttons to trim precisely.",
            guideItem4: "<strong>Slow Down Without Changing Pitch:</strong> Tap <strong>0.65×</strong>, <strong>0.75×</strong>, or <strong>0.85×</strong> to hear every syllable and consonant clearly at natural voice pitch.",
            guideItem5: "<strong>Keyboard Shortcuts (Computer / iPad Keyboard):</strong> Press <span class=\"kbd-badge\">Space</span> to Play/Pause, <span class=\"kbd-badge\">R</span> to Replay Selection, <span class=\"kbd-badge\">Esc</span> to Clear Highlight.",
            statusReadyInitial: "Ready — Highlight any part on waveform or tap a clause",
            statusSelectionReady: "Selection Ready",
            statusSelectionAdjusted: "Selection Adjusted",
            statusPausedAt: "Paused at ",
            statusStoppedReadyHighlight: "Stopped & Ready to Replay",
            statusStoppedResetStart: "Stopped & Reset to Start (0:00.00)",
            statusShadowWaiting: "Your Turn: Repeat the phrase out loud…",
            statusPlayingSelection: "Playing Selection",
            statusPlayingFull: "Playing Full Recording",
            statusFinishedReset: "Finished — Reset to Beginning (0:00.00)",
            statusSelectionCleared: "Selection Cleared — Full Track Mode",
            shadowCountdownFormat: "Your Turn to Speak! Replaying in {sec}s…",
            captionReadyTag: "Ready • The Nightingale Pledge",
            captionReadyText: "Drag across the waveform to highlight any word or phrase, or tap any clause below.",
            captionReadyHint: "Default Mode: Stops automatically at the end of your highlight and readies to play again.",
            captionFocusedTag: "Focused Selection",
            captionCustomWaveformText: "Custom Waveform Selection",
            captionPronunciationFocus: "Pronunciation Focus: ",
            captionCustomHighlightTag: "Custom Highlight",
            captionCustomHighlightText: "Custom region selected on waveform — press Play Selection or Spacebar.",
            captionCustomHighlightHint: "Tip: Drag the yellow IN ◄ / ► OUT handles on the waveform to fine-tune.",
            modalCloseBtn: "Close",
            helpModalTitle: "How to Use — The Nightingale Pledge Studio",
            helpModalHtml:
                "<p>This studio is designed to help you practice the pronunciation, rhythm, and natural phrasing of <strong>The Nightingale Pledge</strong> at home.</p>" +
                "<ol style=\"padding-left:1.2rem; display:flex; flex-direction:column; gap:0.55rem;\">" +
                "<li><strong>Highlight Any Part:</strong> Drag across the blue waveform with your finger or mouse, or tap any English clause or vocabulary chip below to highlight that exact section.</li>" +
                "<li><strong>Stop &amp; Ready Mode (Default):</strong> Pressing Play plays your highlighted region once, <strong>stops automatically at the end</strong>, and resets the playhead to the start of your highlight so you can practice out loud and replay whenever you are ready.</li>" +
                "<li><strong>Three Practice Modes:</strong><br>• <strong>⏹ Stop &amp; Ready:</strong> Plays once, pauses, and resets to the start of your highlight.<br>• <strong>🗣 Shadow Pause:</strong> Plays the highlight, waits silently for the exact same duration so you can repeat it out loud, then loops.<br>• <strong>🔁 Non-Stop Loop:</strong> Continuously repeats the highlighted region.</li>" +
                "<li><strong>Natural Pitch Speed Control:</strong> Slow down to 0.5×–0.85× without altering the natural pitch of the speaker's voice.</li>" +
                "</ol>",
            micUnsupportedTitle: "Microphone Recording Unavailable",
            micUnsupportedBody: "Your browser or device does not support microphone recording (MediaDevices API).",
            micPermissionTitle: "Microphone Permission Denied",
            micPermissionBody: "Please allow microphone access in your browser settings to record and compare your voice."
        }
    };

    // Keep all English vocabulary labels & phonetic hints in English
    const trickyPresets = [
        { label: "solemnly pledge", start: 1.38, end: 3.12, hint: "SOL-emn-ly [ˈsɑː.ləm.li] PLEDGE" },
        { label: "in purity", start: 8.95, end: 9.95, hint: "in PU-ri-ty [ˈpjʊr.ə.t̬i]" },
        { label: "abstain", start: 13.95, end: 15.30, hint: "I will ab-STAIN [æbˈsteɪn]" },
        { label: "deleterious & mischievous", start: 16.45, end: 19.02, hint: "del-e-TE-ri-ous [ˌdel.əˈtɪr.i.əs] and MIS-chie-vous [ˈmɪs.tʃə.vəs]" },
        { label: "knowingly administer", start: 21.15, end: 23.05, hint: "or KNOW-ing-ly ad-MIN-is-ter [ədˈmɪn.ə.stɚ]" },
        { label: "elevate the standard", start: 29.30, end: 32.55, hint: "and EL-e-vate [ˈel.ə.veɪt] the STAN-dard of my pro-FES-sion" },
        { label: "With loyalty will I endeavor", start: 46.65, end: 49.45, hint: "With LOY-al-ty [ˈlɔɪ.əl.ti] will I en-DEAV-or [enˈdev.ɚ]" },
        { label: "aid the physician", start: 49.35, end: 52.20, hint: "to AID the phy-SI-cian [fɪˈzɪʃ.ən] in his WORK" }
    ];

    // DOM Elements
    const audioEl = document.getElementById("pledgeAudio");
    const waveformCanvas = document.getElementById("waveformCanvas");
    const minimapCanvas = document.getElementById("minimapCanvas");
    const playPauseBtn = document.getElementById("playPauseBtn");
    const playPauseLabel = document.getElementById("playPauseLabel");
    const replaySelectionBtn = document.getElementById("replaySelectionBtn");
    const stopResetBtn = document.getElementById("stopResetBtn");
    const skipBackBtn = document.getElementById("skipBackBtn");
    const skipFwdBtn = document.getElementById("skipFwdBtn");

    const currentTimeReadout = document.getElementById("currentTimeReadout");
    const selectionReadout = document.getElementById("selectionReadout");
    const statusPill = document.getElementById("studioStatusPill");
    const statusText = document.getElementById("studioStatusText");

    const zoomInBtn = document.getElementById("zoomInBtn");
    const zoomOutBtn = document.getElementById("zoomOutBtn");
    const zoomSelBtn = document.getElementById("zoomSelBtn");
    const zoomFitBtn = document.getElementById("zoomFitBtn");
    const clearSelBtn = document.getElementById("clearSelBtn");

    const nudgeInMinus = document.getElementById("nudgeInMinus");
    const nudgeInPlus = document.getElementById("nudgeInPlus");
    const nudgeOutMinus = document.getElementById("nudgeOutMinus");
    const nudgeOutPlus = document.getElementById("nudgeOutPlus");

    const speedSlider = document.getElementById("speedSlider");
    const speedValueLabel = document.getElementById("speedValueLabel");
    const speedPills = document.querySelectorAll(".speed-pill");
    const modeButtons = document.querySelectorAll(".mode-option-btn");
    const langButtons = document.querySelectorAll(".lang-btn");

    const captionClauseTag = document.getElementById("captionClauseTag");
    const captionText = document.getElementById("captionText");
    const captionPhonetic = document.getElementById("captionPhonetic");
    const shadowCountdownBar = document.getElementById("shadowCountdownBar");
    const shadowCountdownText = document.getElementById("shadowCountdownText");

    const trickyContainer = document.getElementById("trickyPresetsContainer");
    const bookmarksContainer = document.getElementById("customBookmarksContainer");
    const saveBookmarkBtn = document.getElementById("saveBookmarkBtn");

    // Modal DOM
    const studioModal = document.getElementById("studioModal");
    const studioModalTitle = document.getElementById("studioModalTitle");
    const studioModalBody = document.getElementById("studioModalBody");
    const closeModalCrossBtn = document.getElementById("closeModalCrossBtn");
    const closeModalFooterBtn = document.getElementById("closeModalFooterBtn");
    const openHelpModalBtn = document.getElementById("openHelpModalBtn");

    // Studio Application State (Default Language: 'ja')
    const state = {
        lang: "ja",
        lastStatusKey: "statusReadyInitial",
        lastStatusRange: "",
        activeModalKind: null, // 'help' | 'mic-unsupported' | 'mic-denied' | null

        duration: Number(audioMeta.duration) || 59.385,
        peaks: Array.isArray(audioMeta.peaks) ? audioMeta.peaks : [],
        rms: Array.isArray(audioMeta.rms) ? audioMeta.rms : [],
        hiResChannelData: null,
        hiResSampleRate: 44100,

        currentTime: 0,
        isPlaying: false,
        playbackRate: 1.0,
        practiceMode: "stop-ready",

        selectionStart: null,
        selectionEnd: null,
        customHintOverride: null,

        viewStart: 0,
        viewEnd: Number(audioMeta.duration) || 59.385,

        dragMode: null,
        dragAnchorTime: 0,
        pointerDownX: 0,

        shadowTimerId: null,
        shadowEndTimeMs: 0,
        isShadowWaiting: false
    };

    const MIN_SELECTION_SEC = 0.15;
    const MIN_ZOOM_WINDOW_SEC = 1.5;
    const STORAGE_KEY_BOOKMARKS = "rc_nightingale_bookmarks_v1";

    function t(key) {
        const dict = I18N[state.lang] || I18N.ja;
        return dict[key] !== undefined ? dict[key] : key;
    }

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function formatTime(sec) {
        const safe = Math.max(0, Number(sec) || 0);
        const mins = Math.floor(safe / 60);
        const rem = safe - mins * 60;
        const wholeSec = Math.floor(rem);
        const tenths = Math.floor((rem - wholeSec) * 100);
        const secStr = wholeSec < 10 ? "0" + wholeSec : String(wholeSec);
        const msStr = tenths < 10 ? "0" + tenths : String(tenths);
        return mins + ":" + secStr + "." + msStr;
    }

    function hasActiveSelection() {
        return (
            state.selectionStart !== null &&
            state.selectionEnd !== null &&
            state.selectionEnd - state.selectionStart >= MIN_SELECTION_SEC
        );
    }

    // Modal Helper
    function openModal(kind) {
        if (!studioModal || !studioModalTitle || !studioModalBody) return;
        state.activeModalKind = kind;
        renderActiveModalContent();
        studioModal.classList.add("is-open");
    }

    function renderActiveModalContent() {
        if (!state.activeModalKind || !studioModalTitle || !studioModalBody) return;
        if (closeModalFooterBtn) {
            closeModalFooterBtn.textContent = t("modalCloseBtn");
        }
        if (state.activeModalKind === "help") {
            studioModalTitle.textContent = t("helpModalTitle");
            studioModalBody.innerHTML = t("helpModalHtml");
        } else if (state.activeModalKind === "mic-unsupported") {
            studioModalTitle.textContent = t("micUnsupportedTitle");
            studioModalBody.textContent = t("micUnsupportedBody");
        } else if (state.activeModalKind === "mic-denied") {
            studioModalTitle.textContent = t("micPermissionTitle");
            studioModalBody.textContent = t("micPermissionBody");
        }
    }

    function closeModal() {
        if (!studioModal) return;
        studioModal.classList.remove("is-open");
        state.activeModalKind = null;
    }

    if (openHelpModalBtn) {
        openHelpModalBtn.addEventListener("click", function () {
            openModal("help");
        });
    }
    if (closeModalCrossBtn) closeModalCrossBtn.addEventListener("click", closeModal);
    if (closeModalFooterBtn) closeModalFooterBtn.addEventListener("click", closeModal);
    if (studioModal) {
        studioModal.addEventListener("click", function (ev) {
            if (ev.target === studioModal) closeModal();
        });
    }

    // Language Switching Engine
    function applyLanguage(lang) {
        state.lang = lang === "en" ? "en" : "ja";
        document.documentElement.lang = state.lang;
        document.title = t("pageTitle");

        langButtons.forEach(function (btn) {
            const isMatch = btn.getAttribute("data-lang") === state.lang;
            btn.classList.toggle("active", isMatch);
            btn.setAttribute("aria-pressed", isMatch ? "true" : "false");
        });

        const headerTitle = document.getElementById("headerTitle");
        const headerSubtitle = document.getElementById("headerSubtitle");
        if (headerTitle) headerTitle.textContent = t("headerTitle");
        if (headerSubtitle) headerSubtitle.textContent = t("headerSubtitle");

        // Update all static data-i18n text nodes
        document.querySelectorAll("[data-i18n]").forEach(function (el) {
            const key = el.getAttribute("data-i18n");
            if (key) {
                el.textContent = t(key);
            }
        });

        // Update all data-i18n-html nodes (for guide list items with <strong> / badges)
        document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
            const key = el.getAttribute("data-i18n-html");
            if (key) {
                el.innerHTML = t(key);
            }
        });

        // Update Sentence Group headers and buttons
        document.querySelectorAll(".sentence-group-title").forEach(function (el) {
            const jaTitle = el.getAttribute("data-title-ja") || "";
            const enTitle = el.getAttribute("data-title-en") || "";
            el.textContent = state.lang === "ja" ? jaTitle : enTitle;
        });

        document.querySelectorAll(".btn-select-sentence").forEach(function (btn) {
            const rangeStr = btn.getAttribute("data-range-label") || "";
            btn.textContent = t("selectSentenceBtnPrefix") + " (" + rangeStr + ")";
        });

        // Update record button label
        const recordSelfBtn = document.getElementById("recordSelfBtn");
        if (recordSelfBtn) {
            const isRec = recordSelfBtn.classList.contains("recording");
            recordSelfBtn.textContent = isRec ? t("recordStopBtn") : t("recordStartBtn");
        }

        // Refresh dynamic readouts, status pill, bookmarks, captions, and open modal
        refreshStatusBanner();
        updateSelectionUI();
        renderCustomBookmarks();
        if (state.activeModalKind) {
            renderActiveModalContent();
        }
    }

    langButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const selectedLang = btn.getAttribute("data-lang") || "ja";
            applyLanguage(selectedLang);
        });
    });

    function cancelShadowWait() {
        if (state.shadowTimerId !== null) {
            clearInterval(state.shadowTimerId);
            state.shadowTimerId = null;
        }
        state.isShadowWaiting = false;
        if (shadowCountdownBar) {
            shadowCountdownBar.classList.remove("active");
        }
    }

    function setStudioStatus(kind, statusKey, rangeSuffix) {
        state.lastStatusKey = statusKey;
        state.lastStatusRange = rangeSuffix || "";
        if (statusPill) {
            statusPill.classList.remove("ready-state", "playing-state", "shadow-state");
            if (kind === "playing") {
                statusPill.classList.add("playing-state");
            } else if (kind === "shadow") {
                statusPill.classList.add("shadow-state");
            } else {
                statusPill.classList.add("ready-state");
            }
        }
        refreshStatusBanner();
    }

    function refreshStatusBanner() {
        if (!statusText) return;
        const base = t(state.lastStatusKey);
        statusText.textContent = state.lastStatusRange ? base + " " + state.lastStatusRange : base;
    }

    function enforcePitchPreservation() {
        if (!audioEl) return;
        audioEl.preservesPitch = true;
        audioEl.mozPreservesPitch = true;
        audioEl.webkitPreservesPitch = true;
    }

    function setPlaybackSpeed(rate) {
        const cleanRate = clamp(Math.round(rate * 100) / 100, 0.5, 1.5);
        state.playbackRate = cleanRate;
        if (audioEl) {
            enforcePitchPreservation();
            audioEl.playbackRate = cleanRate;
            audioEl.defaultPlaybackRate = cleanRate;
        }
        if (speedSlider) {
            speedSlider.value = String(cleanRate);
        }
        if (speedValueLabel) {
            speedValueLabel.textContent = cleanRate.toFixed(2).replace(/\.00$/, ".0") + "×";
        }
        speedPills.forEach(function (btn) {
            const btnRate = parseFloat(btn.getAttribute("data-speed") || "1");
            btn.classList.toggle("active", Math.abs(btnRate - cleanRate) < 0.01);
        });
    }

    function setSelection(startSec, endSec, options) {
        const opts = options || {};
        cancelShadowWait();

        if (startSec === null || endSec === null) {
            state.selectionStart = null;
            state.selectionEnd = null;
            state.customHintOverride = null;
            updateSelectionUI();
            requestRender();
            return;
        }

        const s = clamp(Math.min(startSec, endSec), 0, state.duration);
        const e = clamp(Math.max(startSec, endSec), 0, state.duration);

        if (e - s < MIN_SELECTION_SEC) {
            state.selectionStart = null;
            state.selectionEnd = null;
            state.customHintOverride = null;
        } else {
            state.selectionStart = s;
            state.selectionEnd = e;
            state.customHintOverride = opts.hint || null;
            if (opts.snapPlayhead !== false) {
                seekTo(s);
            }
        }

        updateSelectionUI();
        requestRender();

        if (opts.autoPlay && hasActiveSelection()) {
            playFromSelectionStart();
        } else if (hasActiveSelection()) {
            setStudioStatus(
                "ready",
                "statusSelectionReady",
                "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
            );
        }
    }

    function seekTo(timeSec) {
        const target = clamp(timeSec, 0, state.duration);
        state.currentTime = target;
        if (audioEl && Math.abs(audioEl.currentTime - target) > 0.01) {
            try {
                audioEl.currentTime = target;
            } catch (e) {
                // Ignore if audio metadata not yet loaded
            }
        }
        updateTimeReadouts();
        updateLiveCaptionAndHighlight();
        requestRender();
    }

    function playFromSelectionStart() {
        cancelShadowWait();
        if (!audioEl) return;

        if (hasActiveSelection()) {
            seekTo(state.selectionStart);
        } else if (state.currentTime >= state.duration - 0.05) {
            seekTo(0);
        }

        enforcePitchPreservation();
        audioEl.playbackRate = state.playbackRate;
        const playPromise = audioEl.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(function (err) {
                console.warn("Audio playback prevented:", err);
            });
        }
    }

    function togglePlayPause() {
        if (!audioEl) return;

        if (state.isShadowWaiting) {
            cancelShadowWait();
            if (hasActiveSelection()) {
                seekTo(state.selectionStart);
            }
            setStudioStatus(
                "ready",
                "statusStoppedReadyHighlight",
                hasActiveSelection()
                    ? "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
                    : ""
            );
            updateTransportButtons();
            return;
        }

        if (!audioEl.paused) {
            audioEl.pause();
            setStudioStatus("ready", "statusPausedAt", formatTime(state.currentTime));
            return;
        }

        if (hasActiveSelection()) {
            const eps = 0.04;
            if (
                state.currentTime < state.selectionStart - eps ||
                state.currentTime >= state.selectionEnd - eps
            ) {
                seekTo(state.selectionStart);
            }
        } else if (state.currentTime >= state.duration - 0.05) {
            seekTo(0);
        }

        enforcePitchPreservation();
        audioEl.playbackRate = state.playbackRate;
        audioEl.play().catch(function (err) {
            console.warn("Playback failed:", err);
        });
    }

    function stopAndReady() {
        cancelShadowWait();
        if (audioEl && !audioEl.paused) {
            audioEl.pause();
        }
        if (hasActiveSelection()) {
            seekTo(state.selectionStart);
            setStudioStatus(
                "ready",
                "statusStoppedReadyHighlight",
                "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
            );
        } else {
            seekTo(0);
            setStudioStatus("ready", "statusStoppedResetStart", "");
        }
        updateTransportButtons();
    }

    function handleSelectionBoundaryReached() {
        if (!hasActiveSelection()) return;

        const selDurationSec = state.selectionEnd - state.selectionStart;

        if (state.practiceMode === "stop-ready") {
            audioEl.pause();
            seekTo(state.selectionStart);
            setStudioStatus(
                "ready",
                "statusStoppedReadyHighlight",
                "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
            );
            updateTransportButtons();
        } else if (state.practiceMode === "loop") {
            seekTo(state.selectionStart);
            if (audioEl.paused) {
                audioEl.play().catch(function () {});
            }
        } else if (state.practiceMode === "shadow") {
            audioEl.pause();
            seekTo(state.selectionStart);
            const waitMs = Math.max(1200, Math.round((selDurationSec / state.playbackRate) * 1000));
            state.isShadowWaiting = true;
            state.shadowEndTimeMs = performance.now() + waitMs;
            if (shadowCountdownBar) {
                shadowCountdownBar.classList.add("active");
            }
            setStudioStatus("shadow", "statusShadowWaiting", "");
            updateTransportButtons();

            state.shadowTimerId = setInterval(function () {
                const remaining = Math.max(0, (state.shadowEndTimeMs - performance.now()) / 1000);
                if (shadowCountdownText) {
                    shadowCountdownText.textContent = t("shadowCountdownFormat").replace(
                        "{sec}",
                        remaining.toFixed(1)
                    );
                }
                if (remaining <= 0.05) {
                    cancelShadowWait();
                    playFromSelectionStart();
                }
            }, 80);
        }
    }

    function updateTimeReadouts() {
        if (currentTimeReadout) {
            currentTimeReadout.textContent =
                formatTime(state.currentTime) + " / " + formatTime(state.duration);
        }
    }

    function updateSelectionUI() {
        const active = hasActiveSelection();
        if (selectionReadout) {
            if (active) {
                const len = (state.selectionEnd - state.selectionStart).toFixed(2);
                selectionReadout.textContent =
                    formatTime(state.selectionStart) +
                    " – " +
                    formatTime(state.selectionEnd) +
                    " (" +
                    len +
                    "s)";
            } else {
                selectionReadout.textContent = t("fullTrackSelectionText");
            }
        }

        if (clearSelBtn) clearSelBtn.disabled = !active;
        if (zoomSelBtn) zoomSelBtn.disabled = !active;
        if (replaySelectionBtn) replaySelectionBtn.disabled = !active;
        if (saveBookmarkBtn) saveBookmarkBtn.disabled = !active;

        [nudgeInMinus, nudgeInPlus, nudgeOutMinus, nudgeOutPlus].forEach(function (btn) {
            if (btn) btn.disabled = !active;
        });

        updateTransportButtons();
        updateLiveCaptionAndHighlight();
    }

    function updateTransportButtons() {
        const playing = (audioEl && !audioEl.paused) || state.isShadowWaiting;
        if (playPauseBtn && playPauseLabel) {
            playPauseBtn.classList.toggle("is-playing", playing);
            if (state.isShadowWaiting) {
                playPauseLabel.textContent = t("cancelWaitBtn");
            } else if (playing) {
                playPauseLabel.textContent = t("pauseBtn");
            } else if (hasActiveSelection()) {
                playPauseLabel.textContent = t("playSelectionBtn");
            } else {
                playPauseLabel.textContent = t("playBtn");
            }
        }
    }

    function findSegmentForTime(tSec) {
        for (let i = 0; i < segments.length; i++) {
            const s = segments[i];
            if (tSec >= s.startTime - 0.15 && tSec <= s.endTime + 0.15) {
                return s;
            }
        }
        return null;
    }

    function updateLiveCaptionAndHighlight() {
        let activeSeg = null;
        if (hasActiveSelection()) {
            const mid = (state.selectionStart + state.selectionEnd) * 0.5;
            activeSeg = findSegmentForTime(state.currentTime) || findSegmentForTime(mid);
        } else {
            activeSeg = findSegmentForTime(state.currentTime);
        }

        if (captionClauseTag && captionText && captionPhonetic) {
            if (state.customHintOverride && hasActiveSelection()) {
                captionClauseTag.textContent =
                    t("captionFocusedTag") +
                    " (" +
                    formatTime(state.selectionStart) +
                    " – " +
                    formatTime(state.selectionEnd) +
                    ")";
                // Keep the English Pledge text & English phonetic guide in English!
                captionText.textContent = activeSeg
                    ? activeSeg.text
                    : t("captionCustomWaveformText");
                captionPhonetic.textContent =
                    t("captionPronunciationFocus") + state.customHintOverride;
            } else if (activeSeg) {
                const cLabel =
                    state.lang === "ja" && activeSeg.clauseLabelJa
                        ? activeSeg.clauseLabelJa
                        : activeSeg.clauseLabel;
                const pTitle =
                    state.lang === "ja" && activeSeg.partTitleJa
                        ? activeSeg.partTitleJa
                        : activeSeg.partTitle;
                captionClauseTag.textContent = cLabel + " • " + pTitle;
                // Keep the English Pledge sentence & phonetic stress guide in English!
                captionText.textContent = activeSeg.text;
                captionPhonetic.textContent = activeSeg.phoneticHint;
            } else if (hasActiveSelection()) {
                captionClauseTag.textContent =
                    t("captionCustomHighlightTag") +
                    " (" +
                    formatTime(state.selectionStart) +
                    " – " +
                    formatTime(state.selectionEnd) +
                    ")";
                captionText.textContent = t("captionCustomHighlightText");
                captionPhonetic.textContent = t("captionCustomHighlightHint");
            } else {
                captionClauseTag.textContent = t("captionReadyTag");
                captionText.textContent = t("captionReadyText");
                captionPhonetic.textContent = t("captionReadyHint");
            }
        }

        // Highlight matching clause cards in the script list
        const clauseNodes = document.querySelectorAll(".clause-item");
        clauseNodes.forEach(function (node) {
            const sTime = parseFloat(node.getAttribute("data-start") || "0");
            const eTime = parseFloat(node.getAttribute("data-end") || "0");

            const isPlayingThis =
                state.isPlaying &&
                state.currentTime >= sTime - 0.08 &&
                state.currentTime <= eTime + 0.08;

            const isSelectedThis =
                hasActiveSelection() &&
                Math.abs(state.selectionStart - sTime) < 0.25 &&
                Math.abs(state.selectionEnd - eTime) < 0.25;

            node.classList.toggle("is-playing-now", isPlayingThis);
            node.classList.toggle("is-selected", isSelectedThis);
        });

        // Highlight matching tricky preset chip
        const chipNodes = document.querySelectorAll(".vocab-chip[data-preset='1']");
        chipNodes.forEach(function (chip) {
            const sTime = parseFloat(chip.getAttribute("data-start") || "0");
            const eTime = parseFloat(chip.getAttribute("data-end") || "0");
            const matched =
                hasActiveSelection() &&
                Math.abs(state.selectionStart - sTime) < 0.12 &&
                Math.abs(state.selectionEnd - eTime) < 0.12;
            chip.classList.toggle("active", matched);
        });
    }

    // =========================================================================
    // Canvas Waveform & Minimap Rendering Engine (Audacity Dual-Tone Style)
    // =========================================================================
    let renderPending = false;
    function requestRender() {
        if (renderPending) return;
        renderPending = true;
        requestAnimationFrame(function () {
            renderPending = false;
            renderMinimap();
            renderMainWaveform();
        });
    }

    function timeToX(timeSec, width) {
        const span = Math.max(0.001, state.viewEnd - state.viewStart);
        return ((timeSec - state.viewStart) / span) * width;
    }

    function xToTime(x, width) {
        const ratio = clamp(x / Math.max(1, width), 0, 1);
        return state.viewStart + ratio * (state.viewEnd - state.viewStart);
    }

    function renderMinimap() {
        if (!minimapCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = minimapCanvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));

        if (minimapCanvas.width !== width * dpr || minimapCanvas.height !== height * dpr) {
            minimapCanvas.width = width * dpr;
            minimapCanvas.height = height * dpr;
        }

        const ctx = minimapCanvas.getContext("2d");
        ctx.save();
        ctx.scale(dpr, dpr);

        ctx.fillStyle = "#090e1a";
        ctx.fillRect(0, 0, width, height);

        const midY = height / 2;
        const numBuckets = state.peaks.length;
        if (numBuckets > 0) {
            ctx.fillStyle = "#1e3a5f";
            for (let x = 0; x < width; x++) {
                const idx = Math.min(numBuckets - 1, Math.floor((x / width) * numBuckets));
                const amp = Math.min(1, (state.peaks[idx] || 0) * 1.35);
                const h = Math.max(1, amp * (height - 6));
                ctx.fillRect(x, midY - h / 2, 1, h);
            }
        }

        if (hasActiveSelection()) {
            const sx = (state.selectionStart / state.duration) * width;
            const ex = (state.selectionEnd / state.duration) * width;
            ctx.fillStyle = "rgba(250, 204, 21, 0.28)";
            ctx.fillRect(sx, 0, Math.max(2, ex - sx), height);
        }

        const vx1 = (state.viewStart / state.duration) * width;
        const vx2 = (state.viewEnd / state.duration) * width;
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(vx1 + 0.5, 1, Math.max(4, vx2 - vx1 - 1), height - 2);

        const px = (state.currentTime / state.duration) * width;
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(px - 1, 0, 2, height);

        ctx.restore();
    }

    function renderMainWaveform() {
        if (!waveformCanvas) return;
        const dpr = window.devicePixelRatio || 1;
        const rect = waveformCanvas.getBoundingClientRect();
        const width = Math.max(1, Math.floor(rect.width));
        const height = Math.max(1, Math.floor(rect.height));

        if (waveformCanvas.width !== width * dpr || waveformCanvas.height !== height * dpr) {
            waveformCanvas.width = width * dpr;
            waveformCanvas.height = height * dpr;
        }

        const ctx = waveformCanvas.getContext("2d");
        ctx.save();
        ctx.scale(dpr, dpr);

        const rulerHeight = 28;
        const waveTop = rulerHeight;
        const waveHeight = height - rulerHeight;
        const midY = waveTop + waveHeight / 2;

        ctx.fillStyle = "#0f172a";
        ctx.fillRect(0, 0, width, height);

        ctx.strokeStyle = "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = 1;
        for (let i = 0; i < segments.length; i++) {
            const seg = segments[i];
            if (seg.startTime >= state.viewStart && seg.startTime <= state.viewEnd) {
                const gx = Math.floor(timeToX(seg.startTime, width)) + 0.5;
                ctx.beginPath();
                ctx.moveTo(gx, waveTop);
                ctx.lineTo(gx, height);
                ctx.stroke();
            }
        }

        if (hasActiveSelection()) {
            const selX1 = clamp(timeToX(state.selectionStart, width), -10, width + 10);
            const selX2 = clamp(timeToX(state.selectionEnd, width), -10, width + 10);
            if (selX2 > 0 && selX1 < width) {
                ctx.fillStyle = "rgba(250, 204, 21, 0.16)";
                ctx.fillRect(selX1, waveTop, Math.max(2, selX2 - selX1), waveHeight);
            }
        }

        ctx.strokeStyle = "rgba(148, 163, 184, 0.3)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, Math.floor(midY) + 0.5);
        ctx.lineTo(width, Math.floor(midY) + 0.5);
        ctx.stroke();

        const maxHalfHeight = (waveHeight / 2) * 0.88;
        const numBuckets = state.peaks.length;
        const viewSpan = state.viewEnd - state.viewStart;
        const useHiRes = state.hiResChannelData && viewSpan < 22;

        for (let x = 0; x < width; x++) {
            const t0 = state.viewStart + (x / width) * viewSpan;
            const t1 = state.viewStart + ((x + 1) / width) * viewSpan;

            let peakVal = 0;
            let rmsVal = 0;

            if (useHiRes) {
                const s0 = clamp(
                    Math.floor(t0 * state.hiResSampleRate),
                    0,
                    state.hiResChannelData.length - 1
                );
                const s1 = clamp(
                    Math.ceil(t1 * state.hiResSampleRate),
                    s0 + 1,
                    state.hiResChannelData.length
                );
                const step = Math.max(1, Math.floor((s1 - s0) / 32));
                let sumSq = 0;
                let count = 0;
                for (let s = s0; s < s1; s += step) {
                    const v = Math.abs(state.hiResChannelData[s]);
                    if (v > peakVal) peakVal = v;
                    sumSq += v * v;
                    count++;
                }
                rmsVal = count > 0 ? Math.sqrt(sumSq / count) : 0;
            } else if (numBuckets > 0) {
                const b0 = clamp(
                    Math.floor((t0 / state.duration) * numBuckets),
                    0,
                    numBuckets - 1
                );
                const b1 = clamp(
                    Math.ceil((t1 / state.duration) * numBuckets),
                    b0 + 1,
                    numBuckets
                );
                let sumRms = 0;
                let count = 0;
                for (let b = b0; b < b1; b++) {
                    if (state.peaks[b] > peakVal) peakVal = state.peaks[b];
                    sumRms += state.rms[b] || 0;
                    count++;
                }
                rmsVal = count > 0 ? sumRms / count : 0;
            }

            const inSel =
                hasActiveSelection() &&
                t0 >= state.selectionStart &&
                t0 <= state.selectionEnd;

            const scaledPeak = Math.min(1, peakVal * 1.35) * maxHalfHeight;
            const scaledRms = Math.min(1, rmsVal * 1.35) * maxHalfHeight;

            if (scaledPeak > 0.5) {
                ctx.fillStyle = inSel ? "#fde047" : "#0284c7";
                ctx.fillRect(x, midY - scaledPeak, 1, scaledPeak * 2);
            }
            if (scaledRms > 0.5) {
                ctx.fillStyle = inSel ? "#f59e0b" : "#38bdf8";
                ctx.fillRect(x, midY - scaledRms, 1, scaledRms * 2);
            }
        }

        ctx.fillStyle = "#090e1a";
        ctx.fillRect(0, 0, width, rulerHeight);
        ctx.strokeStyle = "#1e293b";
        ctx.beginPath();
        ctx.moveTo(0, rulerHeight - 0.5);
        ctx.lineTo(width, rulerHeight - 0.5);
        ctx.stroke();

        let majorStep = 5;
        let minorStep = 1;
        if (viewSpan <= 4) {
            majorStep = 0.5;
            minorStep = 0.1;
        } else if (viewSpan <= 12) {
            majorStep = 1;
            minorStep = 0.2;
        } else if (viewSpan <= 28) {
            majorStep = 2;
            minorStep = 0.5;
        }

        const firstTick = Math.floor(state.viewStart / minorStep) * minorStep;
        ctx.font = "600 11px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.textBaseline = "middle";

        for (let tickTime = firstTick; tickTime <= state.viewEnd; tickTime += minorStep) {
            if (tickTime < 0) continue;
            const tx = Math.floor(timeToX(tickTime, width)) + 0.5;
            const isMajor = Math.abs(tickTime / majorStep - Math.round(tickTime / majorStep)) < 0.01;

            ctx.strokeStyle = isMajor ? "#64748b" : "#334155";
            ctx.beginPath();
            ctx.moveTo(tx, isMajor ? 14 : 20);
            ctx.lineTo(tx, rulerHeight);
            ctx.stroke();

            if (isMajor && tx > 18 && tx < width - 28) {
                ctx.fillStyle = "#94a3b8";
                const label = majorStep < 1 ? tickTime.toFixed(1) + "s" : formatTime(tickTime).replace(/\.00$/, "");
                ctx.fillText(label, tx + 4, 11);
            }
        }

        if (hasActiveSelection()) {
            const selX1 = timeToX(state.selectionStart, width);
            const selX2 = timeToX(state.selectionEnd, width);

            ctx.strokeStyle = "#facc15";
            ctx.lineWidth = 2;

            if (selX1 >= -20 && selX1 <= width + 20) {
                ctx.beginPath();
                ctx.moveTo(selX1, waveTop);
                ctx.lineTo(selX1, height);
                ctx.stroke();

                ctx.fillStyle = "#facc15";
                ctx.beginPath();
                ctx.roundRect(selX1 - 2, waveTop + 4, 28, 22, 4);
                ctx.fill();
                ctx.fillStyle = "#0f172a";
                ctx.font = "800 10px sans-serif";
                ctx.fillText("IN ◄", selX1 + 2, waveTop + 15);
            }

            if (selX2 >= -20 && selX2 <= width + 20) {
                ctx.beginPath();
                ctx.moveTo(selX2, waveTop);
                ctx.lineTo(selX2, height);
                ctx.stroke();

                ctx.fillStyle = "#facc15";
                ctx.beginPath();
                ctx.roundRect(selX2 - 32, height - 26, 34, 22, 4);
                ctx.fill();
                ctx.fillStyle = "#0f172a";
                ctx.font = "800 10px sans-serif";
                ctx.fillText("► OUT", selX2 - 29, height - 15);
            }
        }

        if (state.currentTime >= state.viewStart && state.currentTime <= state.viewEnd) {
            const px = timeToX(state.currentTime, width);
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, height);
            ctx.stroke();

            ctx.fillStyle = "#ef4444";
            ctx.beginPath();
            ctx.moveTo(px - 6, 0);
            ctx.lineTo(px + 6, 0);
            ctx.lineTo(px, 9);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();
    }

    // =========================================================================
    // Mouse & Touch Pointer Interactions on Waveform
    // =========================================================================
    function setupWaveformInteractions() {
        if (!waveformCanvas) return;

        let activePointerId = null;

        waveformCanvas.addEventListener("pointerdown", function (ev) {
            if (ev.button !== undefined && ev.button !== 0) return;
            activePointerId = ev.pointerId;
            waveformCanvas.setPointerCapture(ev.pointerId);

            const rect = waveformCanvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const width = rect.width;
            const clickedTime = xToTime(x, width);

            state.pointerDownX = x;
            state.dragAnchorTime = clickedTime;

            if (hasActiveSelection()) {
                const selX1 = timeToX(state.selectionStart, width);
                const selX2 = timeToX(state.selectionEnd, width);
                if (Math.abs(x - selX1) <= 22) {
                    state.dragMode = "move-start";
                    return;
                }
                if (Math.abs(x - selX2) <= 22) {
                    state.dragMode = "move-end";
                    return;
                }
            }

            state.dragMode = "create-selection";
        });

        waveformCanvas.addEventListener("pointermove", function (ev) {
            const rect = waveformCanvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const width = rect.width;

            if (!state.dragMode && hasActiveSelection()) {
                const selX1 = timeToX(state.selectionStart, width);
                const selX2 = timeToX(state.selectionEnd, width);
                if (Math.abs(x - selX1) <= 18 || Math.abs(x - selX2) <= 18) {
                    waveformCanvas.style.cursor = "ew-resize";
                } else {
                    waveformCanvas.style.cursor = "crosshair";
                }
                return;
            }

            if (ev.pointerId !== activePointerId || !state.dragMode) return;

            const pointerTime = xToTime(x, width);

            if (state.dragMode === "move-start") {
                const newStart = clamp(pointerTime, 0, state.selectionEnd - MIN_SELECTION_SEC);
                state.selectionStart = newStart;
                seekTo(newStart);
                updateSelectionUI();
                requestRender();
            } else if (state.dragMode === "move-end") {
                const newEnd = clamp(
                    pointerTime,
                    state.selectionStart + MIN_SELECTION_SEC,
                    state.duration
                );
                state.selectionEnd = newEnd;
                updateSelectionUI();
                requestRender();
            } else if (state.dragMode === "create-selection") {
                if (Math.abs(x - state.pointerDownX) > 6) {
                    const s = Math.min(state.dragAnchorTime, pointerTime);
                    const e = Math.max(state.dragAnchorTime, pointerTime);
                    state.selectionStart = clamp(s, 0, state.duration);
                    state.selectionEnd = clamp(e, 0, state.duration);
                    state.customHintOverride = null;
                    updateSelectionUI();
                    requestRender();
                }
            }
        });

        function finishPointer(ev) {
            if (ev.pointerId !== activePointerId) return;
            const rect = waveformCanvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const movedPx = Math.abs(x - state.pointerDownX);

            if (state.dragMode === "create-selection") {
                if (movedPx <= 6) {
                    seekTo(state.dragAnchorTime);
                } else if (hasActiveSelection()) {
                    seekTo(state.selectionStart);
                    setStudioStatus(
                        "ready",
                        "statusSelectionReady",
                        "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
                    );
                }
            } else if (state.dragMode === "move-start" || state.dragMode === "move-end") {
                if (hasActiveSelection()) {
                    seekTo(state.selectionStart);
                    setStudioStatus(
                        "ready",
                        "statusSelectionAdjusted",
                        "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
                    );
                }
            }

            state.dragMode = null;
            activePointerId = null;
            updateSelectionUI();
            requestRender();
        }

        waveformCanvas.addEventListener("pointerup", finishPointer);
        waveformCanvas.addEventListener("pointercancel", finishPointer);

        waveformCanvas.addEventListener(
            "wheel",
            function (ev) {
                ev.preventDefault();
                const span = state.viewEnd - state.viewStart;
                if (ev.ctrlKey || Math.abs(ev.deltaY) > Math.abs(ev.deltaX)) {
                    const factor = ev.deltaY < 0 ? 0.8 : 1.25;
                    zoomByFactor(factor);
                } else {
                    const shift = (ev.deltaX / waveformCanvas.clientWidth) * span;
                    panViewport(shift);
                }
            },
            { passive: false }
        );
    }

    function setupMinimapInteractions() {
        if (!minimapCanvas) return;
        let draggingMinimap = false;

        function centerViewportAtEvent(ev) {
            const rect = minimapCanvas.getBoundingClientRect();
            const ratio = clamp((ev.clientX - rect.left) / Math.max(1, rect.width), 0, 1);
            const targetCenter = ratio * state.duration;
            const span = state.viewEnd - state.viewStart;
            let newStart = targetCenter - span / 2;
            newStart = clamp(newStart, 0, Math.max(0, state.duration - span));
            state.viewStart = newStart;
            state.viewEnd = newStart + span;
            requestRender();
        }

        minimapCanvas.addEventListener("pointerdown", function (ev) {
            draggingMinimap = true;
            minimapCanvas.setPointerCapture(ev.pointerId);
            centerViewportAtEvent(ev);
        });

        minimapCanvas.addEventListener("pointermove", function (ev) {
            if (!draggingMinimap) return;
            centerViewportAtEvent(ev);
        });

        minimapCanvas.addEventListener("pointerup", function () {
            draggingMinimap = false;
        });
    }

    function zoomByFactor(factor) {
        const currentSpan = state.viewEnd - state.viewStart;
        const newSpan = clamp(currentSpan * factor, MIN_ZOOM_WINDOW_SEC, state.duration);
        const anchor = hasActiveSelection()
            ? (state.selectionStart + state.selectionEnd) * 0.5
            : state.currentTime;
        let newStart = anchor - newSpan * 0.5;
        newStart = clamp(newStart, 0, Math.max(0, state.duration - newSpan));
        state.viewStart = newStart;
        state.viewEnd = newStart + newSpan;
        requestRender();
    }

    function panViewport(deltaSec) {
        const span = state.viewEnd - state.viewStart;
        const newStart = clamp(state.viewStart + deltaSec, 0, Math.max(0, state.duration - span));
        state.viewStart = newStart;
        state.viewEnd = newStart + span;
        requestRender();
    }

    // =========================================================================
    // High-Frequency Playback Loop & Audio Event Wiring
    // =========================================================================
    let rafId = null;
    function startHighFreqMonitor() {
        if (rafId !== null) return;
        function tick() {
            if (!audioEl || audioEl.paused) {
                rafId = null;
                return;
            }
            state.currentTime = audioEl.currentTime;

            if (hasActiveSelection() && state.currentTime >= state.selectionEnd - 0.015) {
                handleSelectionBoundaryReached();
                rafId = null;
                return;
            }

            if (state.currentTime > state.viewEnd - 0.25 && state.viewEnd < state.duration) {
                const span = state.viewEnd - state.viewStart;
                const nextStart = clamp(
                    state.currentTime - span * 0.15,
                    0,
                    state.duration - span
                );
                state.viewStart = nextStart;
                state.viewEnd = nextStart + span;
            }

            updateTimeReadouts();
            updateLiveCaptionAndHighlight();
            requestRender();
            rafId = requestAnimationFrame(tick);
        }
        rafId = requestAnimationFrame(tick);
    }

    if (audioEl) {
        audioEl.addEventListener("loadedmetadata", function () {
            if (audioEl.duration && isFinite(audioEl.duration)) {
                state.duration = audioEl.duration;
                if (state.viewEnd > state.duration || state.viewEnd === 0) {
                    state.viewEnd = state.duration;
                }
            }
            enforcePitchPreservation();
            updateTimeReadouts();
            requestRender();
        });

        audioEl.addEventListener("play", function () {
            state.isPlaying = true;
            if (hasActiveSelection()) {
                setStudioStatus(
                    "playing",
                    "statusPlayingSelection",
                    "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
                );
            } else {
                setStudioStatus("playing", "statusPlayingFull", "");
            }
            updateTransportButtons();
            startHighFreqMonitor();
        });

        audioEl.addEventListener("pause", function () {
            state.isPlaying = false;
            updateTransportButtons();
            updateLiveCaptionAndHighlight();
            requestRender();
        });

        audioEl.addEventListener("ended", function () {
            state.isPlaying = false;
            if (hasActiveSelection()) {
                seekTo(state.selectionStart);
                setStudioStatus(
                    "ready",
                    "statusStoppedReadyHighlight",
                    "(" + formatTime(state.selectionStart) + " – " + formatTime(state.selectionEnd) + ")"
                );
            } else {
                seekTo(0);
                setStudioStatus("ready", "statusFinishedReset", "");
            }
            updateTransportButtons();
        });

        audioEl.addEventListener("timeupdate", function () {
            if (!state.isPlaying) {
                state.currentTime = audioEl.currentTime;
                updateTimeReadouts();
                requestRender();
            } else if (hasActiveSelection() && audioEl.currentTime >= state.selectionEnd) {
                handleSelectionBoundaryReached();
            }
        });
    }

    function decodeHighResWaveformAsync() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx || !audioMeta.audioUrl) return;
        fetch(audioMeta.audioUrl)
            .then(function (res) {
                return res.arrayBuffer();
            })
            .then(function (buf) {
                const ctx = new AudioCtx();
                return ctx.decodeAudioData(buf).then(function (audioBuffer) {
                    state.hiResChannelData = audioBuffer.getChannelData(0);
                    state.hiResSampleRate = audioBuffer.sampleRate;
                    if (typeof ctx.close === "function") {
                        ctx.close();
                    }
                    requestRender();
                });
            })
            .catch(function () {});
    }

    // =========================================================================
    // UI Controls, Clauses, Tricky Vocabulary & Custom Bookmarks
    // =========================================================================
    if (playPauseBtn) playPauseBtn.addEventListener("click", togglePlayPause);
    if (replaySelectionBtn) {
        replaySelectionBtn.addEventListener("click", function () {
            if (hasActiveSelection()) {
                playFromSelectionStart();
            }
        });
    }
    if (stopResetBtn) stopResetBtn.addEventListener("click", stopAndReady);

    if (skipBackBtn) {
        skipBackBtn.addEventListener("click", function () {
            seekTo(state.currentTime - 2.0);
        });
    }
    if (skipFwdBtn) {
        skipFwdBtn.addEventListener("click", function () {
            seekTo(state.currentTime + 2.0);
        });
    }

    if (zoomInBtn) {
        zoomInBtn.addEventListener("click", function () {
            zoomByFactor(0.6);
        });
    }
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener("click", function () {
            zoomByFactor(1.65);
        });
    }
    if (zoomFitBtn) {
        zoomFitBtn.addEventListener("click", function () {
            state.viewStart = 0;
            state.viewEnd = state.duration;
            requestRender();
        });
    }
    if (zoomSelBtn) {
        zoomSelBtn.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            const pad = Math.max(0.6, (state.selectionEnd - state.selectionStart) * 0.25);
            state.viewStart = clamp(state.selectionStart - pad, 0, state.duration);
            state.viewEnd = clamp(state.selectionEnd + pad, 0, state.duration);
            requestRender();
        });
    }
    if (clearSelBtn) {
        clearSelBtn.addEventListener("click", function () {
            setSelection(null, null);
            setStudioStatus("ready", "statusSelectionCleared", "");
        });
    }

    if (nudgeInMinus) {
        nudgeInMinus.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            setSelection(state.selectionStart - 0.1, state.selectionEnd);
        });
    }
    if (nudgeInPlus) {
        nudgeInPlus.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            setSelection(
                Math.min(state.selectionEnd - MIN_SELECTION_SEC, state.selectionStart + 0.1),
                state.selectionEnd
            );
        });
    }
    if (nudgeOutMinus) {
        nudgeOutMinus.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            setSelection(
                state.selectionStart,
                Math.max(state.selectionStart + MIN_SELECTION_SEC, state.selectionEnd - 0.1)
            );
        });
    }
    if (nudgeOutPlus) {
        nudgeOutPlus.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            setSelection(state.selectionStart, state.selectionEnd + 0.1);
        });
    }

    modeButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const mode = btn.getAttribute("data-mode") || "stop-ready";
            state.practiceMode = mode;
            cancelShadowWait();
            modeButtons.forEach(function (b) {
                b.classList.toggle("active", b === btn);
            });
        });
    });

    speedPills.forEach(function (pill) {
        pill.addEventListener("click", function () {
            const s = parseFloat(pill.getAttribute("data-speed") || "1.0");
            setPlaybackSpeed(s);
        });
    });
    if (speedSlider) {
        speedSlider.addEventListener("input", function () {
            setPlaybackSpeed(parseFloat(speedSlider.value || "1.0"));
        });
    }

    document.querySelectorAll(".clause-item").forEach(function (item) {
        item.addEventListener("click", function () {
            const s = parseFloat(item.getAttribute("data-start") || "0");
            const e = parseFloat(item.getAttribute("data-end") || "0");
            setSelection(s, e, { autoPlay: true });
        });
    });

    document.querySelectorAll(".btn-select-sentence").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const s = parseFloat(btn.getAttribute("data-start") || "0");
            const e = parseFloat(btn.getAttribute("data-end") || "0");
            setSelection(s, e, { autoPlay: true });
        });
    });

    function renderTrickyPresets() {
        if (!trickyContainer) return;
        trickyContainer.replaceChildren();
        trickyPresets.forEach(function (preset) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "vocab-chip";
            btn.setAttribute("data-preset", "1");
            btn.setAttribute("data-start", String(preset.start));
            btn.setAttribute("data-end", String(preset.end));

            const labelSpan = document.createElement("span");
            // English vocabulary always stays English!
            labelSpan.textContent = "“" + preset.label + "”";

            const timeSpan = document.createElement("span");
            timeSpan.className = "chip-time";
            timeSpan.textContent = formatTime(preset.start);

            btn.appendChild(labelSpan);
            btn.appendChild(timeSpan);

            btn.addEventListener("click", function () {
                setSelection(preset.start, preset.end, {
                    hint: preset.hint,
                    autoPlay: true
                });
            });

            trickyContainer.appendChild(btn);
        });
    }

    function loadSavedBookmarks() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
            const parsed = JSON.parse(raw || "[]");
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveBookmarksList(list) {
        try {
            localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(list));
        } catch (e) {
            // Ignore storage quota errors
        }
    }

    function renderCustomBookmarks() {
        if (!bookmarksContainer) return;
        bookmarksContainer.replaceChildren();
        const list = loadSavedBookmarks();

        if (list.length === 0) {
            const emptyNote = document.createElement("span");
            emptyNote.style.fontSize = "0.78rem";
            emptyNote.style.color = "#64748b";
            emptyNote.textContent = t("emptyBookmarksText");
            bookmarksContainer.appendChild(emptyNote);
            return;
        }

        list.forEach(function (bm, idx) {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "vocab-chip";

            const textSpan = document.createElement("span");
            textSpan.textContent = bm.label || "Clip #" + (idx + 1);

            const timeSpan = document.createElement("span");
            timeSpan.className = "chip-time";
            timeSpan.textContent = formatTime(bm.start) + "–" + formatTime(bm.end);

            const delSpan = document.createElement("span");
            delSpan.className = "bookmark-remove";
            delSpan.textContent = "×";
            delSpan.title = t("removeBookmarkTitle");
            delSpan.addEventListener("click", function (ev) {
                ev.stopPropagation();
                const updated = loadSavedBookmarks().filter(function (_, i) {
                    return i !== idx;
                });
                saveBookmarksList(updated);
                renderCustomBookmarks();
            });

            chip.appendChild(textSpan);
            chip.appendChild(timeSpan);
            chip.appendChild(delSpan);

            chip.addEventListener("click", function () {
                setSelection(Number(bm.start), Number(bm.end), { autoPlay: true });
            });

            bookmarksContainer.appendChild(chip);
        });
    }

    if (saveBookmarkBtn) {
        saveBookmarkBtn.addEventListener("click", function () {
            if (!hasActiveSelection()) return;
            const matchingSeg = findSegmentForTime(
                (state.selectionStart + state.selectionEnd) * 0.5
            );
            const defaultLabel = matchingSeg
                ? matchingSeg.text.slice(0, 26) + (matchingSeg.text.length > 26 ? "…" : "")
                : "Clip " + formatTime(state.selectionStart);

            const list = loadSavedBookmarks();
            list.push({
                label: defaultLabel,
                start: Math.round(state.selectionStart * 100) / 100,
                end: Math.round(state.selectionEnd * 100) / 100
            });
            saveBookmarksList(list);
            renderCustomBookmarks();
        });
    }

    // Optional Self-Check Microphone Recorder (Uses localized in-app modal instead of alert)
    const recordSelfBtn = document.getElementById("recordSelfBtn");
    const studentAudioEl = document.getElementById("studentAudioPlayback");
    let mediaRecorder = null;
    let recordedChunks = [];

    if (recordSelfBtn && studentAudioEl) {
        recordSelfBtn.addEventListener("click", function () {
            if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
                recordSelfBtn.classList.remove("recording");
                recordSelfBtn.textContent = t("recordStartBtn");
                return;
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                openModal("mic-unsupported");
                return;
            }

            navigator.mediaDevices
                .getUserMedia({ audio: true })
                .then(function (stream) {
                    recordedChunks = [];
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.ondataavailable = function (ev) {
                        if (ev.data && ev.data.size > 0) {
                            recordedChunks.push(ev.data);
                        }
                    };
                    mediaRecorder.onstop = function () {
                        const blob = new Blob(recordedChunks, {
                            type: mediaRecorder.mimeType || "audio/webm"
                        });
                        const url = URL.createObjectURL(blob);
                        studentAudioEl.src = url;
                        studentAudioEl.style.display = "block";
                        stream.getTracks().forEach(function (track) {
                            track.stop();
                        });
                    };
                    mediaRecorder.start();
                    recordSelfBtn.classList.add("recording");
                    recordSelfBtn.textContent = t("recordStopBtn");
                })
                .catch(function () {
                    openModal("mic-denied");
                });
        });
    }

    window.addEventListener("keydown", function (ev) {
        if (ev.target && (ev.target.tagName === "INPUT" || ev.target.tagName === "TEXTAREA")) {
            return;
        }
        if (ev.code === "Escape") {
            if (state.activeModalKind) {
                closeModal();
            } else {
                setSelection(null, null);
            }
        } else if (ev.code === "Space") {
            ev.preventDefault();
            togglePlayPause();
        } else if (ev.code === "KeyR") {
            ev.preventDefault();
            if (hasActiveSelection()) {
                playFromSelectionStart();
            } else {
                seekTo(0);
            }
        } else if (ev.code === "ArrowLeft") {
            ev.preventDefault();
            seekTo(state.currentTime - 1.0);
        } else if (ev.code === "ArrowRight") {
            ev.preventDefault();
            seekTo(state.currentTime + 1.0);
        }
    });

    window.addEventListener("resize", requestRender);

    // Initialize Studio in Japanese ('ja') by default
    setupWaveformInteractions();
    setupMinimapInteractions();
    renderTrickyPresets();
    applyLanguage("ja");
    updateTimeReadouts();
    requestRender();
    decodeHighResWaveformAsync();
})();
