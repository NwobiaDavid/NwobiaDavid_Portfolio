/* eslint-disable @typescript-eslint/ban-ts-comment */

import { ReactNode, useEffect } from "react";
import useBlobity from "blobity/lib/react/useBlobity";
import { blobityConfig } from "@/constants/cursor";


const BlobProviders = ({ children }: { children: ReactNode }) => {
  const blobity = useBlobity(blobityConfig);

  useEffect(() => {
    if (blobity.current) {
      // @ts-ignore for debugging purposes or playing around
      window.blobity = blobity.current;
    }
  }, [blobity]);


  return <>{children}</>;
};

export default BlobProviders;