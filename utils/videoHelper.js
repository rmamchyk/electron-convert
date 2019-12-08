const ffmpeg = require('fluent-ffmpeg');

function getVideoMetadata(video) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(video.path, (err, metadata) => {
      if (err) reject(err);
      resolve({
        ...video,
        duration: metadata.format.duration,
        format: 'avi'
      });
    });
  });
};

function convertVideo(video, onComplete, onProgress) {
  const outputDirectory = video.path.split(video.name)[0];
  const outputName = video.name.split('.')[0];
  const outputPath = `${outputDirectory}${outputName}.${video.format}`;

  ffmpeg(video.path)
    .output(outputPath)
    .on('progress', ({ timemark }) => onProgress(timemark))
    .on('end', () => onComplete(outputPath))
    .run();
}

module.exports = {
  getVideoMetadata,
  convertVideo
};