import React from "react";
import ImageNote from "./ImageNote";
import VideoNote from "./VideoNote";
import DocumentNote from "./DocumentNote";

const NoteMedia = ({ media, onRemove }) => {
  switch (media.type) {
    case "image":
      return <ImageNote imageUri={media.uri} onRemove={() => onRemove(media.id)} />;
    case "video":
      return <VideoNote videoUri={media.uri} onRemove={() => onRemove(media.id)} />;
    case "document":
      return <DocumentNote document={media} onRemove={() => onRemove(media.id)} />;  // Pass the entire 'document' object
    default:
      return null;
  }
};

export default NoteMedia;
