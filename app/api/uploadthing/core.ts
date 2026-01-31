import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Define uma rota de upload chamada "imageUploader"
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("Upload concluído com sucesso:", file.url);
      // Aqui você poderia salvar no banco, mas faremos isso no front-end
    },
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
