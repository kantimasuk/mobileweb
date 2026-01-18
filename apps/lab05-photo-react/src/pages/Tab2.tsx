import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFab,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
} from '@ionic/react';
import { camera } from 'ionicons/icons';
import { usePhotoGallery, UserPhoto } from '../hooks/usePhotoGallery';
import './Tab2.css';

const Tab2: React.FC = () => {
  const { photos, takePhoto, deletePhoto } = usePhotoGallery();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
          <IonTitle size="small">
            Lab 05 – นางสาวกานติมา สุคำภา 673380204-8
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        {photos.length > 0 && (
          <IonGrid>
            <IonRow>
              {photos.map((photo: UserPhoto, index: number) => (
                <IonCol size="6" key={index}>
                  <IonImg
                    src={photo.webviewPath}
                    onClick={() => deletePhoto(photo)}
                  />
                </IonCol>

              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>

      <IonFab slot="fixed" vertical="bottom" horizontal="center">
        <IonFabButton onClick={takePhoto}>
          <IonIcon icon={camera} />
        </IonFabButton>
      </IonFab>
    </IonPage>
  );
};

export default Tab2;