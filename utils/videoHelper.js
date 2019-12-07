const { ffprobe } = require('fluent-ffmpeg');

function getVideoMetadata(video) {
  return new Promise((resolve, reject) => {
    ffprobe(video.path, (err, metadata) => {
      if (err) reject(err);
      resolve({
        ...video,
        duration: metadata.format.duration,
        format: 'avi'
      });
    });
  });
};

module.exports = {
  getVideoMetadata
};