<?php
declare(strict_types=1);

namespace NightingalePledge\Domain\Port;

use NightingalePledge\Domain\Entity\AudioMetadata;
use NightingalePledge\Domain\Entity\PledgeSegment;

interface PledgeRepositoryInterface
{
    public function getAudioMetadata(): AudioMetadata;

    /**
     * @return list<PledgeSegment>
     */
    public function getSegments(): array;

    /**
     * @return list<array{partNumber: int, title: string, startTime: float, endTime: float, text: string}>
     */
    public function getSentenceGroups(): array;
}
