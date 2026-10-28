<?php
declare(strict_types=1);

namespace NightingalePledge\Infrastructure\Persistence;

use NightingalePledge\Domain\Entity\AudioMetadata;
use NightingalePledge\Domain\Entity\PledgeSegment;
use NightingalePledge\Domain\Port\PledgeRepositoryInterface;

final class LocalPledgeRepository implements PledgeRepositoryInterface
{
    public function __construct(
        private readonly string $peaksJsonPath,
        private readonly string $publicAudioUrl
    ) {
    }

    public function getAudioMetadata(): AudioMetadata
    {
        $duration = 59.385;
        $sampleRate = 44100;
        $channels = 2;
        /** @var list<float> $peaks */
        $peaks = [];
        /** @var list<float> $rms */
        $rms = [];

        if (is_readable($this->peaksJsonPath)) {
            $raw = file_get_contents($this->peaksJsonPath);
            if (is_string($raw) && $raw !== '') {
                $decoded = json_decode($raw, true);
                if (is_array($decoded)) {
                    $duration = isset($decoded['duration']) ? (float) $decoded['duration'] : $duration;
                    $sampleRate = isset($decoded['sampleRate']) ? (int) $decoded['sampleRate'] : $sampleRate;
                    $channels = isset($decoded['channels']) ? (int) $decoded['channels'] : $channels;

                    if (isset($decoded['peaks']) && is_array($decoded['peaks'])) {
                        $rawPeaks = isset($decoded['peaks']['value']) && is_array($decoded['peaks']['value'])
                            ? $decoded['peaks']['value']
                            : $decoded['peaks'];
                        foreach ($rawPeaks as $val) {
                            if (is_int($val) || is_float($val) || (is_string($val) && is_numeric($val))) {
                                $peaks[] = (float) $val;
                            }
                        }
                    }

                    if (isset($decoded['rms']) && is_array($decoded['rms'])) {
                        $rawRms = isset($decoded['rms']['value']) && is_array($decoded['rms']['value'])
                            ? $decoded['rms']['value']
                            : $decoded['rms'];
                        foreach ($rawRms as $val) {
                            if (is_int($val) || is_float($val) || (is_string($val) && is_numeric($val))) {
                                $rms[] = (float) $val;
                            }
                        }
                    }
                }
            }
        }

        return new AudioMetadata(
            title: 'The Nightingale Pledge',
            subtitle: '赤十字看護学校 — 発音・リズム・イントネーション練習スタジオ',
            audioUrl: $this->publicAudioUrl,
            duration: $duration,
            sampleRate: $sampleRate,
            channels: $channels,
            peaks: $peaks,
            rms: $rms
        );
    }

    /**
     * @return list<PledgeSegment>
     */
    public function getSegments(): array
    {
        return [
            new PledgeSegment(
                id: 'seg-01',
                partNumber: 1,
                partTitle: 'Sentence 1: Solemn Vow & Faithfulness',
                partTitleJa: '第1文：厳粛な誓いと誠実な職務の実践',
                clauseLabel: 'Clause 1.1',
                clauseLabelJa: 'フレーズ 1.1',
                text: 'I solemnly pledge myself before God',
                phoneticHint: 'I SOL-emn-ly [ˈsɑː.ləm.li] PLEDGE my-SELF be-fore GOD',
                startTime: 1.38,
                endTime: 4.18
            ),
            new PledgeSegment(
                id: 'seg-02',
                partNumber: 1,
                partTitle: 'Sentence 1: Solemn Vow & Faithfulness',
                partTitleJa: '第1文：厳粛な誓いと誠実な職務の実践',
                clauseLabel: 'Clause 1.2',
                clauseLabelJa: 'フレーズ 1.2',
                text: 'and in the presence of this assembly,',
                phoneticHint: 'and in the PRES-ence [ˈprez.əns] of this as-SEM-bly [əˈsem.bli]',
                startTime: 4.50,
                endTime: 7.08
            ),
            new PledgeSegment(
                id: 'seg-03',
                partNumber: 1,
                partTitle: 'Sentence 1: Solemn Vow & Faithfulness',
                partTitleJa: '第1文：厳粛な誓いと誠実な職務の実践',
                clauseLabel: 'Clause 1.3',
                clauseLabelJa: 'フレーズ 1.3',
                text: 'to pass my life in purity',
                phoneticHint: 'to PASS my LIFE // in PU-ri-ty [ˈpjʊr.ə.t̬i]',
                startTime: 7.40,
                endTime: 9.95
            ),
            new PledgeSegment(
                id: 'seg-04',
                partNumber: 1,
                partTitle: 'Sentence 1: Solemn Vow & Faithfulness',
                partTitleJa: '第1文：厳粛な誓いと誠実な職務の実践',
                clauseLabel: 'Clause 1.4',
                clauseLabelJa: 'フレーズ 1.4',
                text: 'and to practice my profession faithfully.',
                phoneticHint: 'and to PRAC-tice my pro-FES-sion [prəˈfeʃ.ən] FAITH-ful-ly [ˈfeɪθ.fəl.i]',
                startTime: 10.15,
                endTime: 12.90
            ),
            new PledgeSegment(
                id: 'seg-05',
                partNumber: 2,
                partTitle: 'Sentence 2: Do No Harm',
                partTitleJa: '第2文：害悪の忌避と安全な与薬の誓い',
                clauseLabel: 'Clause 2.1',
                clauseLabelJa: 'フレーズ 2.1',
                text: 'I will abstain from whatever is deleterious and mischievous,',
                phoneticHint: 'I will ab-STAIN [æbˈsteɪn] // from what-EV-er is del-e-TE-ri-ous [ˌdel.əˈtɪr.i.əs] and MIS-chie-vous [ˈmɪs.tʃə.vəs]',
                startTime: 13.90,
                endTime: 19.05
            ),
            new PledgeSegment(
                id: 'seg-06',
                partNumber: 2,
                partTitle: 'Sentence 2: Do No Harm',
                partTitleJa: '第2文：害悪の忌避と安全な与薬の誓い',
                clauseLabel: 'Clause 2.2',
                clauseLabelJa: 'フレーズ 2.2',
                text: 'and will not take or knowingly administer any harmful drug.',
                phoneticHint: 'and will NOT TAKE // or KNOW-ing-ly ad-MIN-is-ter [ədˈmɪn.ə.stɚ] AN-y HARM-ful DRUG',
                startTime: 19.50,
                endTime: 24.45
            ),
            new PledgeSegment(
                id: 'seg-07',
                partNumber: 3,
                partTitle: 'Sentence 3: Professional Standards & Confidentiality',
                partTitleJa: '第3文：看護水準の向上と守秘義務',
                clauseLabel: 'Clause 3.1',
                clauseLabelJa: 'フレーズ 3.1',
                text: 'I will do all in my power to maintain',
                phoneticHint: 'I will do ALL in my POW-er to main-TAIN [meɪnˈteɪn]',
                startTime: 25.25,
                endTime: 28.65
            ),
            new PledgeSegment(
                id: 'seg-08',
                partNumber: 3,
                partTitle: 'Sentence 3: Professional Standards & Confidentiality',
                partTitleJa: '第3文：看護水準の向上と守秘義務',
                clauseLabel: 'Clause 3.2',
                clauseLabelJa: 'フレーズ 3.2',
                text: 'and elevate the standard of my profession,',
                phoneticHint: 'and EL-e-vate [ˈel.ə.veɪt] the STAN-dard of my pro-FES-sion',
                startTime: 29.30,
                endTime: 32.60
            ),
            new PledgeSegment(
                id: 'seg-09',
                partNumber: 3,
                partTitle: 'Sentence 3: Professional Standards & Confidentiality',
                partTitleJa: '第3文：看護水準の向上と守秘義務',
                clauseLabel: 'Clause 3.3',
                clauseLabelJa: 'フレーズ 3.3',
                text: 'and will hold in confidence',
                phoneticHint: 'and will HOLD in CON-fi-dence [ˈkɑːn.fə.dəns]',
                startTime: 33.15,
                endTime: 35.72
            ),
            new PledgeSegment(
                id: 'seg-10',
                partNumber: 3,
                partTitle: 'Sentence 3: Professional Standards & Confidentiality',
                partTitleJa: '第3文：看護水準の向上と守秘義務',
                clauseLabel: 'Clause 3.4',
                clauseLabelJa: 'フレーズ 3.4',
                text: 'all personal matters committed to my keeping',
                phoneticHint: 'ALL PER-son-al MAT-ters com-MIT-ted to my KEEP-ing',
                startTime: 35.95,
                endTime: 39.20
            ),
            new PledgeSegment(
                id: 'seg-11',
                partNumber: 3,
                partTitle: 'Sentence 3: Professional Standards & Confidentiality',
                partTitleJa: '第3文：看護水準の向上と守秘義務',
                clauseLabel: 'Clause 3.5',
                clauseLabelJa: 'フレーズ 3.5',
                text: 'and all family affairs coming to my knowledge in the practice of my calling.',
                phoneticHint: 'and ALL FAM-i-ly af-FAIRS com-ing to my KNOWL-edge [ˈnɑː.lɪdʒ] // in the PRAC-tice of my CALL-ing',
                startTime: 39.70,
                endTime: 45.75
            ),
            new PledgeSegment(
                id: 'seg-12',
                partNumber: 4,
                partTitle: 'Sentence 4: Loyalty & Devotion to Patient Welfare',
                partTitleJa: '第4文：医師への協力と患者の福利への献身',
                clauseLabel: 'Clause 4.1',
                clauseLabelJa: 'フレーズ 4.1',
                text: 'With loyalty will I endeavor to aid the physician in his work',
                phoneticHint: 'With LOY-al-ty [ˈlɔɪ.əl.ti] will I en-DEAV-or [enˈdev.ɚ] to AID the phy-SI-cian [fɪˈzɪʃ.ən] // in his WORK',
                startTime: 46.65,
                endTime: 52.25
            ),
            new PledgeSegment(
                id: 'seg-13',
                partNumber: 4,
                partTitle: 'Sentence 4: Loyalty & Devotion to Patient Welfare',
                partTitleJa: '第4文：医師への協力と患者の福利への献身',
                clauseLabel: 'Clause 4.2',
                clauseLabelJa: 'フレーズ 4.2',
                text: 'and devote myself to the welfare of those committed to my care.',
                phoneticHint: 'and de-VOTE my-SELF // to the WEL-fare [ˈwel.fer] of THOSE com-MIT-ted to my CARE',
                startTime: 52.60,
                endTime: 58.20
            ),
        ];
    }

    /**
     * @return list<array{partNumber: int, title: string, titleJa: string, startTime: float, endTime: float, text: string}>
     */
    public function getSentenceGroups(): array
    {
        return [
            [
                'partNumber' => 1,
                'title' => 'Part 1: Solemn Vow & Faithfulness',
                'titleJa' => '第1文：厳粛な誓いと誠実な職務の実践',
                'startTime' => 1.38,
                'endTime' => 12.90,
                'text' => 'I solemnly pledge myself before God and in the presence of this assembly, to pass my life in purity and to practice my profession faithfully.',
            ],
            [
                'partNumber' => 2,
                'title' => 'Part 2: Abstinence from Harm',
                'titleJa' => '第2文：害悪の忌避と安全な与薬の誓い',
                'startTime' => 13.90,
                'endTime' => 24.45,
                'text' => 'I will abstain from whatever is deleterious and mischievous, and will not take or knowingly administer any harmful drug.',
            ],
            [
                'partNumber' => 3,
                'title' => 'Part 3: Standards & Confidentiality',
                'titleJa' => '第3文：看護水準の向上と守秘義務',
                'startTime' => 25.25,
                'endTime' => 45.75,
                'text' => 'I will do all in my power to maintain and elevate the standard of my profession, and will hold in confidence all personal matters committed to my keeping and all family affairs coming to my knowledge in the practice of my calling.',
            ],
            [
                'partNumber' => 4,
                'title' => 'Part 4: Loyalty & Patient Welfare',
                'titleJa' => '第4文：医師への協力と患者の福利への献身',
                'startTime' => 46.65,
                'endTime' => 58.20,
                'text' => 'With loyalty will I endeavor to aid the physician in his work and devote myself to the welfare of those committed to my care.',
            ],
        ];
    }
}
