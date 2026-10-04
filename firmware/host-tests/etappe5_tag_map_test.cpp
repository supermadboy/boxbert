#include <cassert>
#include <cstring>
#include <iostream>
#include "../tests/etappe5_web_upload/TagMap.h"

int main() {
    const uint8_t tag1[] = {0xE3, 0x2F, 0xF6, 0x33};
    const uint8_t tag2[] = {0x01, 0x8C, 0xF1, 0x6E};
    const uint8_t unknown[] = {0xE3, 0x2F, 0xF6, 0x34};
    assert(findTagBinding(tag1, sizeof(tag1)) == &TAG_BINDINGS[0]);
    assert(findTagBinding(tag2, sizeof(tag2)) == &TAG_BINDINGS[1]);
    assert(std::strcmp(TAG_UIDS[0], "E3:2F:F6:33") == 0);
    assert(std::strcmp(TAG_UIDS[1], "01:8C:F1:6E") == 0);
    assert(findTagBinding(unknown, sizeof(unknown)) == nullptr);
    assert(findTagBinding(tag1, 3) == nullptr);
    assert(findTagBinding(tag1, 0) == nullptr);
    assert(findTagBinding(nullptr, sizeof(tag1)) == nullptr);
    std::cout << "Etappe 5: feste UIDs, Index, unbekannte UID OK\n";
}
