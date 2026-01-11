import { ref, onMounted } from 'vue';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo as CameraPhoto
} from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';

export interface Photo {
  filepath: string;
  webviewPath?: string;
}

const PHOTO_STORAGE = 'photos';

export function usePhotoGallery() {
  const photos = ref<Photo[]>([]);

  // โหลดรูปเมื่อเปิด composable
  onMounted(async () => {
    const storedPhotos = await Preferences.get({ key: PHOTO_STORAGE });
    photos.value = storedPhotos.value ? JSON.parse(storedPhotos.value) : [];

    // สำหรับ web: แปลงไฟล์เป็น URL เพื่อแสดง
    for (const photo of photos.value) {
      const file = await Filesystem.readFile({
        path: photo.filepath,
        directory: Directory.Data,
      });
      photo.webviewPath = `data:image/jpeg;base64,${file.data}`;
    }
  });

  const takePhoto = async () => {
    const cameraPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedFile = await savePicture(cameraPhoto);
    photos.value = [savedFile, ...photos.value];

    // บันทึกรายการรูป
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(photos.value),
    });
  };

  const savePicture = async (photo: CameraPhoto): Promise<Photo> => {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();

    const base64Data = (await convertBlobToBase64(blob)) as string;
    const fileName = new Date().getTime() + '.jpeg';

    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return {
      filepath: fileName,
      webviewPath: photo.webPath,
    };
  };

  const convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });

  return {
    photos,
    takePhoto,
  };
}