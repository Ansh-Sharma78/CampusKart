package com.campuskart.api.storage;

import com.campuskart.api.common.BusinessException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService implements StorageService {

    private static final Map<String, String> ALLOWED_IMAGE_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp"
    );

    private final Path uploadDirectory;

    public LocalStorageService(
            @Value("${app.storage.upload-directory:uploads/products}") String uploadDirectory
    ) {
        this.uploadDirectory = Path.of(uploadDirectory)
                .toAbsolutePath()
                .normalize();

        createUploadDirectory();
    }

    @Override
    public StoredFile storeProductImage(MultipartFile file) {
        validateImage(file);

        String contentType = file.getContentType();
        String extension = ALLOWED_IMAGE_TYPES.get(contentType);
        String generatedFileName = UUID.randomUUID() + extension;

        Path destination = uploadDirectory.resolve(generatedFileName).normalize();

        ensureDestinationIsSafe(destination);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, destination, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException exception) {
            throw new BusinessException(
                    "Unable to store product image",
                    HttpStatus.INTERNAL_SERVER_ERROR
            );
        }

        return new StoredFile(
                "/uploads/products/" + generatedFileName,
                generatedFileName,
                contentType
        );
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BusinessException(
                    "Product image cannot be empty",
                    HttpStatus.BAD_REQUEST
            );
        }

        if (!ALLOWED_IMAGE_TYPES.containsKey(file.getContentType())) {
            throw new BusinessException(
                    "Only JPEG, PNG, and WebP images are allowed",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private void ensureDestinationIsSafe(Path destination) {
        if (!destination.startsWith(uploadDirectory)) {
            throw new BusinessException(
                    "Invalid image destination",
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private void createUploadDirectory() {
        try {
            Files.createDirectories(uploadDirectory);
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Could not create product image upload directory",
                    exception
            );
        }
    }
}