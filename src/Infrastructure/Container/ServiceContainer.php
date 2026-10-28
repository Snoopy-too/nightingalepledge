<?php
declare(strict_types=1);

namespace NightingalePledge\Infrastructure\Container;

use InvalidArgumentException;

final class ServiceContainer
{
    /** @var array<string, callable(self): object> */
    private array $factories = [];

    /** @var array<string, object> */
    private array $instances = [];

    /**
     * @param string $id
     * @param callable(self): object $factory
     */
    public function set(string $id, callable $factory): void
    {
        $this->factories[$id] = $factory;
        unset($this->instances[$id]);
    }

    public function get(string $id): object
    {
        if (isset($this->instances[$id])) {
            return $this->instances[$id];
        }

        if (!isset($this->factories[$id])) {
            throw new InvalidArgumentException(sprintf('Service "%s" is not registered in the container.', $id));
        }

        $resolved = ($this->factories[$id])($this);
        $this->instances[$id] = $resolved;

        return $resolved;
    }
}
