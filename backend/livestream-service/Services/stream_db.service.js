const Stream = require("../db/Models/StreamSchema");
const crypto = require("crypto");
class StreamDBService {
  constructor() {
    this.stream = Stream;
  }
  async createStream(
    streamKey,
    streamerName,
    streamAvatar = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Microsoft_Stream.svg/1200px-Microsoft_Stream.svg.png",
    streamName = "Untitled Stream",
    streamCategory = "General"
  ) {
    return await this.stream.create({
      streamKey,
      streamName,
      streamerName,
      streamCategory,
      streamAvatar,
    });
  }
  async getStream(streamKey) {
    return await this.stream.findOne({ streamKey });
  }
  async updateStream({ streamKey, streamName, streamCategory, streamAvatar }) {
    const stream = await this.stream.findOne({ streamKey });
    if (!stream) {
      return null;
    }
    if (streamName) {
      stream.streamName = streamName;
    }
    if (streamCategory) {
      stream.streamCategory = streamCategory;
    }
    if (streamAvatar) {
      stream.streamAvatar = streamAvatar;
    }
    return await stream.save();
  }
  async deleteStream(streamKey) {
    return await this.stream.deleteOne({ streamKey });
  }
  async getAllStreams(category = null) {
    if (category != null && category != "all") {
      return await this.stream
        .find({ streamCategory: category })
        .sort({ createdAt: -1 });
    }
    return await this.stream.find({});
  }
  async getSomeStreams(limit, category = null) {
    if (category != null && category != "all") {
      return await this.stream
        .find({ stream: category })
        .limit(limit)
        .sort({ createdAt: -1 });
    }
    return await this.stream.find({}).limit(limit);
  }

  async paginatedStreams(page, limit, category = null) {
    return new Promise((resolve, reject) => {
      let filterAction = {};
      if (category != null && category != "all") {
        filterAction = {
          streamCategory: category,
        };
      }
      let aggregateId = category != null ? "$streamCategory" : null;
      if (category === "all") aggregateId = null;
      this.stream.aggregate(
        [{ $match: {} }, { $group: { _id: aggregateId, count: { $sum: 1 } } }],
        (err, result) => {
          if (err) reject(err);
          let categoryCount = result.find(
            (obj) => obj._id === (category === "all" ? null : category)
          );
          categoryCount = categoryCount ? categoryCount.count : 0;
          const lastPage = Math.ceil(categoryCount / limit);
          if (page > lastPage) resolve(null);
          this.stream
            .find(filterAction)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .exec((err, streams) => {
              if (err) reject(err);
              if (streams.length > 0) {
                resolve({ streams, currentPage: page, lastPage });
              } else {
                resolve(null);
              }
            });
        }
      );
    });
  }
}
module.exports = new StreamDBService();
