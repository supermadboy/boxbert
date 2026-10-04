#pragma once

#include <cstddef>
#include <cstdint>
#include <cstring>

// Vom Nutzer bestaetigt; neue UID-/Dateilisten-Tests: hardware/nfc-tags.md.
struct TagBinding {
    uint8_t uid[4];
    const char *name;
    const char *path;
};

inline constexpr TagBinding TAG_BINDINGS[] = {
    {{0xE3, 0x2F, 0xF6, 0x33}, "TAG1", "/arcade-music-loop.mp3"},
    {{0x01, 0x8C, 0xF1, 0x6E}, "TAG2", "/happy-tune.mp3"},
};

inline const TagBinding *findTagBinding(const uint8_t *uid, size_t length) {
    if (uid == nullptr || length != sizeof(TAG_BINDINGS[0].uid)) return nullptr;
    for (const auto &binding : TAG_BINDINGS) {
        if (std::memcmp(uid, binding.uid, length) == 0) return &binding;
    }
    return nullptr; // Unbekannt: kein Fallback-Lied.
}

// Nur feste Datenkopien zwischen NFC-Task und Hauptloop; keine Audio-
// oder SD-Aufrufe aus der NFC-Task, keine geteilten mutable Zaehler.
struct NfcEvent {
    uint8_t uid[7] = {};
    uint8_t length = 0;
    bool changed = false;
    bool failed = false;
    uint32_t detectedMs = 0; // Zeit direkt nach erfolgreicher UID-Lesung, vor Queue.
    uint32_t reads = 0;
    uint32_t switches = 0;
};
