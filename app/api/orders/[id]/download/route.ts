import JSZip from "jszip";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Hanya admin yang dapat melakukan aksi ini!");
  }

  const findOrder = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              imageConfiguration: true,
            },
          },
        },
      },
    },
  });

  if (!findOrder) {
    throw new Error("Pesanan tidak ditemukan!");
  }

  const zip = new JSZip();
  const folder = zip.folder(findOrder.orderNumber);

  const files = await Promise.all(
    findOrder.items.map(async (item) => {
      const response = await fetch(
        item.caseOption.imageConfiguration.croppedImageUrl || ""
      );
      const data = await response.arrayBuffer();

      return {
        name: item.id,
        data,
      };
    })
  );

  files.forEach((file) =>
    folder?.file(`${file.name}.png`, file.data, { base64: true })
  );

  const archive = await zip.generateAsync({ type: "blob" });
  return new Response(archive, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${findOrder.orderNumber}.zip`,
    },
  });
}
