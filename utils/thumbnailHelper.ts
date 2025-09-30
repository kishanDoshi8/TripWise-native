import { IMAGES } from "@/constants/images.";
import { Thumbnail } from "@/types/thumbnail";
import { ImageSourcePropType } from "react-native";

export const getThumbnailSource = (thumbnail: Thumbnail | undefined | null): ImageSourcePropType => {
    if (!thumbnail) return IMAGES.placeholder;

	const { source, photoReference, url, image } = thumbnail;

	// if (source === "google" && photoReference) {
	// 	return {
	// 		uri: `${process.env.EXPO_PUBLIC_API_BASE_URL}/proxy/google-photo?photoReference=${photoReference}`,
	// 	};
	// } else 
	if (source === "url" && url) {
		return { uri: url };
	} else if (source === "image" && image) {
		return { uri: image };
	}

	return IMAGES.placeholder;
};
