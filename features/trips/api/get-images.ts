import { apiRoutes } from "@/config/apiRoutes";
import api from "@/config/axiosConfig";
import { Image, ImageSchema } from "@/types/image";
import { useQuery } from "@tanstack/react-query";

const getRandomImages = async (): Promise<Image[]> => {
	const { url, method } = apiRoutes.trip.images;
	const randomImageUrl = url;
	const response = await api.request<{ images: Image[] }>({
		url: randomImageUrl,
		method,
	});
	const images = ImageSchema.array().parse(response.data.images);
	return images;
};

export const useFetchTripImages = () => {
	return useQuery({
		queryKey: ["images"],
		queryFn: getRandomImages,
	});
};
