import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Exporta as rotas GET e POST necessárias para o UploadThing funcionar
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
