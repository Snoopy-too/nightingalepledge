<?php
declare(strict_types=1);

namespace NightingalePledge\Infrastructure\Http;

final class HtmlSanitizer
{
    public function escapeHtml(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    }

    public function escapeAttr(string $value): string
    {
        return htmlspecialchars($value, ENT_QUOTES | ENT_HTML5 | ENT_SUBSTITUTE, 'UTF-8');
    }

    /**
     * Safely encodes data for embedding inside a <script type="application/json"> block.
     *
     * @param mixed $data
     */
    public function encodeSafeJson(mixed $data): string
    {
        $encoded = json_encode(
            $data,
            JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
        );

        return $encoded;
    }
}
