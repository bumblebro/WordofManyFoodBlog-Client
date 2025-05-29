"use client";

import React from "react";
import { PinterestIcon, PinterestShareButton } from "react-share";

const PinComponent = ({ url, media, description }: any) => {
  return (
    <PinterestShareButton url={url} media={media} description={description}>
      <PinterestIcon size={32} round />
    </PinterestShareButton>
  );
};

export default PinComponent;
