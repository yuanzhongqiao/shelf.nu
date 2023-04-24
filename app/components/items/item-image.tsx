import { useEffect } from "react";
import type { Item } from "@prisma/client";

import { useFetcher } from "@remix-run/react";
import { tw } from "~/utils";

export const ItemImage = ({
  item,
  className,
  ...rest
}: {
  item: {
    itemId: Item["id"];
    mainImage: Item["mainImage"];
    mainImageExpiration: Date | string | null;
    alt: string;
  };
  className?: string;
  rest?: HTMLImageElement;
}) => {
  const fetcher = useFetcher();
  const { itemId, mainImage, mainImageExpiration, alt } = item;
  const url =
    mainImage || fetcher?.data?.mainImage || "/images/item-placeholder.png";

  useEffect(() => {
    if (mainImage && mainImageExpiration) {
      const now = new Date();
      const expiration = new Date(mainImageExpiration);

      if (now > expiration) {
        fetcher.submit(
          { itemId, mainImage: mainImage || "" },
          {
            method: "post",
            action: "/api/item/refresh-main-image",
          }
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <img src={url} className={tw(className)} alt={alt} {...rest} />;
};
