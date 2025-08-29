"use client";
import { PinterestIcon, PinterestShareButton } from "react-share";

function ShareButtons({ urllink, imageUrl }: any) {
  return (
    <div>
      <PinterestShareButton url={urllink} media={imageUrl}>
        <PinterestIcon />
      </PinterestShareButton>
    </div>
  );
}

export default ShareButtons;
