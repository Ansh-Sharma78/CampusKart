package com.campuskart.api.storage;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {

    StoredFile storeProductImage(MultipartFile file);
}