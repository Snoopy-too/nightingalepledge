<?php
declare(strict_types=1);

namespace NightingalePledge\Application\UseCase;

use NightingalePledge\Domain\Port\PledgeRepositoryInterface;

final class GetPracticeStudioSessionUseCase
{
    public function __construct(
        private readonly PledgeRepositoryInterface $pledgeRepository
    ) {
    }

    /**
     * @return array{
     *   audio: array<string, mixed>,
     *   segments: list<array<string, int|float|string>>,
     *   sentences: list<array{partNumber: int, title: string, startTime: float, endTime: float, text: string}>
     * }
     */
    public function execute(): array
    {
        $audioMetadata = $this->pledgeRepository->getAudioMetadata();
        $segments = $this->pledgeRepository->getSegments();
        $sentenceGroups = $this->pledgeRepository->getSentenceGroups();

        $serializedSegments = [];
        foreach ($segments as $segment) {
            $serializedSegments[] = $segment->toArray();
        }

        return [
            'audio' => $audioMetadata->toArray(),
            'segments' => $serializedSegments,
            'sentences' => $sentenceGroups,
        ];
    }
}
