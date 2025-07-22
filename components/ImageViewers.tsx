import { Image } from "expo-image";
import { ImageSourcePropType, StyleSheet } from "react-native";

type Props = {
    imgSource: ImageSourcePropType;
    selectedImage?: string;
}

export default function ImageViewers({ imgSource, selectedImage }: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  return <Image source={imageSource} style={styles.Image} />;
}

const styles = StyleSheet.create({
  Image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  }
})