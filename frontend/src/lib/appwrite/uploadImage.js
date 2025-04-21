import { ID, Permission, Role } from "appwrite"
import { appwriteConfig, storage } from "./config"


//Upload file
export async function uploadFile(file) {
    try {
        const uploadedFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file,
            [
                Permission.read(Role.any()),  // CHỈNH CHỖ NÀY
            ]
        )

        return uploadedFile
    } catch (error) {
        console.log(error)
    }
}

// Get file Url
export function getFilePreview(fileId) {
    try {
        const fileUrl = storage.getFileView(
            appwriteConfig.storageId,
            fileId,
        )

        if(!fileUrl) throw error 

        return fileUrl.href
    } catch (error) {
        console.log(error)
    }
}