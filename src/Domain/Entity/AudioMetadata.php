<?php
declare(strict_types=1);

namespace NightingalePledge\Domain\Entity;

final class AudioMetadata
{
    /**
     * @param list<float> $peaks
     * @param list<float> $rms
     */
    public function __construct(
        private readonly string $title,
        private readonly string $subtitle,
        private readonly string $audioUrl,
        private readonly float $duration,
        private readonly int $sampleRate,
        private readonly int $channels,
        private readonly array $peaks,
        private readonly array $rms
    ) {
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getSubtitle(): string
    {
        return $this->subtitle;
    }

    public function getAudioUrl(): string
    {
        return $this->audioUrl;
    }

    public function getDuration(): float
    {
        return $this->duration;
    }

    public function getSampleRate(): int
    {
        return $this->sampleRate;
    }

    public function getChannels(): int
    {
        return $this->channels;
    }

    /**
     * @return list<float>
     */
    public function getPeaks(): array
    {
        return $this->peaks;
    }

    /**
     * @return list<float>
     */
    public function getRms(): array
    {
        return $this->rms;
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'audioUrl' => $this->audioUrl,
            'duration' => $this->duration,
            'sampleRate' => $this->sampleRate,
            'channels' => $this->channels,
            'peaks' => $this->peaks,
            'rms' => $this->rms,
        ];
    }
}
