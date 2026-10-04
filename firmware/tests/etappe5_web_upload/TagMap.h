#pragma once
#include <cstddef>
#include <cstdint>
#include <cstring>

// Verbindliche UIDs/Default-Pfade: hardware/nfc-tags.md. Keine neuen
// Tags in diesem Breadboard-Scope, keine Tags beschreiben.
struct TagBinding {
    uint8_t uid[4];
    const char *name;
    const char *path;
};
inline constexpr TagBinding TAG_BINDINGS[] = {
    {{0xE3, 0x2F, 0xF6, 0x33}, "TAG1", "/arcade-music-loop.mp3"},
    {{0x01, 0x8C, 0xF1, 0x6E}, "TAG2", "/happy-tune.mp3"},
};
inline constexpr const char *TAG_UIDS[] = {"E3:2F:F6:33", "01:8C:F1:6E"};
inline const TagBinding *findTagBinding(const uint8_t *uid, size_t length) {
    if (!uid || length != sizeof(TAG_BINDINGS[0].uid)) return nullptr;
    for (const auto &binding : TAG_BINDINGS) {
        if (std::memcmp(uid, binding.uid, length) == 0) return &binding;
    }
    return nullptr;
}
struct NfcEvent {
    uint8_t uid[7] = {};
    uint8_t length = 0;
    bool changed = false;
    bool failed = false;
    uint32_t detectedMs = 0;
    uint32_t reads = 0;
    uint32_t switches = 0;
};
