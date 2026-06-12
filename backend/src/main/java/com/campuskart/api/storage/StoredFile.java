package com.campuskart.api.storage;

public record StoredFile(
        String url,
        String fileName,
        String contentType
) {
}