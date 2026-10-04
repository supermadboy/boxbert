#include <cassert>
#include <cstring>
#include <iostream>
#include "../tests/etappe4_tag_player/TagMap.h"

int main() {
    const uint8_t tag1[] = {0xE3, 0x2F, 0xF6, 0x33};
    const uint8_t tag2[] = {0x01, 0x8C, 0xF1, 0x6E};
    const uint8_t unknown[] = {0xE3, 0x2F, 0xF6, 0x34};
    const uint8_t longer[] = {0xE3, 0x2F, 0xF6, 0x33, 0x00};
    const auto *first = findTagBinding(tag1, sizeof(tag1));
    const auto *second = findTagBinding(tag2, sizeof(tag2));
    assert(first && std::strcmp(first->name, "TAG1") == 0);
    assert(std::strcmp(first->path, "/arcade-music-loop.mp3") == 0);
    assert(second && std::strcmp(second->name, "TAG2") == 0);
    assert(std::strcmp(second->path, "/happy-tune.mp3") == 0);
    assert(first != second);
    assert(findTagBinding(unknown, sizeof(unknown)) == nullptr);
    assert(findTagBinding(tag1, 0) == nullptr);
    assert(findTagBinding(tag1, 3) == nullptr);
    assert(findTagBinding(longer, sizeof(longer)) == nullptr);
    assert(findTagBinding(nullptr, sizeof(tag1)) == nullptr);
    std::cout << "TagMap: beide Zuordnungen, unbekannte UID, Laengen und null OK\n";
}
