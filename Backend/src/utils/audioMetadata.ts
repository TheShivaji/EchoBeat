import { parseBuffer } from "music-metadata";

interface EmbeddedCover {
    buffer: Buffer;
    mimeType: string;
}

export const extractEmbeddedCover = async (
    audioBuffer: Buffer,
    mimeType?: string
): Promise<EmbeddedCover | null> => {
    const metadata = await parseBuffer(audioBuffer, mimeType);

    const pictures = metadata.common.picture;

    if (!pictures || pictures.length === 0) {
        return null;
    }

    const firstPicture = pictures[0];

    if (!firstPicture) {
        return null;
    }

    return {
        buffer: Buffer.from(firstPicture.data),
        mimeType: firstPicture.format,
    };
};