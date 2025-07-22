import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButtons";
import ImageViewers from "@/components/ImageViewers";
import domtoimage from 'dom-to-image';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useRef, useState } from "react";
import { ImageSourcePropType, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Index() {
  // creating a state variables
  const [ selectedImage, setSelectedImage ] = useState<string | undefined>(undefined);
  const [ showAppOptions, setShowAppOption ] = useState<boolean>(false);
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false);
  const [ pickedEmoji, setPickedEmoji ] = useState<ImageSourcePropType | undefined>(undefined);
  const [ status, requestPermission ] = MediaLibrary.usePermissions();
  const imageRef = useRef<View>(null);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri)
      setShowAppOption(true);
    } else {
      alert('You did not select any image.');
    }
  };

  const onReset = () => {
    setShowAppOption(false);
  };

  const onAddSticker = () => {
    setIsModalVisible(true)
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  }

  const onSaveImageAsync = async () => {
    if (Platform.OS !== 'web') {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert('Saved!');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      try {
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 320,
          height: 440,
        });

        let link = document.createElement('a');
        link.download = 'sticker-smash.jpeg';
        link.href = dataUrl;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  if (status === null) {
    requestPermission();
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.ImageContainer}>
        <View ref={imageRef} collapsable={false}>
          <ImageViewers imgSource={PlaceholderImage} selectedImage={selectedImage} />
          { pickedEmoji && <EmojiSticker imageSize={40} stickerSource={pickedEmoji} /> }
        </View>
      </View>
      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton icon="save-alt" label="Save" onPress={onSaveImageAsync} />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
        <Button label={'Choose a Photo'} theme={'primary'} onPress={pickImageAsync}/>
        <Button label={'Use this photo'} />
      </View>
      )}
    
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
  },
  ImageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center'
  },
   optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
})
