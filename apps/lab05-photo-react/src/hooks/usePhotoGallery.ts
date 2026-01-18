import { useState, useEffect } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
    filepath: string;
    webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
    const [photos, setPhotos] = useState<UserPhoto[]>([]);

    useEffect(() => {
        loadSaved();
    }, []);

    const takePhoto = async () => {
        const cameraPhoto = await Camera.getPhoto({
            resultType: CameraResultType.Uri,
            source: CameraSource.Camera,
            quality: 100,
        });

        const fileName = new Date().getTime() + '.jpeg';
        const savedFile = await savePicture(cameraPhoto, fileName);

        const newPhotos = [savedFile, ...photos];
        setPhotos(newPhotos);

        await Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(newPhotos),
        });
    };

    const savePicture = async (photo: any, fileName: string): Promise<UserPhoto> => {
        const response = await fetch(photo.webPath!);
        const blob = await response.blob();
        const base64Data = (await convertBlobToBase64(blob)) as string;

        await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Data,
        });

        return {
            filepath: fileName,
            webviewPath: Capacitor.convertFileSrc(
                (await Filesystem.getUri({
                    directory: Directory.Data,
                    path: fileName,
                })).uri
            ),
        };
    };

    const loadSaved = async () => {
        const { value } = await Preferences.get({ key: PHOTO_STORAGE });
        const photosInStorage: UserPhoto[] = value ? JSON.parse(value) : [];

        if (!Capacitor.isNativePlatform()) {
            for (let photo of photosInStorage) {
                const file = await Filesystem.readFile({
                    path: photo.filepath,
                    directory: Directory.Data,
                });
                photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
            }
        } else {
            photosInStorage.forEach((photo) => {
                photo.webviewPath = Capacitor.convertFileSrc(
                    `data/${photo.filepath}`
                );
            });
        }

        setPhotos(photosInStorage);
    };

    const deletePhoto = async (photo: UserPhoto) => {
        // 1. ลบไฟล์ออกจากเครื่อง
        await Filesystem.deleteFile({
            path: photo.filepath,
            directory: Directory.Data,
        });

        // 2. ลบออกจาก state
        const newPhotos = photos.filter((p) => p.filepath !== photo.filepath);
        setPhotos(newPhotos);

        // 3. อัปเดต Preferences
        await Preferences.set({
            key: PHOTO_STORAGE,
            value: JSON.stringify(newPhotos),
        });
    };


    return {
        photos,
        takePhoto,
        deletePhoto,
    };
}
const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });