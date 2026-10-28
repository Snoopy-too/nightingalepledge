<?php
declare(strict_types=1);

namespace NightingalePledge\Domain\Entity;

final class PledgeSegment
{
    public function __construct(
        private readonly string $id,
        private readonly int $partNumber,
        private readonly string $partTitle,
        private readonly string $partTitleJa,
        private readonly string $clauseLabel,
        private readonly string $clauseLabelJa,
        private readonly string $text,
        private readonly string $phoneticHint,
        private readonly float $startTime,
        private readonly float $endTime
    ) {
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getPartNumber(): int
    {
        return $this->partNumber;
    }

    public function getPartTitle(): string
    {
        return $this->partTitle;
    }

    public function getPartTitleJa(): string
    {
        return $this->partTitleJa;
    }

    public function getClauseLabel(): string
    {
        return $this->clauseLabel;
    }

    public function getClauseLabelJa(): string
    {
        return $this->clauseLabelJa;
    }

    public function getText(): string
    {
        return $this->text;
    }

    public function getPhoneticHint(): string
    {
        return $this->phoneticHint;
    }

    public function getStartTime(): float
    {
        return $this->startTime;
    }

    public function getEndTime(): float
    {
        return $this->endTime;
    }

    /**
     * @return array<string, int|float|string>
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'partNumber' => $this->partNumber,
            'partTitle' => $this->partTitle,
            'partTitleJa' => $this->partTitleJa,
            'clauseLabel' => $this->clauseLabel,
            'clauseLabelJa' => $this->clauseLabelJa,
            'text' => $this->text,
            'phoneticHint' => $this->phoneticHint,
            'startTime' => $this->startTime,
            'endTime' => $this->endTime,
        ];
    }
}
