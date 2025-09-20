import React, { useState } from "react";
import ImageNote from "./ImageNote";
import VideoNote from "./VideoNote";
import DocumentNote from "./DocumentNote";
import { TouchableOpacity } from 'react-native';
import MediaViewerModal from './MediaViewerModal';

const NoteMedia = ({ media, onRemove, onUpdate }) => {
  const [viewerVisible, setViewerVisible] = useState(false);
  const open = () => setViewerVisible(true);
  const close = () => setViewerVisible(false);
  // Pass the complete media object so MediaViewerModal can access all properties
  const mediaForViewer = { ...media };

  const handleCommentChange = (value) => {
    if (onUpdate) onUpdate({ comment: value });
  };

  switch (media.type) {
    case "image":
      return (
        <>
          <TouchableOpacity onPress={open}>
            <ImageNote imageUri={media.uri} onRemove={onRemove ? () => onRemove(media.id) : undefined} onCommentChange={handleCommentChange} />
          </TouchableOpacity>
          <MediaViewerModal visible={viewerVisible} onClose={close} media={mediaForViewer} />
        </>
      );
    case "video":
      return (
        <>
          <TouchableOpacity onPress={open}>
            <VideoNote videoUri={media.uri} onRemove={onRemove ? () => onRemove(media.id) : undefined} onCommentChange={handleCommentChange} />
          </TouchableOpacity>
          <MediaViewerModal visible={viewerVisible} onClose={close} media={mediaForViewer} />
        </>
      );
    case "document":
      return (
        <>
          <TouchableOpacity onPress={open}>
            <DocumentNote document={media} onRemove={onRemove ? () => onRemove(media.id) : undefined} onCommentChange={handleCommentChange} onOpen={open} />
          </TouchableOpacity>
          <MediaViewerModal visible={viewerVisible} onClose={close} media={mediaForViewer} />
        </>
      );
    default:
      return null;
  }
};

export default NoteMedia;
