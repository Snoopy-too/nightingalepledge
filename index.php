<?php
declare(strict_types=1);

require_once __DIR__ . '/src/Domain/Entity/PledgeSegment.php';
require_once __DIR__ . '/src/Domain/Entity/AudioMetadata.php';
require_once __DIR__ . '/src/Domain/Port/PledgeRepositoryInterface.php';
require_once __DIR__ . '/src/Application/UseCase/GetPracticeStudioSessionUseCase.php';
require_once __DIR__ . '/src/Infrastructure/Container/ServiceContainer.php';
require_once __DIR__ . '/src/Infrastructure/Http/HtmlSanitizer.php';
require_once __DIR__ . '/src/Infrastructure/Persistence/LocalPledgeRepository.php';

use NightingalePledge\Application\UseCase\GetPracticeStudioSessionUseCase;
use NightingalePledge\Domain\Port\PledgeRepositoryInterface;
use NightingalePledge\Infrastructure\Container\ServiceContainer;
use NightingalePledge\Infrastructure\Http\HtmlSanitizer;
use NightingalePledge\Infrastructure\Persistence\LocalPledgeRepository;

$container = new ServiceContainer();

$container->set(HtmlSanitizer::class, static function (): HtmlSanitizer {
    return new HtmlSanitizer();
});

$container->set(PledgeRepositoryInterface::class, static function (): PledgeRepositoryInterface {
    return new LocalPledgeRepository(
        peaksJsonPath: __DIR__ . '/assets/audio/waveform_peaks.json',
        publicAudioUrl: 'assets/audio/nightingale_pledge.wav'
    );
});

$container->set(GetPracticeStudioSessionUseCase::class, static function (ServiceContainer $c): GetPracticeStudioSessionUseCase {
    /** @var PledgeRepositoryInterface $repo */
    $repo = $c->get(PledgeRepositoryInterface::class);
    return new GetPracticeStudioSessionUseCase($repo);
});

/** @var HtmlSanitizer $sanitizer */
$sanitizer = $container->get(HtmlSanitizer::class);
/** @var GetPracticeStudioSessionUseCase $useCase */
$useCase = $container->get(GetPracticeStudioSessionUseCase::class);

$sessionData = $useCase->execute();
$audio = $sessionData['audio'];
$segments = $sessionData['segments'];
$sentences = $sessionData['sentences'];

/** @var array<int, list<array<string, int|float|string>>> $segmentsByPart */
$segmentsByPart = [];
foreach ($segments as $seg) {
    $partNum = (int) $seg['partNumber'];
    $segmentsByPart[$partNum][] = $seg;
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <title>The Nightingale Pledge — 赤十字看護学校 発音・リズム練習スタジオ</title>
    <link rel="stylesheet" href="assets/css/studio.css?v=1.2.0">
</head>
<body>

    <header class="app-header">
        <div class="header-inner">
            <div class="brand-group">
                <div class="red-cross-emblem" aria-hidden="true"></div>
                <div class="brand-titles">
                    <h1 id="headerTitle">The Nightingale Pledge — 発音・リズム練習スタジオ</h1>
                    <p id="headerSubtitle">赤十字看護学校 — ネイティブ音声による発音・リズム・イントネーション練習</p>
                </div>
            </div>
            <div class="header-badges">
                <div id="studioStatusPill" class="status-pill ready-state" role="status" aria-live="polite">
                    <span class="status-dot"></span>
                    <span id="studioStatusText">準備完了 — 波形をドラッグするか下のフレーズをタップしてください</span>
                </div>

                <button type="button" id="openHelpModalBtn" class="help-btn">
                    <span>❓</span>
                    <span data-i18n="helpBtn">使い方ガイド</span>
                </button>

                <!-- Language Selector (Default: Japanese) -->
                <div class="lang-switcher" role="group" aria-label="Language Selector / 言語選択">
                    <button type="button" class="lang-btn active" data-lang="ja" aria-pressed="true">日本語</button>
                    <button type="button" class="lang-btn" data-lang="en" aria-pressed="false">English</button>
                </div>
            </div>
        </div>
    </header>

    <main class="studio-container">

        <!-- Audacity-Style Waveform & Playback Studio Deck -->
        <section class="waveform-deck" aria-label="Waveform Audio Control Studio">

            <!-- Top Time Readouts & Zoom Toolbar -->
            <div class="deck-topbar">
                <div class="time-readouts">
                    <div class="digital-clock">
                        <span class="clock-label" data-i18n="playheadLabel">再生位置</span>
                        <span id="currentTimeReadout" class="clock-value">0:00.00 / 0:59.39</span>
                    </div>
                    <div class="digital-clock">
                        <span class="clock-label" data-i18n="selectionLabel">選択範囲</span>
                        <span id="selectionReadout" class="clock-value selection-clock">全体（波形をドラッグ、または下のフレーズをタップして範囲選択）</span>
                    </div>
                </div>

                <div class="zoom-toolbar" role="toolbar" aria-label="Waveform Zoom and Selection Controls">
                    <button type="button" id="zoomInBtn" class="deck-tool-btn">
                        <span data-i18n="zoomIn">＋ 拡大</span>
                    </button>
                    <button type="button" id="zoomOutBtn" class="deck-tool-btn">
                        <span data-i18n="zoomOut">－ 縮小</span>
                    </button>
                    <button type="button" id="zoomSelBtn" class="deck-tool-btn" disabled>
                        <span data-i18n="zoomSel">🔍 選択範囲に合わせる</span>
                    </button>
                    <button type="button" id="zoomFitBtn" class="deck-tool-btn">
                        <span data-i18n="zoomFit">⇄ 全体表示</span>
                    </button>
                    <button type="button" id="clearSelBtn" class="deck-tool-btn warn-btn" disabled>
                        <span data-i18n="clearSel">✕ 選択解除</span>
                    </button>
                </div>
            </div>

            <!-- Overview Minimap Track -->
            <div class="minimap-wrapper">
                <span class="minimap-label" data-i18n="overviewLabel">全体トラック (59.4秒) — タップ・ドラッグで表示位置を移動</span>
                <canvas id="minimapCanvas"></canvas>
            </div>

            <!-- Main Interactive Audacity-Style Waveform Canvas -->
            <div class="waveform-viewport">
                <div id="shadowCountdownBar" class="shadow-countdown-bar" role="status" aria-live="assertive">
                    <span id="shadowCountdownText">あなたの番です！声に出して練習しましょう</span>
                </div>
                <canvas id="waveformCanvas"></canvas>
                <div class="waveform-instruction-overlay">
                    <span data-i18n="waveformTip">💡 波形をドラッグして範囲を選択 • 黄色い <strong>IN ◄</strong> / <strong>► OUT</strong> タブで微調整</span>
                </div>
            </div>

            <!-- Live Phrase Caption, Phonetics & Fine Selection Trim Nudgers -->
            <div class="live-caption-strip">
                <div class="caption-main">
                    <span id="captionClauseTag" class="caption-clause-tag">準備完了 • The Nightingale Pledge</span>
                    <div id="captionText" class="caption-text">
                        波形をドラッグして単語やフレーズを選択するか、下のリストをタップしてください。
                    </div>
                    <div id="captionPhonetic" class="caption-phonetic">
                        初期設定：「1回再生して待機」モード（選択範囲の最後で自動停止し、開始位置に戻って次の再生に備えます）
                    </div>
                </div>

                <div class="selection-nudge-group" aria-label="Fine Selection Trim Controls">
                    <div class="nudge-cluster">
                        <span class="nudge-label" data-i18n="nudgeStartLabel">開始位置 (IN)</span>
                        <button type="button" id="nudgeInMinus" class="nudge-btn" disabled>-0.1s</button>
                        <button type="button" id="nudgeInPlus" class="nudge-btn" disabled>+0.1s</button>
                    </div>
                    <div class="nudge-cluster">
                        <span class="nudge-label" data-i18n="nudgeEndLabel">終了位置 (OUT)</span>
                        <button type="button" id="nudgeOutMinus" class="nudge-btn" disabled>-0.1s</button>
                        <button type="button" id="nudgeOutPlus" class="nudge-btn" disabled>+0.1s</button>
                    </div>
                </div>
            </div>

            <!-- Primary Transport, Practice Mode & Speed Controls -->
            <div class="transport-deck">

                <!-- Left: Play, Replay Selection, Stop/Reset, Skip -->
                <div class="transport-primary">
                    <button type="button" id="playPauseBtn" class="btn-play-main">
                        <span>▶</span>
                        <span id="playPauseLabel">再生</span>
                    </button>
                    <button type="button" id="replaySelectionBtn" class="btn-transport replay-sel-btn" disabled>
                        <span data-i18n="replayHighlight">↺ 選択範囲を最初から</span>
                    </button>
                    <button type="button" id="stopResetBtn" class="btn-transport">
                        <span data-i18n="stopAndReady">■ 停止して開始位置へ</span>
                    </button>
                    <button type="button" id="skipBackBtn" class="btn-transport">
                        <span>« 2s</span>
                    </button>
                    <button type="button" id="skipFwdBtn" class="btn-transport">
                        <span>2s »</span>
                    </button>
                </div>

                <!-- Middle: Selection Playback Mode -->
                <div class="practice-mode-box">
                    <div class="control-group-title">
                        <span data-i18n="whenSelectionEnds">選択範囲の再生が終わったとき：</span>
                    </div>
                    <div class="mode-segmented" role="group" aria-label="Selection Playback Mode">
                        <button type="button" class="mode-option-btn active" data-mode="stop-ready">
                            <span data-i18n="modeStopReady">⏹ 1回再生して待機</span>
                        </button>
                        <button type="button" class="mode-option-btn" data-mode="shadow">
                            <span data-i18n="modeShadow">🗣 反復の間を空ける</span>
                        </button>
                        <button type="button" class="mode-option-btn" data-mode="loop">
                            <span data-i18n="modeLoop">🔁 連続ループ再生</span>
                        </button>
                    </div>
                </div>

                <!-- Right: Pitch-Preserving Speed Control -->
                <div class="speed-control-box">
                    <div class="control-group-title">
                        <span data-i18n="speedLabel">再生スピード（声の高さ維持）</span>
                        <strong id="speedValueLabel" style="color: #facc15;">1.0×</strong>
                    </div>
                    <div class="speed-presets" role="group" aria-label="Preset Playback Speeds">
                        <button type="button" class="speed-pill" data-speed="0.5">0.5×</button>
                        <button type="button" class="speed-pill" data-speed="0.65">0.65×</button>
                        <button type="button" class="speed-pill" data-speed="0.75">0.75×</button>
                        <button type="button" class="speed-pill" data-speed="0.85">0.85×</button>
                        <button type="button" class="speed-pill active" data-speed="1.0">1.0×</button>
                        <button type="button" class="speed-pill" data-speed="1.15">1.15×</button>
                    </div>
                    <div class="speed-slider-row">
                        <span style="font-size: 0.72rem; color: #94a3b8;" data-i18n="slow">ゆっくり</span>
                        <input type="range" id="speedSlider" class="speed-slider" min="0.50" max="1.40" step="0.05" value="1.00" aria-label="Fine Playback Speed Slider">
                        <span style="font-size: 0.72rem; color: #94a3b8;" data-i18n="fast">速い</span>
                    </div>
                </div>

            </div>

            <!-- Native HTML5 Audio Element (Preloaded, Pitch-Preserved) -->
            <audio id="pledgeAudio" preload="auto" src="<?= $sanitizer->escapeAttr((string) $audio['audioUrl']) ?>"></audio>
        </section>

        <!-- Quick Focus: Tricky Vocabulary Chips & Student Saved Bookmarks -->
        <section class="quick-focus-card" aria-label="Quick Vocabulary Focus and Saved Clips">
            <div class="focus-row">
                <span class="focus-row-label" data-i18n="vocabFocusLabel">🎯 重要単語・フレーズ集中練習：</span>
                <div id="trickyPresetsContainer" class="focus-row"></div>
            </div>
            <div class="focus-row" style="border-top: 1px solid #f1f5f9; padding-top: 0.6rem;">
                <span class="focus-row-label" data-i18n="savedHighlightsLabel">⭐ マイ保存リスト：</span>
                <button type="button" id="saveBookmarkBtn" class="vocab-chip" style="background: #eff6ff; border-color: #93c5fd; color: #1d4ed8;" disabled>
                    <span data-i18n="saveCurrentHighlight">＋ 現在の選択範囲を保存</span>
                </button>
                <div id="customBookmarksContainer" class="focus-row"></div>
            </div>
        </section>

        <!-- Main Workspace Grid: Interactive Pledge Script & Student Self-Check -->
        <div class="workspace-grid">

            <!-- Left Column: Interactive Synchronized Nightingale Pledge Script -->
            <section class="section-card" aria-label="Interactive Nightingale Pledge Transcript">
                <div class="section-header">
                    <div>
                        <h2 data-i18n="scriptSectionTitle">The Nightingale Pledge — フレーズ別練習リスト</h2>
                        <p class="section-subtitle" data-i18n="scriptSectionSubtitle">練習したいフレーズや文をタップすると、波形上で自動選択されてすぐに再生されます。</p>
                    </div>
                </div>

                <?php foreach ($sentences as $sentence): ?>
                    <?php
                    $partNum = (int) $sentence['partNumber'];
                    $partClauses = $segmentsByPart[$partNum] ?? [];
                    ?>
                    <div class="sentence-group">
                        <div class="sentence-group-header">
                            <span
                                class="sentence-group-title"
                                data-title-ja="<?= $sanitizer->escapeAttr((string) $sentence['titleJa']) ?>"
                                data-title-en="<?= $sanitizer->escapeAttr((string) $sentence['title']) ?>"
                            ><?= $sanitizer->escapeHtml((string) $sentence['titleJa']) ?></span>
                            <button
                                type="button"
                                class="btn-select-sentence"
                                data-start="<?= $sanitizer->escapeAttr((string) $sentence['startTime']) ?>"
                                data-end="<?= $sanitizer->escapeAttr((string) $sentence['endTime']) ?>"
                                data-range-label="<?= $sanitizer->escapeAttr(number_format((float) $sentence['startTime'], 1) . 's–' . number_format((float) $sentence['endTime'], 1) . 's') ?>"
                            >
                                ▶ この文全体を選択して再生 (<?= $sanitizer->escapeHtml(number_format((float) $sentence['startTime'], 1)) ?>s–<?= $sanitizer->escapeHtml(number_format((float) $sentence['endTime'], 1)) ?>s)
                            </button>
                        </div>
                        <div class="clause-list">
                            <?php foreach ($partClauses as $clause): ?>
                                <button
                                    type="button"
                                    class="clause-item"
                                    data-id="<?= $sanitizer->escapeAttr((string) $clause['id']) ?>"
                                    data-start="<?= $sanitizer->escapeAttr((string) $clause['startTime']) ?>"
                                    data-end="<?= $sanitizer->escapeAttr((string) $clause['endTime']) ?>"
                                >
                                    <div class="clause-content">
                                        <span class="clause-text"><?= $sanitizer->escapeHtml((string) $clause['text']) ?></span>
                                        <span class="clause-phonetic"><?= $sanitizer->escapeHtml((string) $clause['phoneticHint']) ?></span>
                                    </div>
                                    <div class="clause-meta">
                                        <span class="clause-time-badge">
                                            <?= $sanitizer->escapeHtml(number_format((float) $clause['startTime'], 2)) ?>s – <?= $sanitizer->escapeHtml(number_format((float) $clause['endTime'], 2)) ?>s
                                        </span>
                                    </div>
                                </button>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </section>

            <!-- Right Column: Self-Check Recorder & How-to-Practice Guide -->
            <div class="side-stack">

                <!-- Optional Voice Mirror (Self-Check Recorder) -->
                <section class="section-card">
                    <div class="section-header">
                        <div>
                            <h2 data-i18n="voiceMirrorTitle">🎙 自分の声を録音して比較（セルフチェック）</h2>
                            <p class="section-subtitle" data-i18n="voiceMirrorSubtitle">自分の暗唱を録音して、先生の発音やリズムと聴き比べることができます。</p>
                        </div>
                    </div>
                    <div class="voice-mirror-box">
                        <div class="mirror-actions">
                            <button type="button" id="recordSelfBtn" class="btn-record">
                                ● 自分の声を録音する
                            </button>
                        </div>
                        <audio id="studentAudioPlayback" class="student-audio-player" controls style="display: none;"></audio>
                    </div>
                </section>

                <!-- Student Practice Guide -->
                <section class="section-card">
                    <div class="section-header">
                        <div>
                            <h2 data-i18n="guideTitle">📖 自宅での効果的な練習方法</h2>
                            <p class="section-subtitle" data-i18n="guideSubtitle">iPad・タブレット・スマートフォン・パソコンすべてに対応しています。</p>
                        </div>
                    </div>
                    <ul class="guide-list" id="guideListContainer">
                        <li data-i18n-html="guideItem1">
                            <strong>波形の好きな部分をハイライト選択：</strong> 青い波形の上を指やマウスでドラッグすると、1単語だけでも、1フレーズでも自由に選択できます。
                        </li>
                        <li data-i18n-html="guideItem2">
                            <strong>「1回再生して待機」モード（初期設定）：</strong> 選択範囲を再生すると、<strong>選んだ部分の最後で自動的に一時停止し、再生位置が選択範囲の先頭に自動で戻ります</strong>。自分のペースで発音練習をしてから、もう一度再生ボタンを押すだけですぐに同じ箇所を聴き直せます。
                        </li>
                        <li data-i18n-html="guideItem3">
                            <strong>選択範囲の微調整：</strong> 波形上の黄色い <strong>IN ◄</strong> と <strong>► OUT</strong> タブをドラッグするか、<strong>-0.1s / +0.1s</strong> ボタンで細かく調整できます。
                        </li>
                        <li data-i18n-html="guideItem4">
                            <strong>声の高さを変えずに速度変更：</strong> <strong>0.65×</strong>、<strong>0.75×</strong>、<strong>0.85×</strong> を選ぶと、自然な声のままゆっくり発音を確認できます。
                        </li>
                        <li data-i18n-html="guideItem5">
                            <strong>キーボードショートカット（PC / iPadキーボード）：</strong>
                            <span class="kbd-badge">Space</span> で再生/一時停止、<span class="kbd-badge">R</span> で選択範囲を最初から再生、<span class="kbd-badge">Esc</span> で選択解除。
                        </li>
                    </ul>
                </section>

            </div>

        </div>

    </main>

    <!-- Localized Modal Dialog (Help Guide & System Notices) -->
    <div id="studioModal" class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="studioModalTitle">
        <div class="modal-card">
            <div class="modal-header">
                <h3 id="studioModalTitle">使い方ガイド</h3>
                <button type="button" id="closeModalCrossBtn" class="modal-close-btn" aria-label="Close">✕</button>
            </div>
            <div id="studioModalBody" class="modal-body"></div>
            <div class="modal-footer">
                <button type="button" id="closeModalFooterBtn" class="modal-primary-btn">閉じる</button>
            </div>
        </div>
    </div>

    <script id="studio-boot-data" type="application/json"><?= $sanitizer->encodeSafeJson($sessionData) ?></script>
    <script src="assets/js/studio.js?v=1.2.0" defer></script>
</body>
</html>
