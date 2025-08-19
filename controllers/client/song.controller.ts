import { Request, Response } from "express";
import { Topic } from "../../models/topic.model";
import { Song } from "../../models/song.model";
import { Singer } from "../../models/singer.model";
import { FavoriteSong } from "../../models/favorite-song.model";

import unidecode from "unidecode";

// [GET] /songs/:slugTopic
export const index = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;

  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active",
  });

  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active",
  }).select("id title avatar singerId like slug");

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    });

    song["singerFullName"] = infoSinger ? infoSinger.fullName : "";
  }

  res.render("client/pages/songs/index", {
    pageTitle: topic.title,
    songs: songs,
  });
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  const slugSong = req.params.slugSong;

  const song = await Song.findOne({
    slug: slugSong,
    deleted: false,
    status: "active",
  });

  const singer = await Singer.findOne({
    _id: song.singerId,
  }).select("fullName");

  const topic = await Topic.findOne({
    _id: song.topicId,
  }).select("title");

  const existSongInFavorite = await FavoriteSong.findOne({
    songId: song.id,
    // user: res.locals.user.id
  });

  if (existSongInFavorite) {
    song["favorite"] = true;
  } else {
    song["favorite"] = false;
  }

  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic,
  });
};

export const likePatch = async (req: Request, res: Response) => {
  const { id, status } = req.body;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });

  if (song) {
    let updateLike = song.like;

    switch (status) {
      case "like":
        updateLike++;
        break;
      case "dislike":
        updateLike--;
        break;
      default:
        break;
    }

    await Song.updateOne(
      {
        _id: id,
        deleted: false,
        status: "active",
      },
      {
        like: updateLike,
      }
    );

    res.json({
      code: "success",
      like: updateLike,
    });
  } else {
    res.json({
      code: "error",
    });
  }
};

export const favoritePatch = async (req: Request, res: Response) => {
  const { id } = req.body;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });

  if (song) {
    const existSong = await FavoriteSong.findOne({
      songId: id,
      // userId: res.locals.user.id
    });

    if (existSong) {
      await FavoriteSong.deleteOne({
        songId: id,
        // userId: res.locals.user.id
      });
    } else {
      const record = new FavoriteSong({
        songId: id,
        // userId: res.locals.user.id
      });

      await record.save();
    }

    res.json({
      code: "success",
    });
  } else {
    res.json({
      code: "error",
    });
  }
};

export const favorite = async (req: Request, res: Response) => {
  const songs = await FavoriteSong.find({
    // user: res.locals.user.id
  });

  for (const song of songs) {
    const infoSong = await Song.findOne({
      _id: song.songId,
    });

    const infoSinger = await Singer.findOne({
      _id: infoSong.singerId,
    });

    song["title"] = infoSong.title;
    song["avatar"] = infoSong.avatar;
    song["singerFullName"] = infoSinger.fullName;
    song["slug"] = infoSong.slug;
  }

  res.render("client/pages/songs/favorite", {
    pageTitle: "Bài hát yêu thích",
    songs: songs,
  });
};

export const search = async (req: Request, res: Response) => {
  const type = req.params.type;
  const keyword = `${req.query.keyword}`;

  let keywordRegex = keyword.trim();
  keywordRegex = keywordRegex.replace(/\s+/g, "-");
  keywordRegex = unidecode(keywordRegex);

  const slugRegex = new RegExp(keywordRegex, "i");

  const songsFinal = [];

  const songs = await Song.find({
    slug: slugRegex,
  }).select("slug avatar title like singerId");

  for (const song of songs) {
    const infoSinger = await Singer.findOne({
      _id: song.singerId,
      deleted: false,
    });

    song["singerFullName"] = infoSinger ? infoSinger.fullName : "";

    songsFinal.push({
      id: song.id,
      slug: song.slug,
      avatar: song.avatar,
      title: song.title,
      like: song.like,
      singerId: song.singerId,
      singerFullName: song["singerFullName"],
    });
  }

  if (type == "result") {
    res.render("client/pages/songs/search", {
      pageTitle: `Kết quả tìm kiếm: ${keyword}`,
      keyword: keyword,
      songs: songsFinal,
    });
  } else if (type == "suggest") {
    res.json({
      songs: songsFinal,
    });
  }
};

export const listenPatch = async (req: Request, res: Response) => {
  const id = req.params.id;

  const song = await Song.findOne({
    _id: id,
    deleted: false,
    status: "active",
  });

  await Song.updateOne(
    {
      _id: id,
      deleted: false,
      status: "active",
    },
    {
      listen: song.listen + 1,
    }
  );

  const songNew = await Song.findOne({
    _id: id,
  });

  res.json({
    code: "success",
    listen: songNew.listen,
  });
};
